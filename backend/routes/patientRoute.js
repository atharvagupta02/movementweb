import express from "express";
import {createPatient , getAllPatient , getPatientById , updatedPatientStatus} from "../controllers/patientController.js";


import employeeAuth from "../middleware/employeeAuth.js";
const patientRouter = express.Router();

patientRouter.post("/createPatient", employeeAuth, createPatient);
patientRouter.get("/getAllPatient", employeeAuth, getAllPatient);
patientRouter.get("/getPatientById/:id", employeeAuth, getPatientById);

patientRouter.put("/updatePatientStatus", employeeAuth, updatedPatientStatus)

export default patientRouter;