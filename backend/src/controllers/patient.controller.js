import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import mongoose from "mongoose"; // Importing mongoose for Doctor ObjectId validation

// Get Patient Dashboard function
export const getPatientDashboard = async (req, res) => {
    try {
        // Today's date range
        const today = new Date();

        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        // Dashboard data
        const [upcomingAppointments, pendingAppointments, completedAppointments, rejectedAppointments, recentAppointments] = await Promise.all([

            // Upcoming approved appointments
            Appointment.countDocuments({
                patientId: req.user._id,
                status: "approved",
                appointmentDate: { $gt: endOfDay }
            }),

            // Pending appointments
            Appointment.countDocuments({
                patientId: req.user._id,
                status: "pending"
            }),

            // Completed appointments
            Appointment.countDocuments({
                patientId: req.user._id,
                status: "completed"
            }),

            // Rejected appointments
            Appointment.countDocuments({
                patientId: req.user._id,
                status: "rejected"
            }),

            // Recent appointments
            Appointment.find({ patientId: req.user._id }).populate({
                path: "doctorId",
                populate: { path: "userId", select: "name" }
            }).select("doctorId reasonForVisit appointmentDate appointmentTime tokenNumber status rejectionReason updatedAt").sort({ updatedAt: -1 }).limit(5)
        ]);

        return res.status(200).json({
            success: true, upcomingAppointments,
            pendingAppointments, completedAppointments,
            rejectedAppointments, recentAppointments
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Fetching Appointments for patient function
export const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            patientId: req.user._id
        }).select("-__v").populate({
            path: "doctorId", select: "specialization isProfileVerified", populate: { path: "userId", select: "name" }
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: appointments.length,
            appointments
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get Available Doctors function
export const getAvailableDoctors = async (req, res) => {
    try {

        // Find all available doctors
        const doctors = await Doctor.find({
            isAvailable: true,
            isProfileComplete: true
        })
            .populate({
                path: "userId",
                select: "name gender"
            })
            .select(
                "userId specialization qualification experience consultationFee availableDays"
            );

        return res.status(200).json({
            success: true,
            doctors
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get Doctor Details function
export const getDoctorDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate doctor ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid doctor ID."
            });
        }

        // Find doctor
        const doctor = await Doctor.findOne({ _id: id, isAvailable: true, isProfileComplete: true }).populate({
            path: "userId", select: "name gender"
        }).select("userId specialization qualification experience consultationFee availableDays");

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        return res.status(200).json({
            success: true,
            doctor
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};