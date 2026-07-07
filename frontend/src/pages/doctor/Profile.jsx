import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getDoctorProfile, completeDoctorProfile, updateDoctorProfile, } from "../../api/doctor";
import useAuth from "../../context/auth/useAuth";

function Profile() {
    const { user } = useAuth();
    const menuItems = [
        { label: "Dashboard", path: "/doctor/dashboard" },
        { label: "My Profile", path: "/doctor/profile" },
        { label: "Appointment Requests", path: "/doctor/appointments" },
        { label: "Appointment History", path: "/doctor/history" },
        { label: "Logout", action: "logout" },
    ];

    const days = [
        "Monday", "Tuesday",
        "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday"
    ];

    const [formData, setFormData] = useState({
        phoneNumber: "", specialization: "",
        qualification: "", experience: "",
        consultationFee: "", availableDays: [],
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [hasPendingRequest, setHasPendingRequest] = useState(false);
    const [isProfileComplete, setIsProfileComplete] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getDoctorProfile();
                const doctor = response.data.doctor;
                setHasPendingRequest(response.data.hasPendingRequest);
                setIsProfileComplete(response.data.doctor.isProfileComplete);
                setFormData({
                    phoneNumber: doctor.phoneNumber || "",
                    specialization: doctor.specialization || "",
                    qualification: doctor.qualification || "",
                    experience: doctor.experience || "",
                    consultationFee: doctor.consultationFee || "",
                    availableDays: doctor.availableDays || [],
                });
            } catch (err) {
                if (err.response?.status === 404) {
                    setIsProfileComplete(false);
                } else {
                    setError(err.response?.data?.message || "Failed to load profile.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value, });

    };

    const handleDayToggle = (day) => {
        if (isProfileComplete && hasPendingRequest) return;
        if (formData.availableDays.includes(day)) {
            setFormData({ ...formData, availableDays: formData.availableDays.filter(d => d !== day), });
        } else {
            setFormData({ ...formData, availableDays: [...formData.availableDays, day,], });
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (saving || (isProfileComplete && hasPendingRequest)) return;

        setSaving(true);
        setError("");
        setSuccess("");

        try {

            const profileData = {
                phoneNumber: formData.phoneNumber,
                specialization: formData.specialization,
                qualification: formData.qualification,
                experience: Number(formData.experience),
                consultationFee: Number(formData.consultationFee),
                availableDays: formData.availableDays,
            };

            if (isProfileComplete) {
                await updateDoctorProfile(profileData);
                setSuccess("Profile update request submitted successfully.");
                setHasPendingRequest(true);
            } else {
                await completeDoctorProfile(profileData);
                setSuccess("Profile completed successfully. It is now awaiting admin verification.");
                setIsProfileComplete(true);
            }
            window.scrollTo({ top: 0, behavior: "smooth", });
        } catch (err) {
            if (err.response?.status === 404) {
                setIsProfileComplete(false);
            } else {
                setError(err.response?.data?.message || "Failed to save profile.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout title={user?.name || "Doctor"} role="Doctor" menuItems={menuItems}>
                <h2 className="text-2xl font-semibold">Loading Profile...</h2>
            </DashboardLayout>
        );

    }

    if (error && !formData.phoneNumber && !formData.specialization) {
        return (
            <DashboardLayout title={user?.name || "Doctor"} role="Doctor" menuItems={menuItems}>
                <div className="rounded-lg bg-red-100 p-4 text-red-700">{error}</div>
            </DashboardLayout>
        );

    }
    return (
        <DashboardLayout title={user?.name || "Doctor"} role="Doctor" menuItems={menuItems}>

            <h1 className="text-3xl font-bold">My Professional Profile</h1>
            <p className="mt-2 text-slate-600">Manage your professional information.</p>

            {error && (
                <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">{error}</div>
            )}

            {success && (
                <div className="mt-6 rounded-lg bg-green-100 p-4 text-green-700">{success}</div>
            )}

            {isProfileComplete && hasPendingRequest && (
                <div className="mt-6 rounded-lg border border-yellow-300 bg-yellow-100 p-4 text-yellow-800">
                    Your profile update request is awaiting admin approval.
                    You cannot make further changes until it is reviewed.
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 rounded-xl bg-white p-8 shadow">

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block font-medium">Phone Number</label>
                        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} disabled={isProfileComplete && hasPendingRequest}
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600 disabled:bg-slate-100" />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">Specialization</label>

                        <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} disabled={isProfileComplete && hasPendingRequest}
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600 disabled:bg-slate-100" />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">Qualification</label>

                        <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} disabled={isProfileComplete && hasPendingRequest}
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600 disabled:bg-slate-100" />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">Experience (Years)</label>
                        <input type="number" name="experience" value={formData.experience} onChange={handleChange} disabled={isProfileComplete && hasPendingRequest}
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600 disabled:bg-slate-100" />
                    </div>
                    <div>
                        <label className="mb-2 block font-medium">Consultation Fee (₹)</label>
                        <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} disabled={isProfileComplete && hasPendingRequest}
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600 disabled:bg-slate-100" />
                    </div>
                </div>

                <div className="mt-8">
                    <label className="mb-4 block font-medium">Available Days</label>

                    <div className="flex flex-wrap gap-3">
                        {days.map((day) => {
                            const selected = formData.availableDays.includes(day);
                            return (
                                <button key={day} type="button" disabled={isProfileComplete && hasPendingRequest} onClick={() => handleDayToggle(day)} className={`rounded-xl border px-5 py-2 transition ${selected
                                    ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white text-slate-700"} ${hasPendingRequest
                                        ? "cursor-not-allowed opacity-60" : ""}`}>
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <button type="submit" disabled={saving || (isProfileComplete && hasPendingRequest)}
                    className="mt-10 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >{saving ? "Saving..." : isProfileComplete ? "Request Profile Update" : "Complete Profile"}
                </button>
            </form>
        </DashboardLayout >
    );

}

export default Profile;