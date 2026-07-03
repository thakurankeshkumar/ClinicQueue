import { Router } from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { getPatientDashboard, getMyAppointments, getAvailableDoctors } from '../controllers/patient.controller.js';

const router = Router();


router.get("/my-appointments", authenticateUser, authorizeRoles("patient"), getMyAppointments);
router.get("/dashboard", authenticateUser, authorizeRoles("patient"), getPatientDashboard);
router.get("/doctors", authenticateUser, authorizeRoles("patient"), getAvailableDoctors);


export default router;