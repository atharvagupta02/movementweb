/**
 * Set an employee's login password.
 *
 * Passwords are stored as bcrypt hashes, so an existing one cannot be read
 * back — if it is forgotten, it has to be replaced.
 *
 *   node scripts/setEmployeePassword.js --email someone@example.com --password "new-password"
 *   node scripts/setEmployeePassword.js --id MR-EMP-0012 --password "new-password"
 *
 * Add --list to print the accounts without changing anything.
 *
 * Uses updateOne so that a record with other missing required fields (one
 * employee has no employeeId) can still have its password set.
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Employee from "../models/employeeModels.js";

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : null;
};

const email = arg("email");
const employeeId = arg("id");
const password = arg("password");
const listOnly = process.argv.includes("--list");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  if (listOnly) {
    const all = await Employee.find().lean();
    console.log("\n  EMPLOYEE ID     EMAIL");
    for (const e of all) {
      const d = e.personalDetails || {};
      console.log(
        `  ${(d.employeeId || "(none)").padEnd(15)} ${d.email || "(no email)"}`,
      );
    }
    console.log("");
    return;
  }

  if (!password || (!email && !employeeId)) {
    console.log(
      "\nUsage: node scripts/setEmployeePassword.js --email <email> --password <password>\n" +
        "       node scripts/setEmployeePassword.js --list\n",
    );
    process.exitCode = 1;
    return;
  }

  if (password.length < 8) {
    console.log("\nPassword must be at least 8 characters.\n");
    process.exitCode = 1;
    return;
  }

  const filter = email
    ? { "personalDetails.email": email }
    : { "personalDetails.employeeId": employeeId };

  const employee = await Employee.findOne(filter).lean();
  if (!employee) {
    console.log(`\nNo employee matched ${email || employeeId}.\n`);
    process.exitCode = 1;
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  await Employee.updateOne(
    { _id: employee._id },
    { $set: { "personalDetails.password": hash } },
  );

  console.log(
    `\nPassword set for ${employee.personalDetails?.name || "employee"} ` +
      `<${employee.personalDetails?.email}>.\n`,
  );
};

run()
  .catch((err) => {
    console.error("\nFailed:", err.message, "\n");
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
