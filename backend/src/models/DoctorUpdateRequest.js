import mongoose from "mongoose";

const doctorUpdateRequestSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    specialization: {
        type: String,
        required: true,
        trim: true,
    },
    qualification: {
        type: String,
        required: true,
        trim: true,
    },
    experience: {
        type: Number,
        required: true,
        min: 0,
    },
    consultationFee: {
        type: Number,
        required: true,
        min: 0,
    },
    availableDays: [
        {
            type: String,
            required: true,
        },
    ],
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
},
    {
        timestamps: true,
    }
);

const DoctorUpdateRequest = mongoose.model("DoctorUpdateRequest", doctorUpdateRequestSchema);
export default DoctorUpdateRequest;