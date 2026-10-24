import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/mongodb.js";
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
const port = process.env.PORT || 8080;

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
app.use(
  cors({
    origin: "*",
  })
);

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

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log("server started on PORT:" + port);
    });
  })
  .catch((error) => {
    // Fail loudly rather than listening without a database.
    console.error("Failed to connect to MongoDB - server not started.");
    console.error(error.message);
    process.exit(1);
  });
