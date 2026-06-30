import User from "../models/User.js"

// Fetching all the pending doctors
export const getPendingDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: "doctor", accountStatus: "pending" }).select("-password");
        return res.status(200).json({
            success: true,
            message: "Doctors GET successfully",
            count: doctors.length,
            doctors
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

// Approveing the pending doctor
export const approveDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await User.findById(id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        if (doctor.role !== "doctor") {
            return res.status(400).json({
                success: false,
                message: "Selected user is not a doctor."
            });
        }

        doctor.accountStatus = "approved";
        await doctor.save();

        return res.status(200).json({
            success: true,
            message: "Doctor approved successfully."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}

// Rejecting the pending doctor
export const rejectDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await User.findById(id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        if (doctor.role !== "doctor") {
            return res.status(400).json({
                success: false,
                message: "Selected user is not a doctor."
            });
        }

        doctor.accountStatus = "rejected";
        await doctor.save();

        return res.status(200).json({
            success: true,
            message: "Doctor rejected successfully."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}