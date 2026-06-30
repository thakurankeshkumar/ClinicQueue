import { Router } from 'express';
import { registerPatient, registerDoctor, loginUser, getProfile } from "../controllers/auth.controller.js"
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = Router();

router.post("/register/patient", registerPatient);
router.post("/register/doctor", registerDoctor);
router.post("/login", loginUser);
router.get("/profile", authenticateUser, getProfile);


export default router;