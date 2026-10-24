import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

const connectDb = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set. Add it to backend/.env");
  }

  // The URI carries the database username and password, so only the host is
  // logged - never the full connection string.
  const host = (() => {
    try {
      return new URL(process.env.MONGO_URI).host;
    } catch {
      return "(unparseable MONGO_URI)";
    }
  })();

  console.log(`Connecting to MongoDB at ${host}`);

  // Deliberately not caught here. server.js must not start listening when the
  // database is unreachable - a server answering requests with no database
  // looks healthy and fails on every read.
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
};

export default connectDb;
