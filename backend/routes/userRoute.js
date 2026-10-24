import express from "express";
import { createUser, loginUser , getAllUsers,getUser , deleteUser } from "../controllers/userController.js";
import employeeAuth from "../middleware/employeeAuth.js";
import adminOnly from "../middleware/adminOnly.js";
const router = express.Router();

router.post("/createUser", createUser);
router.post("/loginUser", loginUser);
router.get("/getAllUsers", employeeAuth, adminOnly, getAllUsers);
router.get("/getUser/:userId", employeeAuth, adminOnly, getUser);
router.delete("/deleteUser/:userId", employeeAuth, adminOnly, deleteUser);

export default router;