import express from 'express';
import { createTreatmentPlan, getTreatmentPlans } from '../controllers/TreatmentPlanController.js';

import employeeAuth from "../middleware/employeeAuth.js";
const router = express.Router();

router.post('/createTreatmentPlane', employeeAuth, createTreatmentPlan);
router.get('/getTreatmentPlan', employeeAuth, getTreatmentPlans);

export default router;
