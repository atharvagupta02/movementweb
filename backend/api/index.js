import app from "../app.js";

/**
 * Vercel serverless entry. Every request lands here (see vercel.json).
 * The Express app connects to the database itself (see app.js), so this only
 * needs to hand requests to it.
 */
export default app;
