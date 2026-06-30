import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";

// Doctor registration function
export const registerDoctor = async (req, res) => {
    try {
        const { name, email, password, gender } = req.body;

        // Checking required fields
        if (!name?.trim() || !email?.trim() || !password?.trim() || !gender?.trim()) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // checking for valid email address
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        // checking duplicate emails 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });
        }

        // Creating hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating new user
        const doctor = new User({
            name,
            email,
            password: hashedPassword,
            gender,
            role: "doctor",
            accountStatus: "pending"
        });

        // saving patient
        await doctor.save();

        // returning the success response
        res.status(201).json({
            success: true,
            message: "Doctor registered successfully. Wait for Approval.",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// Patient registration function
export const registerPatient = async (req, res) => {
    try {
        const { name, email, password, gender } = req.body;

        // Checking required fields
        if (!name?.trim() || !email?.trim() || !password?.trim() || !gender?.trim()) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // checking for valid email address
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        // checking duplicate emails 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });
        }

        // Creating hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating new user
        const patient = new User({
            name,
            email,
            password: hashedPassword,
            gender,
            role: "patient",
            accountStatus: "approved"
        });

        // saving patient
        await patient.save();

        // returning the success response
        res.status(201).json({
            success: true,
            message: "Patient registered successfully.",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// User login function
export const loginUser = async (req, res) => {

    // Try Catch Section for error handling
    try {

        // extracting email and password from the request body and checking for empty fields
        const { email, password } = req.body;
        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // checking for valid email address
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        // Checking if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Checking if the password is correct
        const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }


        // Checking doctor approval
        if (user.role === "doctor" && user.accountStatus !== "approved") {
            return res.status(403).json({
                success: false,
                message: "Your account is not approved yet. Please wait for approval."
            });
        }

        // Generate JWT token 
        const token = jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

        // set Cookie
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            maxAge: Number(env.COOKIE_MAX_AGE)
        });


        return res.status(200).json({
            success: true,
            message: "Login Successful.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (err) {
        // Error Handling Section 
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


// User profile function
export const getProfile = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    });
};