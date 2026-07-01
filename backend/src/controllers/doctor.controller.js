import Doctor from "../models/Doctor.js";

// Complete doctor profile function
export const completeDoctorProfile = async (req, res) => {
    try {
        const { phoneNumber, specialization, qualification, experience, consultationFee, availableDays } = req.body;

        // check required fields
        if (!phoneNumber?.trim() || !specialization?.trim() || !qualification?.trim() || experience === undefined || consultationFee === undefined || !Array.isArray(availableDays) || availableDays.length === 0) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Validate phone number
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid phone number."
            });
        }

        // Validate available days
        const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",];
        const isValidDays = availableDays.every((day) => validDays.includes(day));
        if (!isValidDays) {
            return res.status(400).json({
                success: false,
                message: "Invalid available days."
            });
        }

        // Check duplicate available days
        const uniqueDays = new Set(availableDays);
        if (uniqueDays.size !== availableDays.length) {
            return res.status(400).json({
                success: false,
                message: "Duplicate available days are not allowed."
            });
        }

        // Check if experience is a valid positive number
        if (!Number.isInteger(experience) || experience < 0) {
            return res.status(400).json({
                success: false,
                message: "Experience must be a valid positive number."
            });
        }

        // Check if consultation fee is a valid positive number
        if (!Number.isInteger(consultationFee) || consultationFee <= 0) {
            return res.status(400).json({
                success: false,
                message: "Consultation fee must be greater than zero."
            });
        }

        // Check if profile already exists
        const existingProfile = await Doctor.findOne({ userId: req.user._id, });
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: "Doctor profile already exists."
            });
        }

        // Create doctor profile
        const doctor = new Doctor({
            userId: req.user._id,
            email: req.user.email,
            phoneNumber,
            specialization,
            qualification,
            experience,
            consultationFee,
            availableDays,
            isAvailable: true,
            isProfileComplete: true,
            isProfileVerified: false,
        });
        await doctor.save();

        return res.status(201).json({
            success: true,
            message: "Doctor profile created successfully. Your profile is awaiting admin verification."
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

