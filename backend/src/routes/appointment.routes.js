import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { createAppointment, getMyAppointments, getDoctorAppointments, approveAppointment, rejectAppointment, completeAppointment } from "../controllers/appointment.controller.js";

const router = Router();

router.post("/", authenticateUser, authorizeRoles("patient"), createAppointment);
router.get("/my", authenticateUser, authorizeRoles("patient"), getMyAppointments);
router.get("/", authenticateUser, authorizeRoles("doctor"), getDoctorAppointments);
router.patch("/:id/approve", authenticateUser, authorizeRoles("doctor"), approveAppointment);
router.patch("/:id/reject", authenticateUser, authorizeRoles("doctor"), rejectAppointment);
router.patch("/:id/complete", authenticateUser, authorizeRoles("doctor"), completeAppointment);

export default router;