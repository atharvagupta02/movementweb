import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Present", "Absent", "Leave"],
      default: "Present",
    },
    type:{
      type: String,
      required: true,
      enum: ["employee", "patient"],
      default: "patient",
    },
    // Employee self check-in via TOTP fills these; admin-marked and patient
    // attendance leaves them unset, so older records stay valid.
    inTime: {
      type: Date,
    },
    outTime: {
      type: Date,
    },
    late: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
