import app from "../app.js";
import connectDb from "../config/mongodb.js";

/**
 * Vercel serverless entry. Every request lands here (see vercel.json).
 *
 * The database connection is opened once per warm function instance and reused
 * (connectDb is idempotent), so only a cold start pays for it. If the database
 * cannot be reached the request gets a clear 503 instead of hanging.
 */
export default async function handler(req, res) {
  try {
    await connectDb();
  } catch (error) {
    console.error("Database unavailable:", error.message);
    // Plain Node response calls: Express has not wrapped `res` yet at this point,
    // so res.status()/res.json() are not guaranteed to exist.
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        success: false,
        message: "The service is temporarily unavailable. Please try again.",
        code: "DB_UNAVAILABLE",
      }),
    );
  }

  return app(req, res);
}
