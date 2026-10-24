import jwt from "jsonwebtoken";

/**
 * Patient/user login check (JWT carrying `contactNumber`). Staff routes use
 * employeeAuth instead; a staff token has no contactNumber and is refused here,
 * the same way a patient token is refused by employeeAuth.
 */
const authUser = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({
      message: "You are not authorized , login again",
      success: false,
    });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!token_decode?.contactNumber) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    req.contactNumber = token_decode.contactNumber;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export default authUser;
