import Doctor from "../models/Doctor.js";
import DoctorUpdateRequest from "../models/DoctorUpdateRequest.js";
import Appointment from "../models/Appointment.js";

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

// Fecth doctor profile function
export const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user._id });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found."
            });
        }

        const pendingRequest = await DoctorUpdateRequest.findOne({ doctorId: doctor._id, status: "pending" });

        return res.status(200).json({
            success: true,
            message: "Doctor profile retrieved successfully.",
            doctor,
            hasPendingRequest: !!pendingRequest
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Request doctor profile update function
export const requestDoctorProfileUpdate = async (req, res) => {
    try {
        const { phoneNumber, specialization, qualification, experience, consultationFee, availableDays, } = req.body;

        // Check required fields
        if (!phoneNumber?.trim() || !specialization?.trim() || !qualification?.trim() || experience === undefined || consultationFee === undefined ||
            !Array.isArray(availableDays) ||
            availableDays.length === 0) {
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

        // Validate experience
        if (!Number.isInteger(experience) || experience < 0) {
            return res.status(400).json({
                success: false,
                message: "Experience must be a valid positive number."
            });
        }

        // Validate consultation fee
        if (!Number.isInteger(consultationFee) || consultationFee <= 0) {
            return res.status(400).json({
                success: false,
                message: "Consultation fee must be greater than zero."
            });
        }

        // Normalize available days
        const normalizedDays = availableDays.map(day => day.trim().charAt(0).toUpperCase() + day.trim().slice(1).toLowerCase());

        // Validate available days
        const validDays = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ];

        const isValidDays = normalizedDays.every(day =>
            validDays.includes(day)
        );

        if (!isValidDays) {
            return res.status(400).json({
                success: false,
                message: "Invalid available days."
            });
        }

        // Check duplicate available days
        const uniqueDays = new Set(normalizedDays);

        if (uniqueDays.size !== normalizedDays.length) {
            return res.status(400).json({
                success: false,
                message: "Duplicate available days are not allowed."
            });
        }

        // Find doctor profile
        const doctor = await Doctor.findOne({
            userId: req.user._id
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found."
            });
        }

        // Check if submitted data is same as current doctor profile
        const isSameAsDoctorProfile = doctor.phoneNumber === phoneNumber && doctor.specialization === specialization && doctor.qualification === qualification &&
            doctor.experience === experience && doctor.consultationFee === consultationFee && JSON.stringify(doctor.availableDays) === JSON.stringify(normalizedDays);

        if (isSameAsDoctorProfile) {
            return res.status(400).json({
                success: false,
                message: "No changes detected."
            });
        }

        // Check for existing pending update request
        let updateRequest = await DoctorUpdateRequest.findOne({
            doctorId: doctor._id,
            status: "pending"
        });

        if (updateRequest) {

            const isSameAsPendingRequest =
                updateRequest.phoneNumber === phoneNumber &&
                updateRequest.specialization === specialization &&
                updateRequest.qualification === qualification &&
                updateRequest.experience === experience &&
                updateRequest.consultationFee === consultationFee &&
                JSON.stringify(updateRequest.availableDays) === JSON.stringify(normalizedDays);

            if (isSameAsPendingRequest) {
                return res.status(400).json({
                    success: false,
                    message: "No changes detected."
                });
            }

            // Update existing pending request
            updateRequest.phoneNumber = phoneNumber;
            updateRequest.specialization = specialization;
            updateRequest.qualification = qualification;
            updateRequest.experience = experience;
            updateRequest.consultationFee = consultationFee;
            updateRequest.availableDays = normalizedDays;

            await updateRequest.save();

            return res.status(200).json({
                success: true,
                message: "Pending profile update request updated successfully."
            });
        }

        // Create new update request
        updateRequest = new DoctorUpdateRequest({
            doctorId: doctor._id,
            requestedBy: req.user._id,
            phoneNumber,
            specialization,
            qualification,
            experience,
            consultationFee,
            availableDays: normalizedDays,
        });

        await updateRequest.save();

        return res.status(201).json({
            success: true,
            message: "Doctor profile update request submitted successfully."
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get Doctor Dashboard function
export const getDoctorDashboard = async (req, res) => {
    try {

        // Find doctor profile
        const doctor = await Doctor.findOne({ userId: req.user._id });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found."
            });
        }

        // Today's date range
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        // Dashboard data
        const [todayAppointments, pendingRequests, completedToday, upcomingAppointments, recentAppointments, allAppointments] = await Promise.all([

            // Today's approved appointments
            Appointment.countDocuments({
                doctorId: doctor._id, status: "approved",
                appointmentDate: { $gte: startOfDay, $lte: endOfDay }
            }),

            // Pending appointment requests
            Appointment.countDocuments({ doctorId: doctor._id, status: "pending" }),

            // Completed appointments today
            Appointment.countDocuments({
                doctorId: doctor._id, status: "completed",
                completedAt: { $gte: startOfDay, $lte: endOfDay }
            }),

            // Upcoming approved appointments
            Appointment.countDocuments({
                doctorId: doctor._id, status: "approved",
                appointmentDate: { $gt: endOfDay }
            }),

            // Recent appointments
            Appointment.find({ doctorId: doctor._id }).populate({ path: "patientId", select: "name gender email" })
                .select("patientId reasonForVisit rejectionReason appointmentDate appointmentTime tokenNumber status updatedAt").sort({ updatedAt: -1 }).limit(5),

            // All appointments (for history page)
            Appointment.find({ doctorId: doctor._id }).populate({
                path: "patientId", select: "name gender email"
            })
                .select("patientId reasonForVisit rejectionReason preferredDate appointmentDate appointmentTime duration tokenNumber status completedAt updatedAt")
                .sort({ updatedAt: -1 })

        ]);

        return res.status(200).json({
            success: true,
            todayAppointments,
            pendingRequests,
            completedToday,
            upcomingAppointments,
            recentAppointments,
            allAppointments
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};