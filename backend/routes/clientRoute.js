import express from "express";
import {getNeurologicalClient , getMusculoskeletalClient , getObesityClient , getPilatesClient} from "../controllers/clientController.js";
import employeeAuth from "../middleware/employeeAuth.js";
const clientRouter = express.Router();

clientRouter.get("/getNeurologicalClient", employeeAuth, getNeurologicalClient);
clientRouter.get("/getMusculoskeletalClient", employeeAuth, getMusculoskeletalClient );
clientRouter.get("/getObesityClient", employeeAuth, getObesityClient );
clientRouter.get("/getPilatesClient", employeeAuth, getPilatesClient );

export default clientRouter;