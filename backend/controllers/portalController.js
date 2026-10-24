import jwt from "jsonwebtoken";
import Attendance from "../models/attendanceModel.js";
import Employee from "../models/employeeModels.js";
import Patient from "../models/patientModel.js";
import TreatmentPlan from "../models/treatmentPlanModels.js";
import sanitizeEmployee from "../utils/sanitizeEmployee.js";
import { startOfIstDay } from "../utils/attendanceDay.js";
import { createLimiter } from "../utils/attemptLimiter.js";
import {
  GRACE_MINUTES,
  SHIFT_START_MINUTES,
  publicRecord,
  punchRecord,
} from "../utils/punch.js";
import { verifyEmployeeCode } from "./totpController.js";

/**
 * The attendance portal's public endpoints. The person at the front desk
 * machine is not logged in yet, so these identify them from what they type
 * (an ID) and prove it with something only they hold (an authenticator code
 * for staff, the registered mobile number for patients).
 */

// 8 wrong guesses per ID and 30 per network address in 15 minutes.
const WINDOW_MS = 15 * 60 * 1000;
const perIdLimiter = createLimiter({ max: 8, windowMs: WINDOW_MS });
const perIpLimiter = createLimiter({ max: 30, windowMs: WINDOW_MS });

// A workday token. Check-out logs the person out on the client, this is only
// the backstop for someone who walks away without doing it.
const PUNCH_TOKEN_TTL = "12h";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Exact, case-insensitive match so "mr001" finds "MR001". */
const idMatcher = (raw) => new RegExp(`^${escapeRegex(String(raw).trim())}$`, "i");

const limitKeys = (req, id) => ({
  idKey: `${req.ip}|${String(id).trim().toLowerCase()}`,
  ipKey: req.ip,
});

const blockedSeconds = ({ idKey, ipKey }) =>
  Math.max(perIdLimiter.blockedFor(idKey), perIpLimiter.blockedFor(ipKey));

const tooManyAttempts = (res, seconds) =>
  res.status(429).json({
    success: false,
    message: `Too many wrong attempts. Try again in ${Math.ceil(seconds / 60)} minute(s).`,
    code: "TOO_MANY_ATTEMPTS",
    retryAfterSeconds: seconds,
  });

const recordFailure = (keys) => {
  perIdLimiter.fail(keys.idKey);
  perIpLimiter.fail(keys.ipKey);
};

const serverError = (res, label, error) => {
  console.error(`${label}:`, error);
  return res.status(500).json({
    success: false,
    message: "Server error",
    error: error.message,
  });
};

/**
 * POST /api/attendance/punch   { employeeId, code }   (clinic network only)
 *
 * The start-of-day and end-of-day action. First call of the day checks the
 * employee in and logs them in (returns a token); the second checks them out.
 * Needs no existing session - the authenticator code is the proof.
 */
export const employeePunch = async (req, res) => {
  try {
    const { employeeId, code } = req.body || {};

    if (!employeeId || !code) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and authenticator code are required",
      });
    }

    const keys = limitKeys(req, employeeId);
    const blocked = blockedSeconds(keys);
    if (blocked) return tooManyAttempts(res, blocked);

    const employee = await Employee.findOne({
      "personalDetails.employeeId": idMatcher(employeeId),
    }).select("+totp.secret +totp.lastCounter");

    if (!employee) {
      recordFailure(keys);
      return res.status(401).json({
        success: false,
        message: "Employee ID or code is incorrect",
        code: "INVALID_CODE",
      });
    }

    if (employee.personalDetails?.status === "Inactive") {
      return res.status(403).json({ success: false, message: "This employee is inactive" });
    }

    const check = await verifyEmployeeCode(employee, code);

    if (!check.valid) {
      if (check.reason === "NOT_ENROLLED") {
        return res.status(400).json({
          success: false,
          message: "No authenticator set up for this ID yet. Set one up first.",
          code: "NOT_ENROLLED",
        });
      }
      recordFailure(keys);
      return res.status(401).json({
        success: false,
        message: "Employee ID or code is incorrect, or the code was already used.",
        code: "INVALID_CODE",
      });
    }

    // Spend the code before stamping the day so one 30s code cannot punch in
    // and out together.
    await Employee.updateOne(
      { _id: employee._id },
      { $set: { "totp.lastCounter": check.timeStep } },
    );
    perIdLimiter.clear(keys.idKey);

    const { action, attendance } = await punchRecord({
      type: "employee",
      subjectId: employee._id,
    });

    if (action === "done") {
      return res.status(409).json({
        success: false,
        message: "Check-in and check-out are already recorded for today",
        code: "ALREADY_COMPLETE",
        data: publicRecord(attendance),
      });
    }

    const body = {
      success: true,
      message:
        action === "in"
          ? `Check-in marked${attendance.late ? " (late)" : ""}`
          : "Check-out marked",
      action,
      data: publicRecord(attendance),
      employee: sanitizeEmployee(employee),
    };

    // Starting the day is what logs the employee in.
    if (action === "in") {
      body.token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, {
        expiresIn: PUNCH_TOKEN_TTL,
      });
    }

    return res.status(action === "in" ? 201 : 200).json(body);
  } catch (error) {
    return serverError(res, "employeePunch", error);
  }
};

