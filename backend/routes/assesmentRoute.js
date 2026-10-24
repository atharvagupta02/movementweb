import express from "express";

import {
  createNeurologicalForm,
  createMusculoskeletalForm,
  createPilatesForm,
  createObesityForm,
    getNeurologicalForm,
    getMusculoskeletalForm,
    getObesityForm,
    getPilatesForm,
    updateNeurologicalForm,
    updateMusculoskeletalForm,
    updateObesityForm,
    updatePilatesForm,
} from "../controllers/assessmentController.js";
import employeeAuth from "../middleware/employeeAuth.js";

const assessmentRouter = express.Router();

// assessmentRouter.post("/neurological", auth, createNeurologicalForm);
assessmentRouter.post("/neurological", employeeAuth, createNeurologicalForm);
assessmentRouter.post("/musculoskeletal",employeeAuth, createMusculoskeletalForm);
assessmentRouter.post("/obesity",employeeAuth , createObesityForm);
assessmentRouter.post("/pilates",employeeAuth ,  createPilatesForm);

// get router
assessmentRouter.get("/getneurological/:id", employeeAuth, getNeurologicalForm);
assessmentRouter.get("/getmusculoskeletal/:id", employeeAuth, getMusculoskeletalForm);
assessmentRouter.get("/getobesity/:id", employeeAuth, getObesityForm);
assessmentRouter.get("/getpilates/:id", employeeAuth, getPilatesForm);

// update router
assessmentRouter.put("/updateNeurological/:id", employeeAuth, updateNeurologicalForm);
assessmentRouter.put("/updateMusculoskeletal/:id", employeeAuth, updateMusculoskeletalForm);
assessmentRouter.put("/updateObesity/:id", employeeAuth, updateObesityForm);
assessmentRouter.put("/updatePilates/:id", employeeAuth, updatePilatesForm);

export default assessmentRouter;
