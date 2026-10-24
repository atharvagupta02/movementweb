import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import enquiryRouter from "./routes/enquiryRoute.js";
import patientRouter from "./routes/patientRoute.js";
import assessmentRouter from "./routes/assesmentRoute.js";
import clientRouter from "./routes/clientRoute.js";
import reportRouter from "./routes/reportRoute.js";
import employeeRouter from "./routes/employeeRoute.js";
import treatmentPlanRouter from "./routes/treatmentPlanRoute.js";
import attendanceRouter from "./routes/attendanceRoute.js";

//App config
const app = express();

//middewares

// req.ip must be the real client for the clinic IP allowlist (middleware/clinicIp.js).
// Behind a proxy (Vercel, nginx, Cloudflare) set TRUST_PROXY to the number of
// proxy hops, e.g. TRUST_PROXY=1. Leave it unset when Express is exposed
// directly - trusting a proxy that is not there lets a client forge
// X-Forwarded-For and bypass the allowlist.
if (process.env.TRUST_PROXY) {
  const hops = Number(process.env.TRUST_PROXY);
  app.set("trust proxy", Number.isNaN(hops) ? process.env.TRUST_PROXY : hops);
}

app.use(express.json());

// CORS_ORIGINS = comma-separated list of the frontend URLs allowed to call this
// API, e.g. https://staff.example.com. Unset (local development) allows any
// origin; set it in production so only your own site can use staff logins.
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : "*" }));

//api end points
app.use("/api/user", userRouter);
app.use("/api/enquiry", enquiryRouter);
app.use("/api/patient", patientRouter);
app.use("/api/assessment", assessmentRouter);
app.use("/api/client", clientRouter);
app.use("/api/report", reportRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/treatmentPlan", treatmentPlanRouter);
app.use("/api/attendance",attendanceRouter );

app.get("/", (req, res) => {
  res.send("API working");
});

export default app;
