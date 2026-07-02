import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";

// Create Appointment function
export const createAppointment = async (req, res) => {
    try {
        const { doctorId, preferredDate, reasonForVisit } = req.body;

        // Check required fields
        if (!doctorId?.trim() || !preferredDate || !reasonForVisit?.trim()) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Validate preferred date
        const selectedDate = new Date(preferredDate);
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return res.status(400).json({
                success: false,
                message: "Please select a valid appointment date."
            });
        }

        // Find doctor
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        // Doctor profile completed?
        if (!doctor.isProfileComplete) {
            return res.status(400).json({
                success: false,
                message: "Doctor profile is incomplete."
            });
        }

        // Doctor available?
        if (!doctor.isAvailable) {
            return res.status(400).json({
                success: false,
                message: "Doctor is currently unavailable."
            });
        }

        // Prevent duplicate pending request
        const pendingAppointment = await Appointment.findOne({
            patientId: req.user._id,
            doctorId,
            status: "pending",
        });

        if (pendingAppointment) {
            return res.status(400).json({
                success: false,
                message: "You already have a pending appointment request with this doctor."
            });
        }

        // Prevent duplicate approved appointment on same date
        const approvedAppointment = await Appointment.findOne({
            patientId: req.user._id,
            doctorId,
            appointmentDate: selectedDate,
            status: "approved",
        });

        if (approvedAppointment) {
            return res.status(400).json({
                success: false,
                message: "You already have an approved appointment with this doctor on this date."
            });
        }

        // Reason to visit Validation
        if (reasonForVisit.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: "Reason for visit must be at least 10 characters long."
            });
        }

        // Create Appointment 
        const appointment = new Appointment({
            patientId: req.user._id,
            doctorId,
            preferredDate: selectedDate,
            reasonForVisit,
        });

        await appointment.save();
        return res.status(201).json({
            success: true,
            message: "Appointment request submitted successfully."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

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

// Fetching Appointments for doctor function
export const getDoctorAppointments = async (req, res) => {
    try {

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

        // Get pending appointment requests
        const appointments = await Appointment.find({
            doctorId: doctor._id, status: "pending"
        }).select("-__v").populate({
            path: "patientId", select: "name gender email"
        }).sort({ createdAt: 1 });

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

// Approve Patient Appointment function
export const approveAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { appointmentDate, appointmentTime, duration } = req.body;

        // Check required fields
        if (!appointmentDate || !appointmentTime?.trim() || duration === undefined) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Validate duration
        if (!Number.isInteger(duration) || duration <= 0) {
            return res.status(400).json({
                success: false,
                message: "Duration must be greater than zero."
            });
        }

        // Validate appointment date
        const selectedDate = new Date(appointmentDate);
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            return res.status(400).json({
                success: false,
                message: "Please select a valid appointment date."
            });
        }

        // Validate time format (24-hour HH:mm)
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!timeRegex.test(appointmentTime)) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment time."
            });
        }

        // Find doctor profile
        const doctor = await Doctor.findOne({ userId: req.user._id });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found."
            });
        }

        // Find appointment
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found."
            });
        }

        if (selectedDate < appointment.preferredDate) {
            return res.status(400).json({
                success: false,
                message: "Appointment date cannot be earlier than the patient's preferred date."
            });
        }

        // Verify ownership
        if (appointment.doctorId.toString() !== doctor._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to approve this appointment."
            });
        }

        // Check status
        if (appointment.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending appointments can be approved."
            });
        }

        // Update appointment
        appointment.appointmentDate = selectedDate;
        appointment.appointmentTime = appointmentTime;
        appointment.duration = duration;
        appointment.status = "approved";
        await appointment.save();
        return res.status(200).json({
            success: true,
            message: "Appointment approved successfully."
        });


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}