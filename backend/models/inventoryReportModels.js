import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Purchase date of this item. Intentionally NOT defaulted to Date.now: a
  // `default: Date.now` on a field missing from older stored docs gets
  // re-applied on every read, so undated legacy items would silently drift into
  // whatever month the report is opened in. Reports fall back to the parent
  // doc's createdAt when this is absent (see reportsController itemDate()).
  date: { type: Date },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
});

const inventorySchema = new mongoose.Schema(
  {
    items: [inventoryItemSchema],
    total: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model("InventoryReport", inventorySchema);
export default Inventory;
