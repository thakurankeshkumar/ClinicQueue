import User from "../models/User.js"
import DoctorUpdateRequest from "../models/DoctorUpdateRequest.js"
import Doctor from "../models/Doctor.js"

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

// Fetching all the pending doctor profile update requests
export const getPendingProfileUpdateRequests = async (req, res) => {
    try {
        const requests = await DoctorUpdateRequest.find({ status: "pending" }).populate({
            path: "doctorId", populate: { path: "userId", select: "name email" }
        });
        return res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Approving a doctor profile update request
export const approveDoctorProfileUpdate = async (req, res) => {
    try {
        const { id } = req.params;

        // Find update request
        const updateRequest = await DoctorUpdateRequest.findById(id);
        if (!updateRequest) {
            return res.status(404).json({
                success: false,
                message: "Profile update request not found."
            });
        }

        // Find doctor profile
        const doctor = await Doctor.findById(updateRequest.doctorId);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found."
            });
        }

        // Update doctor profile
        doctor.phoneNumber = updateRequest.phoneNumber;
        doctor.specialization = updateRequest.specialization;
        doctor.qualification = updateRequest.qualification;
        doctor.experience = updateRequest.experience;
        doctor.consultationFee = updateRequest.consultationFee;
        doctor.availableDays = updateRequest.availableDays;

        // Mark profile verified
        doctor.isProfileVerified = true;
        await doctor.save();

        // Delete processed request
        await updateRequest.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Doctor profile updated successfully."
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Rejecting a doctor profile update request
export const rejectDoctorProfileUpdate = async (req, res) => {
    try {
        const { id } = req.params;

        const updateRequest = await DoctorUpdateRequest.findById(id);

        if (!updateRequest) {
            return res.status(404).json({
                success: false,
                message: "Profile update request not found."
            });
        }

        await updateRequest.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Profile update request rejected successfully."
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};