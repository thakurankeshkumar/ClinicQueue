import { Router } from 'express';
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { completeDoctorProfile, getDoctorProfile, requestDoctorProfileUpdate, getDoctorDashboard } from "../controllers/doctor.controller.js";

const router = Router();
router.use(authenticateUser);
router.use(authorizeRoles("doctor"));
router.post("/profile", completeDoctorProfile);
router.get("/profile", getDoctorProfile);
router.patch("/profile", requestDoctorProfileUpdate);
router.get("/dashboard", getDoctorDashboard);


export default router;