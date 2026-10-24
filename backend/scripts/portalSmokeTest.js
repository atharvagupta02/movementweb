/**
 * End-to-end smoke test for the attendance portal endpoints:
 * employee login -> authenticator enrolment -> punch in -> punch out, the
 * replay / brute-force protections, admin-marked-first days, and the patient
 * session punch.
 *
 * It seeds its own employee and patient and writes real attendance rows, so it
 * REFUSES to run unless MONGO_URI points at this machine. Run it against a
 * throwaway database, with a backend started against that same database:
 *
 *   mongod --dbpath /tmp/mwdata --port 27099 &
 *   MONGO_URI=mongodb://127.0.0.1:27099/mwtest CLINIC_IPS=127.0.0.1,::1 PORT=8099 node server.js &
 *   MONGO_URI=mongodb://127.0.0.1:27099/mwtest SMOKE_BASE_URL=http://localhost:8099 node scripts/portalSmokeTest.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generate } from "otplib";
import Employee from "../models/employeeModels.js";
import Patient from "../models/patientModel.js";
import Attendance from "../models/attendanceModel.js";
import { istDayRange } from "../utils/attendanceDay.js";

const uri = process.env.MONGO_URI || "";
const host = (() => {
  try {
    return new URL(uri).hostname;
  } catch {
    return "";
  }
})();

if (!["127.0.0.1", "localhost", "::1"].includes(host)) {
  console.error(
    `Refusing to run: MONGO_URI host is "${host || "unset"}", not this machine. This test writes data.`,
  );
  process.exit(2);
}

const BASE = process.env.SMOKE_BASE_URL || "http://localhost:8080";

let pass = 0;
let fail = 0;
const check = (label, ok, detail = "") => {
  ok ? pass++ : fail++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  (${detail})` : ""}`);
};

const post = async (path, body, headers = {}) => {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => ({})) };
};
const get = async (path, headers = {}) => {
  const res = await fetch(BASE + path, { headers });
  return { status: res.status, body: await res.json().catch(() => ({})) };
};

const tokenFor = (doc) => jwt.sign({ id: doc._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
const codeNow = (secret) => generate({ secret });
// The next 30s window - the server accepts one step of drift.
const codeNext = (secret) => generate({ secret, epoch: Math.floor(Date.now() / 1000) + 30 });

const makeEmployee = async (employeeId, email, password) =>
  Employee.create({
    personalDetails: {
      employeeId,
      fullName: `Test ${employeeId}`,
      qualification: "BPT",
      registrationNo: `REG-${employeeId}`,
      joiningDate: new Date("2024-01-01"),
      experience: 1,
      contactNumber: "9000000000",
      email,
      password: await bcrypt.hash(password, 10),
      workingBranch: "Main",
      status: "Active",
      employeeType: "Full Time",
    },
  });

await mongoose.connect(uri);
await Promise.all([Employee.deleteMany({}), Patient.deleteMany({}), Attendance.deleteMany({})]);

const PASSWORD = "S3cret-pass!";
const emp = await makeEmployee("T001", "t001@example.com", PASSWORD);
const marked = await makeEmployee("T002", "t002@example.com", PASSWORD);
await Patient.create({
  personalDetails: {
    name: "Pat Tester",
    age: 30,
    gender: "Male",
    address: "Somewhere",
    contactNumber: "9876543210",
    chiefComplaint: "Back pain",
    patientId: "P001",
    enquiryId: new mongoose.Types.ObjectId(),
  },
});

console.log("\nEmployee portal");
let r = await post("/api/attendance/punch", { employeeId: "NOPE", code: "123456" });
check("unknown ID is rejected", r.status === 401, r.body.code);

r = await post("/api/attendance/punch", { employeeId: "t001", code: "123456" });
check("punch before enrolment says NOT_ENROLLED", r.status === 400 && r.body.code === "NOT_ENROLLED");

const enrolToken = tokenFor(emp);

r = await post("/api/attendance/totp/enroll", { reset: true }, { token: enrolToken });
check("enrol returns a QR and a manual key", r.status === 200 && !!r.body.qrDataUrl && !!r.body.manualKey);
const secret = r.body.manualKey;

r = await post("/api/attendance/totp/confirm", { code: "000000" }, { token: enrolToken });
check("confirm with a wrong code is rejected", r.status === 401);
r = await post("/api/attendance/totp/confirm", { code: await codeNow(secret) }, { token: enrolToken });
check("confirm with the right code enables it", r.status === 200);

r = await post("/api/attendance/punch", { employeeId: "T001", code: await codeNow(secret) });
check("first punch checks in", r.status === 201 && r.body.action === "in", r.body.message);
check("check-in returns a login token", !!r.body.token);
check("check-in records an arrival time", !!r.body.data?.inTime);
const dayToken = r.body.token;

const usedCode = await codeNow(secret);
r = await post("/api/attendance/punch", { employeeId: "T001", code: usedCode });
check("the code that just checked in cannot be replayed", r.status === 401, r.body.code);

r = await post("/api/attendance/punch", { employeeId: "T001", code: await codeNext(secret) });
check("next window's code checks out", r.status === 200 && r.body.action === "out", r.body.message);
check("check-out returns no token (client logs out)", !r.body.token);
check("worked minutes are reported", r.body.data?.workedMinutes !== undefined);

// Forget the spent code so a fresh one is accepted, to reach the "already complete" branch.
await Employee.updateOne({ _id: emp._id }, { $set: { "totp.lastCounter": 0 } });
r = await post("/api/attendance/punch", { employeeId: "T001", code: await codeNext(secret) });
check("a third punch the same day is refused as complete", r.status === 409 && r.body.code === "ALREADY_COMPLETE", `${r.status} ${r.body.code}`);

r = await get("/api/attendance/me/month", { token: dayToken });
const todayKey = new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10);
check("my month shows today's record", r.status === 200 && r.body.days?.[todayKey]?.status === "Present");
check("my month reports the shift rules", typeof r.body.shift?.startMinutes === "number");

r = await get("/api/attendance/me/month");
check("my month needs a token", r.status === 401);

console.log("\nAdmin marked the day first");
const { start } = istDayRange();
await Attendance.create({ id: marked._id, date: start, status: "Present", type: "employee" });
const t2 = tokenFor(marked);
r = await post("/api/attendance/totp/enroll", { reset: true }, { token: t2 });
const secret2 = r.body.manualKey;
await post("/api/attendance/totp/confirm", { code: await codeNow(secret2) }, { token: t2 });
r = await post("/api/attendance/punch", { employeeId: "T002", code: await codeNow(secret2) });
check("first punch on a hand-marked day is a check-IN, not a check-out", r.body.action === "in", `${r.body.action}`);
check("...and it records an arrival time", !!r.body.data?.inTime);

console.log("\nBrute-force protection");
let last;
for (let i = 0; i < 10; i++) last = await post("/api/attendance/punch", { employeeId: "T001", code: "111111" });
check("repeated wrong codes get locked out (429)", last.status === 429, `${last.status}`);

console.log("\nPatient portal");
r = await post("/api/attendance/patient/punch", { patientId: "P001", contactNumber: "1111111111" });
check("wrong mobile number is rejected", r.status === 401);
r = await post("/api/attendance/patient/punch", { patientId: "p001", contactNumber: "9876543210" });
check("patient session starts", r.status === 200 && r.body.action === "in", r.body.message);
check("patient summary has their name and stats", r.body.patient?.name === "Pat Tester" && r.body.stats?.attended === 1);
check("patient is never marked late", r.body.data?.late === false);
r = await post("/api/attendance/patient/punch", { patientId: "P001", contactNumber: "98765 43210" });
check("second punch ends the session (spaces in number ignored)", r.body.action === "out", r.body.action);
r = await post("/api/attendance/patient/punch", { patientId: "P001", contactNumber: "9876543210" });
check("third punch reports the day as done", r.status === 200 && r.body.action === "done");

console.log("\nAdmin-only routes stay closed");
r = await get("/api/attendance/day", { token: dayToken });
check("a normal employee cannot read the staff roster", r.status === 403, `${r.status}`);
r = await get("/api/attendance/day");
check("an anonymous caller cannot either", r.status === 401);

console.log("\nOwner sets up an employee's authenticator");
const target = await makeEmployee("T003", "t003@example.com", PASSWORD);
const adminDoc = await makeEmployee("TADM", process.env.ADMIN_EMAIL || "admin@example.com", PASSWORD);

const adminToken = tokenFor(adminDoc);

r = await post("/api/attendance/totp/enroll-for", { employeeId: String(target._id) }, { token: dayToken });
check("a normal employee cannot set up someone else's authenticator", r.status === 403, `${r.status}`);

r = await post("/api/attendance/totp/enroll-for", { employeeId: String(target._id) });
check("an anonymous caller cannot either", r.status === 401);

r = await post("/api/attendance/totp/enroll-for", { employeeId: "not-an-id" }, { token: adminToken });
check("a malformed employee id is rejected", r.status === 400);

r = await post("/api/attendance/totp/enroll-for", { employeeId: String(target._id) }, { token: adminToken });
check("owner gets a QR and key for the employee", r.status === 200 && !!r.body.qrDataUrl && !!r.body.manualKey);
const secret3 = r.body.manualKey;

r = await post("/api/attendance/punch", { employeeId: "T003", code: await codeNow(secret3) });
check("punch is refused until the owner confirms the code", r.status === 400 && r.body.code === "NOT_ENROLLED", `${r.status} ${r.body.code}`);

r = await post("/api/attendance/totp/confirm-for", { employeeId: String(target._id), code: "000000" }, { token: adminToken });
check("confirm with a wrong code is rejected", r.status === 401);
r = await post("/api/attendance/totp/confirm-for", { employeeId: String(target._id), code: await codeNow(secret3) }, { token: adminToken });
check("confirm with the right code enrols them", r.status === 200);

r = await post("/api/attendance/punch", { employeeId: "t003", code: await codeNow(secret3) });
check("the employee can now check in with just their ID and code", r.status === 201 && r.body.action === "in", `${r.status} ${r.body.message}`);

r = await post("/api/attendance/totp/enroll-for", { employeeId: String(target._id) }, { token: adminToken });
check("replacing an active authenticator needs an explicit reset", r.status === 409 && r.body.code === "ALREADY_ENROLLED");
r = await post("/api/attendance/totp/enroll-for", { employeeId: String(target._id), reset: true }, { token: adminToken });
check("reset issues a fresh QR", r.status === 200 && r.body.manualKey !== secret3);

r = await get("/api/attendance/day", { token: adminToken });
const row = (r.body.roster || []).find((x) => x.code === "T003");
check("the roster shows each employee's authenticator state", row && row.authenticator === false, JSON.stringify(row?.authenticator));
const row1 = (r.body.roster || []).find((x) => x.code === "T001");
check("...and who is enrolled", row1 && row1.authenticator === true);

console.log("\nAccess control (who can reach what)");
const staffToken = tokenFor(emp);
const patientToken = jwt.sign({ contactNumber: "9876543210" }, process.env.JWT_SECRET, { expiresIn: "1h" });
const gone = await makeEmployee("TGONE", "tgone@example.com", PASSWORD);
const goneToken = tokenFor(gone);
await Employee.updateOne({ _id: gone._id }, { $set: { "personalDetails.status": "Inactive" } });

const guarded = [
  ["GET", "/api/report/salary"],
  ["GET", "/api/report/bill"],
  ["GET", "/api/report/summary"],
  ["GET", "/api/employee/getAllEmployee"],
  ["GET", "/api/patient/getAllPatient"],
  ["GET", "/api/enquiry/getEnquiry"],
  ["GET", "/api/treatmentPlan/getTreatmentPlan"],
  ["GET", "/api/client/getObesityClient"],
  ["GET", "/api/user/getAllUsers"],
];
const call = (method, path, token) =>
  method === "GET" ? get(path, token ? { token } : {}) : post(path, {}, token ? { token } : {});

for (const [method, path] of guarded) {
  r = await call(method, path);
  check(`anonymous is refused: ${path}`, r.status === 401, `${r.status}`);
}
for (const [method, path] of guarded) {
  r = await call(method, path, patientToken);
  check(`a patient token is refused: ${path}`, r.status === 401, `${r.status}`);
}
r = await get("/api/patient/getAllPatient", { token: goneToken });
check("a deactivated employee's old token stops working", r.status === 403 && r.body.code === "ACCOUNT_INACTIVE", `${r.status} ${r.body.code}`);
r = await get("/api/patient/getAllPatient", { token: staffToken });
check("a staff token can read patients", r.status === 200, `${r.status}`);

for (const path of ["/api/report/salary", "/api/report/bill", "/api/report/summary", "/api/employee/getAllEmployee", "/api/user/getAllUsers"]) {
  r = await get(path, { token: staffToken });
  check(`owner-only, staff refused: ${path}`, r.status === 403, `${r.status}`);
  r = await get(path, { token: adminToken });
  check(`owner-only, owner allowed: ${path}`, r.status === 200, `${r.status}`);
}

r = await post("/api/report/bill", {}, { token: staffToken });
check("staff can reach bill creation (reception needs it)", r.status !== 401 && r.status !== 403, `${r.status}`);
r = await post("/api/employee/createEmployee", {}, { token: staffToken });
check("staff cannot create employees", r.status === 403, `${r.status}`);
r = await post("/api/employee/addEmployee", { name: "x", role: "y" });
check("the old open addEmployee route is closed", r.status === 401, `${r.status}`);
r = await fetch(BASE + `/api/employee/deleteEmployee/${target._id}`, { method: "DELETE", headers: { token: staffToken } });
check("staff cannot delete employees", r.status === 403, `${r.status}`);
r = await fetch(BASE + `/api/employee/updateEmployee/${target._id}`, { method: "PUT", headers: { token: staffToken, "Content-Type": "application/json" }, body: "{}" });
check("staff cannot edit another employee", r.status === 403, `${r.status}`);
r = await post("/api/attendance/createAttendance", { patientId: "x", date: "2026-01-01", status: "Present" });
check("patient attendance entry needs a login", r.status === 401, `${r.status}`);
r = await post("/api/attendance/login", { employeeId: "T001", password: PASSWORD });
check("the old password login route is gone", r.status === 404, `${r.status}`);

console.log(`\n${pass} passed, ${fail} failed`);
await mongoose.disconnect();
process.exit(fail ? 1 : 0);
