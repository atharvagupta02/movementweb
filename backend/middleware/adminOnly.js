import Employee from "../models/employeeModels.js";

/**
 * Allows the request through only for the configured admin.
 *
 * Admin identity is config-driven (ADMIN_EMAIL) rather than a DB role, which
 * matches how the frontend decides what to show. Run this after employeeAuth,
 * which is what sets req.id.
 */
const adminOnly = async (req, res, next) => {
  try {
    if (!process.env.ADMIN_EMAIL) {
      return res.status(500).json({
        success: false,
        message: "ADMIN_EMAIL is not configured",
        code: "ADMIN_NOT_CONFIGURED",
      });
    }

    const caller = await Employee.findById(req.id)
      .select("personalDetails.email")
      .lean();

    if (!caller) {
      return res.status(401).json({ success: false, message: "Employee not found" });
    }

    if (caller.personalDetails?.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Only admin can perform this action",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export default adminOnly;
