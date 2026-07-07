import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        match: [/^[6-9]\d{9}$/, "Please enter a valid phone number."],
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
    isAvailable: {
        type: Boolean,
        default: true,
    },
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
    isProfileVerified: {
        type: Boolean,
        default: false,
    }
},
    {
        timestamps: true,
    }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;