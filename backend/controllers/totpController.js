import mongoose from "mongoose";
import QRCode from "qrcode";
import { generateSecret, generateURI, verify } from "otplib";
import Employee from "../models/employeeModels.js";

/**
 * TOTP enrolment for employee attendance.
 *
 * The employee scans a QR once with any authenticator app (Google
 * Authenticator, Microsoft Authenticator, Authy). After that their phone
 * produces a fresh 6-digit code every 30 seconds with no SMS, no WhatsApp and
 * no per-message cost.
 *
 * The secret is stored on the Employee document with `select: false`, so it is
 * never returned by an ordinary query. It is shown to the employee exactly
 * once, at enrolment.
 */

const ISSUER = process.env.TOTP_ISSUER || "Movement Rehab";

// ±30s of clock drift between the phone and the server.
export const EPOCH_TOLERANCE_SECONDS = 30;

/**
 * Verify a submitted code against an employee's enrolled secret, rejecting a
 * code that has already been used. Returns { valid, timeStep } - the caller
 * persists timeStep so the same code cannot be replayed for a second punch.
 */
export const verifyEmployeeCode = async (employee, token) => {
  const secret = employee.totp?.secret;
  if (!secret || !employee.totp?.enabled) {
    return { valid: false, reason: "NOT_ENROLLED" };
  }

  const result = await verify({
    token: String(token),
    secret,
    epochTolerance: EPOCH_TOLERANCE_SECONDS,
    // Rejects any code from a time step already spent by this employee.
    ...(employee.totp.lastCounter ? { afterTimeStep: employee.totp.lastCounter } : {}),
  });

  if (!result.valid) {
    return { valid: false, reason: "INVALID_CODE" };
  }
  return { valid: true, timeStep: result.timeStep };
};

/**
 * POST /api/attendance/totp/enroll
 * Starts enrolment for the logged-in employee and returns a QR to scan.
 * Refuses to overwrite an active enrolment unless `reset: true` is sent.
 */
