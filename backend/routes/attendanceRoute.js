import express from "express";
import {
  createAttendance,
  createEmployeeAttendance,
  selfCheckIn,
  myAttendanceToday,
  employeeAttendanceDay,
  markEmployeeAttendance,
  employeeAttendanceMonth,
} from "../controllers/attendanceController.js";
import {
  enrollTotp,
  confirmTotp,
  totpStatus,
  enrollTotpFor,
  confirmTotpFor,
} from "../controllers/totpController.js";

import {
  employeePunch,
  myAttendanceMonth,
  patientPunch,
} from "../controllers/portalController.js";

import employeeAuth from "../middleware/employeeAuth.js";
import clinicIp from "../middleware/clinicIp.js";
import adminOnly from "../middleware/adminOnly.js";

const attendanceRouter = express.Router();

attendanceRouter.post("/createAttendance", employeeAuth, createAttendance);

// Admin marks attendance on an employee's behalf.
attendanceRouter.post(
  "/createEmployeeAttendance",
  employeeAuth,
  adminOnly,
  createEmployeeAttendance,
);

// The admin roster screen: who is in today, and marking those who did not punch.
attendanceRouter.get("/day", employeeAuth, adminOnly, employeeAttendanceDay);
attendanceRouter.post("/markEmployee", employeeAuth, adminOnly, markEmployeeAttendance);
attendanceRouter.get("/month", employeeAuth, adminOnly, employeeAttendanceMonth);

// --- Employee self-service attendance (TOTP) ---

// Authenticator enrolment. Enrolment is deliberately NOT IP-restricted so an
// employee can set their app up before their first shift.
attendanceRouter.get("/totp/status", employeeAuth, totpStatus);
attendanceRouter.post("/totp/enroll", employeeAuth, enrollTotp);
attendanceRouter.post("/totp/confirm", employeeAuth, confirmTotp);

// Owner sets an authenticator up for a staff member (QR shown on the owner's screen).
attendanceRouter.post("/totp/enroll-for", employeeAuth, adminOnly, enrollTotpFor);
attendanceRouter.post("/totp/confirm-for", employeeAuth, adminOnly, confirmTotpFor);

// The punch itself: logged in (employeeAuth) + on the clinic network
// (clinicIp) + holding the enrolled phone (TOTP code, checked in selfCheckIn).
attendanceRouter.get("/me/today", employeeAuth, myAttendanceToday);
attendanceRouter.post("/selfCheckIn", employeeAuth, clinicIp, selfCheckIn);

// --- Attendance portal: no session needed, the ID plus a proof identifies them ---

// Staff: Employee ID + authenticator code. First call of the day checks in and
// logs in, the second checks out. Clinic network only.
attendanceRouter.post("/punch", clinicIp, employeePunch);

// The signed-in employee's own month for their dashboard.
attendanceRouter.get("/me/month", employeeAuth, myAttendanceMonth);

// Patients: Patient ID + registered mobile number. Clinic network only.
attendanceRouter.post("/patient/punch", clinicIp, patientPunch);

export default attendanceRouter;
