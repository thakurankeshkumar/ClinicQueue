import { useEffect, useState } from "react";
import useAuth from "../../context/auth/useAuth";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getDoctor, bookAppointment } from "../../api/patient";
import { ArrowLeft, BadgeCheck, BadgeIndianRupee, CalendarDays, GraduationCap, Send, Stethoscope } from "lucide-react";

function DoctorDetails() {

    const { id } = useParams();
    const { user } = useAuth();
    const menuItems = [
        { label: "Dashboard", path: "/patient/dashboard" },
        { label: "Doctors", path: "/patient/doctors" },
        { label: "My Appointments", path: "/patient/appointments" },
        { label: "Logout", action: "logout" },
    ];
    const [doctor, setDoctor] = useState(null);
    const [formData, setFormData] = useState({ reasonForVisit: "", preferredDate: "" });

    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await getDoctor(id);
                setDoctor(response.data.doctor);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load doctor.");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value, });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (booking) return;

        setBooking(true);
        setError("");
        setSuccess("");

        try {
            await bookAppointment({
                doctorId: doctor._id,
                preferredDate: formData.preferredDate,
                reasonForVisit: formData.reasonForVisit
            });
            setSuccess("Appointment request submitted successfully.");
            setFormData({ reasonForVisit: "", preferredDate: "" });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to book appointment.");
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
                <div className="space-y-6 animate-pulse">
                    <div className="h-64 rounded-[2rem] border border-slate-200 bg-slate-100" />
                    <div className="h-80 rounded-[2rem] border border-slate-200 bg-slate-100" />
                </div>
            </DashboardLayout>
        );
    }

    if (error && !doctor) {
        return (
            <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
                <div className="rounded-lg bg-red-100 p-4 text-red-700">{error}</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
            <div className="space-y-7">
                <Link to="/patient/doctors" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Doctors
                </Link>

                <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                    <div className="bg-slate-950 p-6 text-white sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                                <Stethoscope className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-200/70">Doctor profile</p>
                                <div className="mt-2 flex flex-wrap items-center gap-3">
                                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{doctor.userId?.name}</h1>
                                    {doctor.isProfileVerified && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-300/30">
                                            <BadgeCheck className="h-3.5 w-3.5" />
                                            Verified
                                        </span>
                                    )}
                                </div>
                                <p className="mt-2 text-slate-300">{doctor.specialization}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 p-6 sm:p-8 md:grid-cols-2 xl:grid-cols-4">
                        {[
                            ["Qualification", doctor.qualification, GraduationCap],
                            ["Experience", `${doctor.experience} Years`, CalendarDays],
                            ["Consultation Fee", `₹${doctor.consultationFee}`, BadgeIndianRupee],
                            ["Available Days", doctor.availableDays.join(", "), CalendarDays],
                        ].map(([label, value, Icon]) => (
                            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <Icon className="h-5 w-5 text-blue-600" />
                                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
                                <p className="mt-2 font-semibold text-slate-950">{value}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-2xl font-semibold text-slate-950">Book Appointment</h2>
                    <p className="mt-2 text-slate-600">Share the visit reason and preferred date so the doctor can review your request.</p>

                    {error && doctor && (<div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>)}
                    {success && (<div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">{success}</div>)}

                    <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Reason for Visit</label>
                            <textarea
                                name="reasonForVisit"
                                rows="4"
                                value={formData.reasonForVisit}
                                onChange={handleChange}
                                placeholder="Describe your health concern..."
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Preferred Date</label>
                            <input
                                type="date"
                                name="preferredDate"
                                value={formData.preferredDate}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        <button type="submit" disabled={booking} className="inline-flex w-fit items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                            <Send className="h-4 w-4" />
                            {booking ? "Submitting..." : "Request Appointment"}
                        </button>
                    </form>
                </section>
            </div>
        </DashboardLayout>
    );

}

export default DoctorDetails;
