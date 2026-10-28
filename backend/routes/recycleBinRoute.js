import express from "express";
import employeeAuth from "../middleware/employeeAuth.js";
import adminOnly from "../middleware/adminOnly.js";
import { listRecycleBin, restoreRecycleItem, permanentlyDeleteRecycleItem } from "../controllers/recycleBinController.js";

const router = express.Router();
router.use(employeeAuth, adminOnly);
router.get("/", listRecycleBin);
router.post("/:id/restore", restoreRecycleItem);
router.delete("/:id", permanentlyDeleteRecycleItem);
export default router;
