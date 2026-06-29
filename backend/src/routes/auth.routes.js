import { Router } from 'express';
import { registerPatient, registerDoctor } from "../controllers/auth.controller.js"

const router = Router();

router.post("/register/patient", registerPatient);
router.post("/register/doctor", registerDoctor);


export default router;