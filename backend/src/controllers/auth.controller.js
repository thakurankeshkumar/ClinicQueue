import bcrypt from "bcryptjs";
import User from "../models/User.js";


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