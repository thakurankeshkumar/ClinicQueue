import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// admin Dashboard route
router.get("/dashboard", authenticateUser, authorizeRoles("admin"), (req, res) => {
    return res.json({
        success: true,
        message: "Welcome Admin"
    });
});



export default router