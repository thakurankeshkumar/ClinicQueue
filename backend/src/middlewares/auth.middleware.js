import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";

// User Authentication Middleware function 
export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login."
            });
        }

        const decoded = jwt.verify(token, env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found."
            })
        }
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};