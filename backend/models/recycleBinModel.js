import mongoose from "mongoose";

const recycleBinSchema = new mongoose.Schema({
  label: { type: String, required: true },
  records: [{ collection: { type: String, required: true }, document: { type: mongoose.Schema.Types.Mixed, required: true } }],
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
}, { timestamps: true });

export default mongoose.models.RecycleBin || mongoose.model("RecycleBin", recycleBinSchema);
