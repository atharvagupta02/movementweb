/**
 * One-off migration: replace any plaintext employee password with a bcrypt hash.
 * Safe to re-run - rows that already hold a bcrypt hash are skipped.
 *
 *   node scripts/hashEmployeePasswords.js          # report only
 *   node scripts/hashEmployeePasswords.js --write  # apply
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Employee from "../models/employeeModels.js";

const WRITE = process.argv.includes("--write");
const BCRYPT_RE = /^\$2[aby]\$/;

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connected. Mode: ${WRITE ? "WRITE" : "DRY RUN"}\n`);

  const employees = await Employee.find().select("+personalDetails.password");

  let hashed = 0;
  let already = 0;
  let missing = 0;

  let failed = 0;

  for (const employee of employees) {
    try {
    const { employeeId, password } = employee.personalDetails;

    if (!password) {
      console.log(`  ${employeeId}: no password set - skipped`);
      missing += 1;
      continue;
    }
    if (BCRYPT_RE.test(password)) {
      already += 1;
      continue;
    }

    if (WRITE) {
      // updateOne, not save(): save() revalidates the whole document, so a
      // pre-existing invalid row (e.g. missing employeeId) would abort the
      // migration for everybody else.
      await Employee.updateOne(
        { _id: employee._id },
        { $set: { "personalDetails.password": await bcrypt.hash(password, 10) } },
      );
    }
    console.log(
      `  ${employeeId || "(no employeeId)"}: plaintext -> bcrypt${WRITE ? "" : " (dry run)"}`,
    );
    hashed += 1;
    } catch (err) {
      failed += 1;
      console.log(`  ${employee._id}: FAILED - ${err.message}`);
    }
  }

  if (failed) console.log(`\n${failed} row(s) could not be migrated.`);

  console.log(
    `\n${hashed} to hash, ${already} already hashed, ${missing} without a password.`,
  );
  if (!WRITE && hashed > 0) {
    console.log("Re-run with --write to apply.");
  }

  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
