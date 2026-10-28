import mongoose from "mongoose";
import RecycleBin from "../models/recycleBinModel.js";

const getModel = (collection) => mongoose.modelNames().map((name) => mongoose.model(name))
  .find((model) => model.collection.name === collection);

export const listRecycleBin = async (_req, res) => {
  try {
    const items = await RecycleBin.find().sort({ deletedAt: -1, createdAt: -1 }).lean();
    res.json({ success: true, items: items.map(({ records, ...item }) => ({ ...item, recordCount: records.length })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const restoreRecycleItem = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const item = await RecycleBin.findById(req.params.id).session(session);
    if (!item) { await session.abortTransaction(); return res.status(404).json({ success: false, message: "Recycle bin item not found" }); }
    for (const record of item.records) {
      const model = getModel(record.collection);
      if (!model) throw new Error(`Unknown collection: ${record.collection}`);
      await model.collection.insertOne(record.document, { session });
    }
    await item.deleteOne({ session });
    await session.commitTransaction();
    res.json({ success: true, message: "Item restored" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally { session.endSession(); }
};

export const permanentlyDeleteRecycleItem = async (req, res) => {
  try {
    const item = await RecycleBin.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Recycle bin item not found" });
    res.json({ success: true, message: "Item permanently deleted" });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
