import Attendance from "../models/attendanceModel.js";
import Employee from "../models/employeeModels.js";
import Patient from "../models/patientModel.js";
import { istDayRange, istMinutesOfDay, startOfIstDay } from "./attendanceDay.js";

/**
 * Shift start and grace period used to decide whether an employee check-in
 * counts as late. Both are IST minutes-of-day; override in .env per clinic.
 */
export const SHIFT_START_MINUTES =
  Number(process.env.SHIFT_START_HOUR ?? 8) * 60 +
  Number(process.env.SHIFT_START_MINUTE ?? 0);
export const GRACE_MINUTES = Number(process.env.ATTENDANCE_GRACE_MINUTES ?? 15);

const MODELS = {
  employee: Employee,
  patient: Patient,
};

export const workedMinutes = (attendance) =>
  attendance?.inTime && attendance?.outTime
    ? Math.round((attendance.outTime - attendance.inTime) / 60000)
    : null;

/** The shape both punch endpoints and the dashboards share. */
export const publicRecord = (attendance) =>
  attendance
    ? {
        _id: attendance._id,
        date: attendance.date,
        inTime: attendance.inTime || null,
        outTime: attendance.outTime || null,
        late: !!attendance.late,
        status: attendance.status,
        workedMinutes: workedMinutes(attendance),
      }
    : null;

/**
 * The one place a person's day gets stamped. First call of the IST day is the
 * check-in, the second is the check-out, any further call is `done`.
 *
 * A record the admin marked by hand (no inTime) is promoted to a check-in
 * rather than treated as a check-out - otherwise a person marked Present in
 * the morning would have their own first punch recorded as leaving with no
 * arrival time.
 *
 * Returns { action: "in" | "out" | "done", attendance }.
 */
export const punchRecord = async ({ type, subjectId, now = new Date() }) => {
  const { start, end } = istDayRange(now);

  let attendance = await Attendance.findOne({
    id: subjectId,
    type,
    date: { $gte: start, $lt: end },
  });

  // Patients have no shift, so only employees can be late.
  const lateFor = () =>
    type === "employee" && istMinutesOfDay(now) > SHIFT_START_MINUTES + GRACE_MINUTES;

  if (!attendance) {
    attendance = await Attendance.create({
      id: subjectId,
      date: startOfIstDay(now),
      status: "Present",
      type,
      inTime: now,
      late: lateFor(),
    });

    await MODELS[type].findByIdAndUpdate(subjectId, {
      $push: { attendance: attendance._id },
    });

    return { action: "in", attendance };
  }

  if (!attendance.inTime) {
    attendance.inTime = now;
    attendance.status = "Present";
    attendance.late = lateFor();
    await attendance.save();
    return { action: "in", attendance };
  }

  if (!attendance.outTime) {
    attendance.outTime = now;
    await attendance.save();
    return { action: "out", attendance };
  }

  return { action: "done", attendance };
};
