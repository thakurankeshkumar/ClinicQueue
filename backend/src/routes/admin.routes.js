import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { getPendingDoctors, approveDoctor, rejectDoctor, getPendingProfileUpdateRequests, approveDoctorProfileUpdate, rejectDoctorProfileUpdate } from "../controllers/admin.controller.js"

const router = Router();

router.use(authenticateUser);
router.use(authorizeRoles("admin"));


// admin Dashboard route
router.get("/dashboard", (req, res) => {
    return res.json({
        success: true,
        message: "Welcome Admin"
    });
});

router.get("/doctors/pending", getPendingDoctors);
router.patch("/doctors/:id/approve", approveDoctor);
router.patch("/doctors/:id/reject", rejectDoctor);
router.get("/profile-update-requests", getPendingProfileUpdateRequests);
router.patch("/profile-update-requests/:id/approve", approveDoctorProfileUpdate);
router.patch("/profile-update-requests/:id/reject", rejectDoctorProfileUpdate);

export default router