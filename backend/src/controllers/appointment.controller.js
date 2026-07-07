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
            doctorId: doctor._id, status: {
                $in: ["pending", "approved"]
            }
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
        const [year, month, day] = appointmentDate.split("-").map(Number);
        const selectedDate = new Date(year, month - 1, day);

        if (isNaN(selectedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment date."
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return res.status(400).json({
                success: false,
                message: "Please select a valid appointment date."
            });
        }

        // Validate appointment time
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!timeRegex.test(appointmentTime)) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment time."
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

        // Find appointment
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found."
            });
        }

        // Verify ownership
        if (appointment.doctorId.toString() !== doctor._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to approve this appointment."
            });
        }

        // Only pending appointments can be approved
        if (appointment.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending appointments can be approved."
            });
        }

        // Appointment date cannot be earlier than preferred date
        const preferredDate = new Date(appointment.preferredDate);
        preferredDate.setHours(0, 0, 0, 0);

        if (selectedDate < preferredDate) {
            return res.status(400).json({
                success: false,
                message: "Appointment date cannot be earlier than the patient's preferred date."
            });
        }

        // Check duplicate appointment
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const existingAppointment = await Appointment.findOne({
            doctorId: doctor._id,
            appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
            appointmentTime,
            status: {
                $in: ["approved", "completed"],
            },
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: "An appointment already exists at this time."
            });
        }

        // Generate queue token
        const tokenNumber = Number(appointmentTime.replace(":", ""));

        // Approve appointment
        appointment.appointmentDate = selectedDate;
        appointment.appointmentTime = appointmentTime;
        appointment.duration = duration;
        appointment.tokenNumber = tokenNumber;
        appointment.status = "approved";
        appointment.approvedAt = new Date();

        await appointment.save();

        // Populate patient details before returning
        await appointment.populate({
            path: "patientId",
            select: "name gender email"
        });

        return res.status(200).json({
            success: true,
            message: "Appointment approved successfully.",
            appointment
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Reject Patient Appointment function
export const rejectAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;

        // Check required fields
        if (!rejectionReason?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required."
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

        // Verify appointment belongs to logged-in doctor
        if (appointment.doctorId.toString() !== doctor._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to reject this appointment."
            });
        }

        // Only pending appointments can be rejected
        if (appointment.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending appointments can be rejected."
            });
        }

        // Reject appointment
        appointment.status = "rejected";
        appointment.rejectionReason = rejectionReason.trim();
        appointment.rejectedAt = new Date();

        await appointment.save();

        return res.status(200).json({
            success: true,
            message: "Appointment rejected successfully."
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Complete Patient Appointment function
export const completeAppointment = async (req, res) => {
    try {

        // Find doctor profile
        const doctor = await Doctor.findOne({ userId: req.user._id });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found."
            });
        }

        // Find appointment
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found."
            });
        }

        // Verify ownership
        if (appointment.doctorId.toString() !== doctor._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to complete this appointment."
            });
        }

        // Only approved appointments can be completed
        if (appointment.status !== "approved") {
            return res.status(400).json({
                success: false,
                message: "Only approved appointments can be completed."
            });
        }

        // Appointment date must be today or earlier
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const appointmentDate = new Date(appointment.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);

        if (appointmentDate > today) {
            return res.status(400).json({
                success: false,
                message: "Future appointments cannot be completed."
            });
        }

        // Complete appointment
        appointment.status = "completed";
        appointment.completedAt = new Date();

        await appointment.save();

        return res.status(200).json({
            success: true,
            message: "Appointment completed successfully."
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};