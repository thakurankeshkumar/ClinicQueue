import { Router } from 'express';
import { registerPatient, registerDoctor, loginUser, logoutUser, getProfile } from "../controllers/auth.controller.js"
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = Router();

router.post("/register/patient", registerPatient);
router.post("/register/doctor", registerDoctor);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", authenticateUser, getProfile);

export default router;