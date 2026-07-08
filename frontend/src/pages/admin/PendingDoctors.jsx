import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import useAuth from "../../context/auth/useAuth";
import { getPendingDoctors, approveDoctor, rejectDoctor, } from "../../api/admin";
import { BadgeCheck, Clock3, Mail, Stethoscope, UserRound, XCircle } from "lucide-react";


function PendingDoctors() {

    const menuItems = [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Pending Doctors", path: "/admin/doctors" },
        { label: "Profile Requests", path: "/admin/profile-requests" },
        { label: "Logout", action: "logout" },
    ];

    const { user } = useAuth();

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [processingId, setProcessingId] = useState(null);

    const pendingCount = doctors.length;
    const approvedLabel = pendingCount === 0 ? "All reviewed" : `${pendingCount} awaiting`;



    useEffect(() => {
        const fetchPendingDoctors = async () => {
            try {
                const response = await getPendingDoctors();
                setDoctors(response.data.doctors);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load pending doctors.");
            } finally {
                setLoading(false);
            }
        };
        fetchPendingDoctors();
    }, []);


    const handleApprove = async (doctorId) => {

        setProcessingId(doctorId);
        setError("");
        setSuccess("");

        try {
            await approveDoctor(doctorId);
            setDoctors(prev => prev.filter(doctor => doctor._id !== doctorId));
            setSuccess("Doctor approved successfully.");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to approve doctor.");
        } finally {
            setProcessingId(null);
        }
    };


    const handleReject = async (doctorId) => {

        setProcessingId(doctorId);
        setError("");
        setSuccess("");

        try {
            await rejectDoctor(doctorId);
            setDoctors(prev => prev.filter(doctor => doctor._id !== doctorId));
            setSuccess("Doctor rejected successfully.");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to reject doctor.");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <DashboardLayout title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>
                <div className="space-y-6 animate-[admin-fade_240ms_ease-out]">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="h-4 w-44 animate-pulse rounded-full bg-slate-200" />
                        <div className="mt-4 h-8 w-80 animate-pulse rounded-full bg-slate-200" />
                        <div className="mt-3 h-4 w-[70%] animate-pulse rounded-full bg-slate-200" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="h-44 animate-pulse rounded-[1.5rem] border border-slate-200 bg-white shadow-sm" />
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error && doctors.length === 0) {
        return (
            <DashboardLayout title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>

            <div className="space-y-8 animate-[admin-fade_260ms_ease-out]">
                <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#0F172A,#111827)] p-6 text-white shadow-[0_30px_100px_-55px_rgba(15,23,42,0.85)] sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">Review queue</p>
                        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Pending Doctor Registrations</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                            Review new doctor registration requests, approve trusted clinicians, or reject incomplete submissions from a focused approval workspace.
                        </p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            {[
                                ["Waiting now", pendingCount, "Doctors in queue", "bg-white/5"],
                                ["Priority status", approvedLabel, "Real-time list", "bg-white/5"],
                                ["Review pace", processingId ? "In progress" : "Ready", "Single-action flow", "bg-white/5"],
                            ].map(([label, value, hint, tone]) => (
                                <div key={label} className={`rounded-2xl border border-white/10 ${tone} p-4`}>
                                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">{label}</p>
                                    <p className="mt-2 text-xl font-semibold text-white">{value}</p>
                                    <p className="mt-1 text-sm text-white/60">{hint}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Workflow guidance</p>
                        <h2 className="mt-2 text-xl font-semibold text-slate-950">Quick review rules</h2>
                        <div className="mt-5 space-y-3 text-sm text-slate-600">
                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                <BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-500" />
                                <span>Approve doctors with complete details and valid registration info.</span>
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                <Clock3 className="mt-0.5 h-4 w-4 text-blue-500" />
                                <span>Use the queue to keep approvals moving without losing context.</span>
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                <XCircle className="mt-0.5 h-4 w-4 text-rose-500" />
                                <span>Reject incomplete submissions quickly when fields are missing or inconsistent.</span>
                            </div>
                        </div>
                    </div>
                </section>

            {error && (<div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">{error}</div>)}

            {success && (<div className="mt-6 rounded-lg bg-green-100 p-4 text-green-700">{success}</div>)}



                <div className="mt-8 space-y-6">

                    {doctors.length === 0 ? (

                        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                <Stethoscope className="h-7 w-7" />
                            </div>

                            <h2 className="mt-5 text-2xl font-semibold text-slate-950">No Pending Doctors</h2>

                            <p className="mt-3 text-slate-500">
                                All doctor registration requests have been reviewed.
                            </p>

                        </div>

                    ) : (
                        doctors.map((doctor, index) => (
                            <article
                                key={doctor._id}
                                className="group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_24px_80px_-40px_rgba(15,23,42,0.24)] sm:p-6"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex gap-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,rgba(37,99,235,0.12),rgba(13,148,136,0.08))] text-slate-950 ring-1 ring-slate-200">
                                            <UserRound className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-xl font-semibold text-slate-950">{doctor.name}</h2>
                                                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                                                    Awaiting review
                                                </span>
                                            </div>
                                            <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                                                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                                                    <Mail className="h-4 w-4 text-slate-400" />
                                                    <span className="truncate">{doctor.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                                                    <Stethoscope className="h-4 w-4 text-slate-400" />
                                                    <span>{doctor.gender?.charAt(0).toUpperCase() + doctor.gender?.slice(1)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 lg:justify-end">
                                        <button
                                            onClick={() => handleReject(doctor._id)}
                                            disabled={processingId === doctor._id}
                                            className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {processingId === doctor._id ? "Processing..." : "Reject"}
                                        </button>
                                        <button
                                            onClick={() => handleApprove(doctor._id)}
                                            disabled={processingId === doctor._id}
                                            className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition duration-200 ease-out hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {processingId === doctor._id ? "Processing..." : "Approve"}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}

                </div>
            </div>

        </DashboardLayout>
    );
}

export default PendingDoctors;