const istDayKey = (date) =>
  new Date(new Date(date).getTime() + 5.5 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

/**
 * GET /api/attendance/me/month?month=YYYY-MM   (logged-in employee)
 * The signed-in employee's own days for the dashboard calendar, plus the
 * clinic shift rules the late flag is judged against.
 */
export const myAttendanceMonth = async (req, res) => {
  try {
    const month =
      req.query.month ||
      new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 7);

    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({ success: false, message: "month must be YYYY-MM" });
    }

    const [year, monthIndex] = month.split("-").map(Number);
    const nextMonth =
      monthIndex === 12 ? `${year + 1}-01` : `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    const start = startOfIstDay(new Date(`${month}-01T00:00:00+05:30`));
    const end = startOfIstDay(new Date(`${nextMonth}-01T00:00:00+05:30`));

    const records = await Attendance.find({
      id: req.id,
      type: "employee",
      date: { $gte: start, $lt: end },
    })
      .sort({ date: -1 })
      .lean();

    const days = {};
    const counts = { present: 0, absent: 0, leave: 0, late: 0 };
    for (const record of records) {
      days[istDayKey(record.date)] = {
        status: record.status,
        inTime: record.inTime || null,
        outTime: record.outTime || null,
        late: !!record.late,
        source: record.inTime ? "self" : "admin",
      };
      if (record.status === "Present") counts.present += 1;
      if (record.status === "Absent") counts.absent += 1;
      if (record.status === "Leave") counts.leave += 1;
      if (record.late) counts.late += 1;
    }

    return res.status(200).json({
      success: true,
      month,
      days,
      counts,
      shift: {
        startMinutes: SHIFT_START_MINUTES,
        graceMinutes: GRACE_MINUTES,
      },
    });
  } catch (error) {
    return serverError(res, "myAttendanceMonth", error);
  }
};

/**
 * POST /api/attendance/patient/punch   { patientId, contactNumber }   (clinic network only)
 *
 * Starts a session on the first call of the day and ends it on the second.
 * A patient has no authenticator, so the registered mobile number is the
 * second factor and the clinic network is what makes it meaningful.
 */
export const patientPunch = async (req, res) => {
  try {
    const { patientId, contactNumber } = req.body || {};

    if (!patientId || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: "Patient ID and registered mobile number are required",
      });
    }

    const keys = limitKeys(req, patientId);
    const blocked = blockedSeconds(keys);
    if (blocked) return tooManyAttempts(res, blocked);

    const patient = await Patient.findOne({
      "personalDetails.patientId": idMatcher(patientId),
    });

    const matches =
      patient &&
      String(patient.personalDetails.contactNumber) ===
        String(contactNumber).replace(/\D/g, "");

    if (!matches) {
      recordFailure(keys);
      return res.status(401).json({
        success: false,
        message: "Patient ID and mobile number do not match",
        code: "BAD_CREDENTIALS",
      });
    }

    if (patient.personalDetails.patientStatus === false) {
      return res.status(403).json({
        success: false,
        message: "This patient is marked inactive. Please contact the clinic.",
      });
    }

    perIdLimiter.clear(keys.idKey);

    const { action, attendance } = await punchRecord({
      type: "patient",
      subjectId: patient._id,
    });

    const monthStart = startOfIstDay(
      new Date(`${new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 7)}-01T00:00:00+05:30`),
    );

    const [recent, attended, missed, attendedThisMonth, plan] = await Promise.all([
      Attendance.find({ id: patient._id, type: "patient" }).sort({ date: -1 }).limit(30).lean(),
      Attendance.countDocuments({ id: patient._id, type: "patient", status: "Present" }),
      Attendance.countDocuments({ id: patient._id, type: "patient", status: "Absent" }),
      Attendance.countDocuments({
        id: patient._id,
        type: "patient",
        status: "Present",
        date: { $gte: monthStart },
      }),
      TreatmentPlan.findOne({ patientId: patient._id }).sort({ createdAt: -1 }).lean(),
    ]);

    return res.status(200).json({
      success: true,
      message:
        action === "in"
          ? "Session started"
          : action === "out"
            ? "Session ended"
            : "Today's session is already recorded",
      action,
      data: publicRecord(attendance),
      patient: {
        name: patient.personalDetails.name,
        patientId: patient.personalDetails.patientId,
        chiefComplaint: patient.personalDetails.chiefComplaint,
      },
      stats: { attended, missed, attendedThisMonth },
      recent: recent.map((record) => ({
        day: istDayKey(record.date),
        status: record.status,
        inTime: record.inTime || null,
        outTime: record.outTime || null,
      })),
      plan: plan
        ? {
            exercises: plan.exercises,
            progressionStrategy: plan.progressionStrategy,
            updatedAt: plan.updatedAt,
          }
        : null,
    });
  } catch (error) {
    return serverError(res, "patientPunch", error);
  }
};
