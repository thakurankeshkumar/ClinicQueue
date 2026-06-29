import { Router } from 'express';
import { registerPatient } from "../controllers/auth.controller.js"

const router = Router();

router.post("/register/patient", registerPatient);


export default router;