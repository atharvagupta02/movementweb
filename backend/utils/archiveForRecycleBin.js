import RecycleBin from "../models/recycleBinModel.js";

export const archiveForRecycleBin = async ({ label, records, deletedBy, session }) => {
  const snapshots = records.filter(({ document }) => document).map(({ model, document }) => ({
    collection: model.collection.name,
    document: document.toObject ? document.toObject({ depopulate: true, virtuals: false }) : document,
  }));
  if (!snapshots.length) return null;
  const [item] = await RecycleBin.create([{ label, records: snapshots, deletedBy }], { session });
  return item;
};
