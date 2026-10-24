import Attendance from "../models/attendanceModel.js";
import Employee from "../models/employeeModels.js";
import Patient from "../models/patientModel.js";
import { verifyEmployeeCode } from "./totpController.js";
import { istDayRange, startOfIstDay } from "../utils/attendanceDay.js";
import { publicRecord, punchRecord } from "../utils/punch.js";

export const createAttendance = async (req, res) => {
  try {
    const { patientId, date, status } = req.body;

    console.log("patientId", patientId);
    console.log("date", date);
    console.log("status", status);

    if (!patientId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const existing = await Attendance.findOne({
      id: patientId,
      date,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this date",
      });
    }

    const attendance = await Attendance.create({
      id:patientId,
      date: new Date(date),
      status,
      type: "patient",
    });

    const updatePatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        $push: { attendance: attendance._id },
      },
      { new: true },
    );

    res.status(201).json({
      success: true,
      message: "Attendance added successfully",
      data: attendance,
      patient: updatePatient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const createEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;
    const loginEmployeeId = req.id;

    console.log("EmployeeId", employeeId);
    console.log("date", date);
    console.log("status", status);

    if (!employeeId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const loginEmployee = await Employee.findById(loginEmployeeId);
    if (!loginEmployee) {
      return res.status(401).json({
        success: false,
        message: "Employee not found",
      });
    }
    if (loginEmployee.personalDetails.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Only admin can add employee attendance",
      });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const existing = await Attendance.findOne({
      id: employeeId,
      date,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this date",
      });
    }

    const attendance = await Attendance.create({
      id: employeeId,
      date: new Date(date),
      status,
      type: "employee",
    });

    const updateEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      {
        $push: { attendance: attendance._id },
      },
      { new: true },
    );

    res.status(201).json({
      success: true,
      message: "Attendance added successfully",
      data: attendance,
      employee: updateEmployee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * POST /api/attendance/selfCheckIn   { code }
 *
 * The employee's own attendance punch, authorised by a code from their
 * enrolled authenticator app. First call of the day records check-in, second
 * records check-out. Guarded by employeeAuth (who they are) and clinicIp
 * (where they are); the TOTP code proves possession of the enrolled phone.
 */
export const selfCheckIn = async (req, res) => {
  try {
    const { code } = req.body || {};

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authenticator code is required",
      });
    }

    const employee = await Employee.findById(req.id).select(
      "+totp.secret +totp.lastCounter",
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (employee.personalDetails?.status === "Inactive") {
      return res.status(403).json({
        success: false,
        message: "This employee is inactive",
      });
    }

    const check = await verifyEmployeeCode(employee, code);

    if (!check.valid) {
      if (check.reason === "NOT_ENROLLED") {
        return res.status(400).json({
          success: false,
          message: "No authenticator enrolled. Set one up first.",
          code: "NOT_ENROLLED",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid or already-used code. Wait for the next one.",
        code: "INVALID_CODE",
      });
    }

    // Spend the code before doing anything else, so the same 30s code cannot
    // be replayed to punch in and out in one go.
    await Employee.updateOne(
      { _id: employee._id },
      { $set: { "totp.lastCounter": check.timeStep } },
    );

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

    return res.status(action === "in" ? 201 : 200).json({
      success: true,
      message:
        action === "in"
          ? `Check-in marked${attendance.late ? " (late)" : ""}`
          : "Check-out marked",
      action,
      data: publicRecord(attendance),
    });
  } catch (error) {
    console.error("selfCheckIn:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * GET /api/attendance/me/today
 * Today's own record plus enrolment state - what the attendance screen needs
 * on load to decide between "enrol", "check in" and "check out".
 */
export const myAttendanceToday = async (req, res) => {
  try {
    const employee = await Employee.findById(req.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const { start, end } = istDayRange();

    const attendance = await Attendance.findOne({
      id: employee._id,
      type: "employee",
      date: { $gte: start, $lt: end },
    });

    const workedMinutes =
      attendance?.inTime && attendance?.outTime
        ? Math.round((attendance.outTime - attendance.inTime) / 60000)
        : null;

    return res.status(200).json({
      success: true,
      employee: {
        employeeId: employee.personalDetails?.employeeId,
        fullName: employee.personalDetails?.fullName,
      },
      totpEnabled: !!employee.totp?.enabled,
      nextAction: !attendance ? "in" : !attendance.outTime ? "out" : "done",
      today: attendance
        ? {
            _id: attendance._id,
            date: attendance.date,
            inTime: attendance.inTime,
            outTime: attendance.outTime,
            late: attendance.late,
            status: attendance.status,
            workedMinutes,
          }
        : null,
    });
  } catch (error) {
    console.error("myAttendanceToday:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * GET /api/attendance/day?date=YYYY-MM-DD   (admin)
 *
 * One row per employee for the given IST day: the TOTP punch if they made
 * one, otherwise whatever the admin marked, otherwise nothing. This is the
 * single view that reconciles self check-in with manual marking - without it
 * the two write to the same collection but are never read together.
 */
export const employeeAttendanceDay = async (req, res) => {
  try {
    const dateParam = req.query.date;
    const at = dateParam ? new Date(`${dateParam}T00:00:00+05:30`) : new Date();

    if (Number.isNaN(at.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date. Use YYYY-MM-DD.",
      });
    }

    const { start, end } = istDayRange(at);

    const employees = await Employee.find()
      .select("personalDetails.fullName personalDetails.employeeId personalDetails.employeeType totp.enabled")
      .lean();

    const records = await Attendance.find({
      type: "employee",
      date: { $gte: start, $lt: end },
    }).lean();

    const byEmployee = new Map(records.map((r) => [String(r.id), r]));

    const roster = employees.map((employee) => {
      const record = byEmployee.get(String(employee._id));
      return {
        employeeId: employee._id,
        code: employee.personalDetails?.employeeId || null,
        name: employee.personalDetails?.fullName || "(unnamed)",
        role: employee.personalDetails?.employeeType || null,
        authenticator: !!employee.totp?.enabled,
        status: record?.status || null,
        inTime: record?.inTime || null,
        outTime: record?.outTime || null,
        late: record?.late || false,
        // Distinguishes a punch the employee made from a status the admin
        // typed, so the UI can show one as evidence and the other as a note.
        source: record ? (record.inTime ? "self" : "admin") : null,
      };
    });

    res.status(200).json({
      success: true,
      date: start,
      roster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * POST /api/attendance/markEmployee   { employeeId, date, status }   (admin)
 *
 * Sets a status for a day, replacing one already there. createEmployeeAttendance
 * refuses to touch an existing record, which leaves the admin unable to correct
 * a mistake; this is the one that the roster screen uses.
 *
 * A TOTP punch is never overwritten silently - clearing it would destroy the
 * recorded in/out times - so changing one is refused unless ?force=1.
 */
export const markEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "employeeId, date and status are all required",
      });
    }

    if (!["Present", "Absent", "Leave"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be Present, Absent or Leave",
      });
    }

    const employee = await Employee.findById(employeeId).select("_id").lean();
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const at = new Date(`${date}T00:00:00+05:30`);
    if (Number.isNaN(at.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date. Use YYYY-MM-DD." });
    }
    const { start, end } = istDayRange(at);

    const existing = await Attendance.findOne({
      id: employeeId,
      type: "employee",
      date: { $gte: start, $lt: end },
    });

    if (existing?.inTime && req.query.force !== "1") {
      return res.status(409).json({
        success: false,
        code: "HAS_SELF_CHECKIN",
        message:
          "This employee checked in themselves. Re-send with ?force=1 to override the punch.",
        data: existing,
      });
    }

    if (existing) {
      existing.status = status;
      await existing.save();
      return res.status(200).json({
        success: true,
        message: "Attendance updated",
        data: existing,
      });
    }

    const attendance = await Attendance.create({
      id: employeeId,
      date: start,
      status,
      type: "employee",
    });

    await Employee.updateOne(
      { _id: employeeId },
      { $push: { attendance: attendance._id } },
    );

    res.status(201).json({
      success: true,
      message: "Attendance marked",
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * GET /api/attendance/month?month=YYYY-MM   (admin)
 *
 * Every employee's record for a whole month, for the all-staff report. One
 * query for the month rather than 30 calls to /day.
 */
export const employeeAttendanceMonth = async (req, res) => {
  try {
    const month = req.query.month;
    if (!/^\d{4}-\d{2}$/.test(month || "")) {
      return res.status(400).json({
        success: false,
        message: "month is required as YYYY-MM",
      });
    }

    const [year, monthIndex] = month.split("-").map(Number);
    if (monthIndex < 1 || monthIndex > 12) {
      return res.status(400).json({ success: false, message: "Invalid month" });
    }

    const start = startOfIstDay(new Date(`${month}-01T00:00:00+05:30`));
    const nextMonth =
      monthIndex === 12 ? `${year + 1}-01` : `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    const end = startOfIstDay(new Date(`${nextMonth}-01T00:00:00+05:30`));

    const employees = await Employee.find()
      .select(
        "personalDetails.fullName personalDetails.employeeId personalDetails.employeeType personalDetails.status",
      )
      .lean();

    const records = await Attendance.find({
      type: "employee",
      date: { $gte: start, $lt: end },
    }).lean();

    const byEmployee = new Map();
    for (const record of records) {
      const key = String(record.id);
      if (!byEmployee.has(key)) byEmployee.set(key, []);
      byEmployee.get(key).push(record);
    }

    const istDayKey = (date) =>
      new Date(new Date(date).getTime() + 5.5 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    const staff = employees.map((employee) => {
      const mine = byEmployee.get(String(employee._id)) || [];
      const days = {};
      let present = 0;
      let absent = 0;
      let leave = 0;
      let late = 0;

      for (const record of mine) {
        days[istDayKey(record.date)] = {
          status: record.status,
          inTime: record.inTime || null,
          outTime: record.outTime || null,
          late: record.late || false,
          source: record.inTime ? "self" : "admin",
        };
        if (record.status === "Present") present += 1;
        if (record.status === "Absent") absent += 1;
        if (record.status === "Leave") leave += 1;
        if (record.late) late += 1;
      }

      return {
        employeeId: employee._id,
        code: employee.personalDetails?.employeeId || null,
        name: employee.personalDetails?.fullName || "(unnamed)",
        role: employee.personalDetails?.employeeType || null,
        active: employee.personalDetails?.status !== "Inactive",
        present,
        absent,
        leave,
        late,
        days,
      };
    });

    res.status(200).json({ success: true, month, staff });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