export const enrollTotp = async (req, res) => {
  try {
    const employee = await Employee.findById(req.id).select(
      "+totp.secret +totp.lastCounter",
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    if (employee.totp?.enabled && req.body?.reset !== true) {
      return res.status(409).json({
        success: false,
        message:
          "An authenticator is already enrolled. Send { reset: true } to replace it.",
        code: "ALREADY_ENROLLED",
      });
    }

    const secret = await generateSecret();
    const label = employee.personalDetails?.employeeId || employee.personalDetails?.email;

    const uri = await generateURI({ secret, label, issuer: ISSUER });
    const qrDataUrl = await QRCode.toDataURL(uri);

    // Held as pending until the employee proves the app is working by
    // submitting a code to /totp/confirm. updateOne rather than save() so a
    // row with pre-existing invalid data can still enrol.
    await Employee.updateOne(
      { _id: employee._id },
      { $set: { totp: { secret, enabled: false } } },
    );

    return res.status(200).json({
      success: true,
      message: "Scan the QR with your authenticator app, then confirm a code",
      employeeId: employee.personalDetails?.employeeId,
      qrDataUrl,
      // For an authenticator that cannot scan - typed in manually instead.
      manualKey: secret,
    });
  } catch (error) {
    console.error("enrollTotp:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * POST /api/attendance/totp/confirm  { code }
 * Activates the pending enrolment once the employee submits a working code.
 */
export const confirmTotp = async (req, res) => {
  try {
    const { code } = req.body || {};

    if (!code) {
      return res.status(400).json({ success: false, message: "Code is required" });
    }

    const employee = await Employee.findById(req.id).select(
      "+totp.secret +totp.lastCounter",
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    if (!employee.totp?.secret) {
      return res.status(400).json({
        success: false,
        message: "Start enrolment first",
        code: "NOT_ENROLLED",
      });
    }

    const result = await verify({
      token: String(code),
      secret: employee.totp.secret,
      epochTolerance: EPOCH_TOLERANCE_SECONDS,
    });

    if (!result.valid) {
      return res.status(401).json({
        success: false,
        message: "That code did not match. Check the time on your phone and try again.",
        code: "INVALID_CODE",
      });
    }

    // Deliberately NOT spending the replay counter here. Confirming enrolment
    // proves the app works; it is not an attendance punch. Burning the counter
    // would force the employee to idle for 30s before their first check-in.
    // One code still maps to at most one punch, which is the rule that matters.
    const enrolledAt = new Date();
    await Employee.updateOne(
      { _id: employee._id },
      { $set: { "totp.enabled": true, "totp.enrolledAt": enrolledAt } },
    );
    employee.totp.enabled = true;
    employee.totp.enrolledAt = enrolledAt;

    return res.status(200).json({
      success: true,
      message: "Authenticator enrolled. Use it to mark attendance.",
      enrolledAt: employee.totp.enrolledAt,
    });
  } catch (error) {
    console.error("confirmTotp:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/** GET /api/attendance/totp/status - whether the caller has an authenticator set up. */
export const totpStatus = async (req, res) => {
  try {
    const employee = await Employee.findById(req.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    return res.status(200).json({
      success: true,
      employeeId: employee.personalDetails?.employeeId,
      fullName: employee.personalDetails?.fullName,
      enabled: !!employee.totp?.enabled,
      enrolledAt: employee.totp?.enrolledAt || null,
    });
  } catch (error) {
    console.error("totpStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * POST /api/attendance/totp/enroll-for   { employeeId, reset? }   (admin)
 *
 * The owner sets up an authenticator for a staff member, who usually has no
 * password of their own to give. The QR is shown on the owner's screen and the
 * employee scans it with their phone. `employeeId` is the Mongo _id from the
 * roster, not the printed MR-EMP code.
 *
 * Replacing an active enrolment (lost phone) needs `reset: true`. Note the old
 * authenticator stops working as soon as the new one is issued, before it is
 * confirmed - so confirm straight away.
 */
export const enrollTotpFor = async (req, res) => {
  try {
    const { employeeId, reset } = req.body || {};

    if (!employeeId || !mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({ success: false, message: "A valid employeeId is required" });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    if (employee.totp?.enabled && reset !== true) {
      return res.status(409).json({
        success: false,
        message: "This employee already has an authenticator. Send { reset: true } to replace it.",
        code: "ALREADY_ENROLLED",
      });
    }

    const secret = await generateSecret();
    const label = employee.personalDetails?.employeeId || employee.personalDetails?.email;
    const uri = await generateURI({ secret, label, issuer: ISSUER });
    const qrDataUrl = await QRCode.toDataURL(uri);

    await Employee.updateOne(
      { _id: employee._id },
      { $set: { totp: { secret, enabled: false } } },
    );

    return res.status(200).json({
      success: true,
      message: "Have the employee scan the QR, then enter a code to confirm",
      employee: {
        _id: employee._id,
        employeeId: employee.personalDetails?.employeeId || null,
        fullName: employee.personalDetails?.fullName,
      },
      qrDataUrl,
      manualKey: secret,
    });
  } catch (error) {
    console.error("enrollTotpFor:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/** POST /api/attendance/totp/confirm-for   { employeeId, code }   (admin) */
export const confirmTotpFor = async (req, res) => {
  try {
    const { employeeId, code } = req.body || {};

    if (!employeeId || !mongoose.isValidObjectId(employeeId) || !code) {
      return res.status(400).json({ success: false, message: "employeeId and code are required" });
    }

    const employee = await Employee.findById(employeeId).select("+totp.secret");
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    if (!employee.totp?.secret) {
      return res.status(400).json({
        success: false,
        message: "Start enrolment first",
        code: "NOT_ENROLLED",
      });
    }

    const result = await verify({
      token: String(code),
      secret: employee.totp.secret,
      epochTolerance: EPOCH_TOLERANCE_SECONDS,
    });

    if (!result.valid) {
      return res.status(401).json({
        success: false,
        message: "That code did not match. Check the time on the phone and try again.",
        code: "INVALID_CODE",
      });
    }

    await Employee.updateOne(
      { _id: employee._id },
      { $set: { "totp.enabled": true, "totp.enrolledAt": new Date() } },
    );

    return res.status(200).json({
      success: true,
      message: "Authenticator enrolled. They can now check in with their Employee ID and code.",
    });
  } catch (error) {
    console.error("confirmTotpFor:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
