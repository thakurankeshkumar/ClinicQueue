import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    preferredDate: {
        type: Date,
        required: true,
    },
    appointmentDate: {
        type: Date,
    },
    appointmentTime: {
        type: String,
        trim: true,
    },
    duration: {
        type: Number,
        min: 1,
    },
    tokenNumber: {
        type: Number,
        min: 1,
    },
    reasonForVisit: {
        type: String,
        required: true,
        trim: true,
    },
    rejectionReason: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "completed", "cancelled"],
        default: "pending",
    },
    completedAt: {
        type: Date,
    },
    approvedAt: {
        type: Date,
    },
    rejectedAt: {
        type: Date,
    },
}, {
    timestamps: true,
}
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;