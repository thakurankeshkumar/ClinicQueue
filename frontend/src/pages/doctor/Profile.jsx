import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getDoctorProfile, completeDoctorProfile, updateDoctorProfile, } from "../../api/doctor";
import useAuth from "../../context/auth/useAuth";
import { BadgeIndianRupee, CalendarDays, Clock3, Phone, Save, ShieldCheck, Stethoscope } from "lucide-react";

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
                <div className="space-y-6 animate-pulse">
                    <div className="h-40 rounded-[2rem] border border-slate-200 bg-slate-100" />
                    <div className="h-96 rounded-[2rem] border border-slate-200 bg-slate-100" />
                </div>
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
            <div className="space-y-7">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Professional profile</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">My Professional Profile</h1>
                            <p className="mt-3 max-w-2xl text-slate-600">Manage the details patients and admins use to verify your clinic availability.</p>
                        </div>
                        <div className={`rounded-2xl border px-5 py-4 ${isProfileComplete ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                            <div className="flex items-center gap-2 font-semibold">
                                <ShieldCheck className="h-4 w-4" />
                                {isProfileComplete ? "Profile complete" : "Profile incomplete"}
                            </div>
                        </div>
                    </div>
                </section>

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
                )}

                {success && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">{success}</div>
                )}

                {isProfileComplete && hasPendingRequest && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                        Your profile update request is awaiting admin approval. You cannot make further changes until it is reviewed.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="grid gap-5 md:grid-cols-2">
                        {[
                            ["Phone Number", "phoneNumber", "text", Phone],
                            ["Specialization", "specialization", "text", Stethoscope],
                            ["Qualification", "qualification", "text", ShieldCheck],
                            ["Experience (Years)", "experience", "number", Clock3],
                            ["Consultation Fee (₹)", "consultationFee", "number", BadgeIndianRupee],
                        ].map(([label, name, type, Icon]) => (
                            <div key={name}>
                                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Icon className="h-4 w-4 text-slate-400" />
                                    {label}
                                </label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    disabled={isProfileComplete && hasPendingRequest}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            Available Days
                        </label>

                        <div className="flex flex-wrap gap-3">
                            {days.map((day) => {
                                const selected = formData.availableDays.includes(day);
                                return (
                                    <button key={day} type="button" disabled={isProfileComplete && hasPendingRequest} onClick={() => handleDayToggle(day)} className={`rounded-2xl border px-5 py-2.5 text-sm font-semibold transition ${selected
                                        ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/15" : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"} ${isProfileComplete && hasPendingRequest
                                            ? "cursor-not-allowed opacity-60" : ""}`}>
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button type="submit" disabled={saving || (isProfileComplete && hasPendingRequest)}
                        className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save className="h-4 w-4" />
                        {saving ? "Saving..." : isProfileComplete ? "Request Profile Update" : "Complete Profile"}
                    </button>
                </form>
            </div>
        </DashboardLayout >
    );

}

export default Profile;
