import express from "express";

import auth from "../middleware/auth.js";
import {createEnquiry , getEnquiry, getPersonalDetails, deleteEnquiryById, getPatientAttendanceEnquiry} from "../controllers/enquiryController.js";
import employeeAuth from "../middleware/employeeAuth.js";

const enquiryRouter = express.Router();

enquiryRouter.post("/createEnquiry", employeeAuth, createEnquiry);
enquiryRouter.get("/getEnquiry", employeeAuth, getEnquiry);
enquiryRouter.get("/getPatientAttendanceEnquiry", employeeAuth, getPatientAttendanceEnquiry);
enquiryRouter.get("/getPersonalDetails" , auth , getPersonalDetails );
enquiryRouter.delete("/deleteEnquiryById/:id" , employeeAuth, deleteEnquiryById );

export default enquiryRouter;
