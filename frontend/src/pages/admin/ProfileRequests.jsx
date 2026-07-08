import { useEffect, useState } from "react";
import useAuth from "../../context/auth/useAuth";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getProfileRequests, approveProfileRequest, rejectProfileRequest, } from "../../api/admin";
import { BadgeCheck, ClipboardList, Clock3, FileText, Mail, UserRound } from "lucide-react";



function ProfileRequests() {

    const menuItems = [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Pending Doctors", path: "/admin/doctors" },
        { label: "Profile Requests", path: "/admin/profile-requests" },
        { label: "Logout", action: "logout" },
    ];

    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [processingId, setProcessingId] = useState(null);
    const [expandedCard, setExpandedCard] = useState(null);

    const totalRequests = requests.length;
    const expandedCount = expandedCard ? 1 : 0;

    useEffect(() => {
        const fetchProfileRequests = async () => {
            try {
                const response = await getProfileRequests();
                setRequests(response.data.requests);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load profile requests.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfileRequests();
    }, []);


    const handleApprove = async (requestId) => {

        setProcessingId(requestId);

        setError("");
        setSuccess("");

        try {
            await approveProfileRequest(requestId);
            setRequests(prev => prev.filter(request => request._id !== requestId));
            setSuccess("Profile update approved successfully.");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to approve request.");
        } finally {
            setProcessingId(null);
        }

    };

    const handleReject = async (requestId) => {

        setProcessingId(requestId);

        setError("");
        setSuccess("");

        try {
            await rejectProfileRequest(requestId);
            setRequests(prev => prev.filter(request => request._id !== requestId));
            setSuccess("Profile update rejected successfully.");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to reject request.");
        } finally {
            setProcessingId(null);
        }
    };

    const getChangedFieldsCount = (request) => {

        let count = 0;

        if (request.doctorId.phoneNumber !== request.phoneNumber) count++;
        if (request.doctorId.specialization !== request.specialization) count++;
        if (request.doctorId.qualification !== request.qualification) count++;
        if (request.doctorId.experience !== request.experience) count++;
        if (request.doctorId.consultationFee !== request.consultationFee) count++;

        if (
            JSON.stringify(request.doctorId.availableDays) !== JSON.stringify(request.availableDays)
        ) {
            count++;
        }
        return count;
    };

    const isChanged = (currentValue, requestedValue) => { return JSON.stringify(currentValue) !== JSON.stringify(requestedValue); };


    if (loading) {
        return (
            <DashboardLayout title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>
                <div className="space-y-6 animate-[admin-fade_240ms_ease-out]">
                    <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="h-4 w-48 animate-pulse rounded-full bg-slate-200" />
                        <div className="mt-4 h-8 w-96 animate-pulse rounded-full bg-slate-200" />
                        <div className="mt-3 h-4 w-[72%] animate-pulse rounded-full bg-slate-200" />
                    </div>
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="h-96 animate-pulse rounded-4xl border border-slate-200 bg-white shadow-sm" />
                    ))}
                </div>
            </DashboardLayout>
        );
    }

    if (error && requests.length === 0) {
        return (
            <DashboardLayout title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>

            <div className="space-y-8 animate-[admin-fade_260ms_ease-out]">
                <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-4xl border border-slate-200 bg-[linear-gradient(135deg,#0F172A,#111827)] p-6 text-white shadow-[0_30px_100px_-55px_rgba(15,23,42,0.85)] sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">Profile audit</p>
                        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Profile Update Requests</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                            Review doctor profile updates in a comparison-first workspace. Changes are highlighted clearly so you can approve the right details with confidence.
                        </p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            {[
                                ["Requests in queue", totalRequests, "Current items", "bg-white/5"],
                                ["Expanded profiles", expandedCount, "Detailed review mode", "bg-white/5"],
                                ["Change tracking", "Live", "Highlighted deltas", "bg-white/5"],
                            ].map(([label, value, hint, tone]) => (
                                <div key={label} className={`rounded-2xl border border-white/10 ${tone} p-4`}>
                                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">{label}</p>
                                    <p className="mt-2 text-xl font-semibold text-white">{value}</p>
                                    <p className="mt-1 text-sm text-white/60">{hint}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Review checklist</p>
                        <h2 className="mt-2 text-xl font-semibold text-slate-950">What to check first</h2>
                        <div className="mt-5 space-y-3 text-sm text-slate-600">
                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                <BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-500" />
                                <span>Confirm the updated fields before approving profile edits.</span>
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                <Clock3 className="mt-0.5 h-4 w-4 text-blue-500" />
                                <span>Use the highlighted comparison to speed up the review flow.</span>
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                <ClipboardList className="mt-0.5 h-4 w-4 text-amber-500" />
                                <span>Expand a card when you need the full doctor profile context.</span>
                            </div>
                        </div>
                    </div>
                </section>

            {error && (<div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">{error}</div>)}

            {success && (<div className="mt-6 rounded-lg bg-green-100 p-4 text-green-700">{success}</div>)}

                <div className="mt-8 space-y-6">
                {requests.length === 0 ? (
                        <div className="rounded-4xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <FileText className="h-7 w-7" />
                            </div>
                            <h2 className="mt-5 text-2xl font-semibold text-slate-950">No Pending Profile Requests</h2>
                            <p className="mt-3 text-slate-500">There are currently no doctor profile update requests.</p>
                        </div>
                ) : (
                    requests.map((request, index) => (
                        <article
                            key={request._id}
                            className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_24px_80px_-40px_rgba(15,23,42,0.22)]"
                            style={{ animationDelay: `${index * 80}ms` }}
                        >

                            <div className="border-b border-slate-200 bg-[linear-gradient(180deg,rgba(37,99,235,0.05),rgba(13,148,136,0.03))] p-6 sm:p-7">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex gap-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                                            <UserRound className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-2xl font-semibold text-slate-950">{request.doctorId.userId.name}</h2>
                                                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                                                    {getChangedFieldsCount(request)} fields modified
                                                </span>
                                            </div>
                                            <div className="mt-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200">
                                                <Mail className="h-4 w-4 text-slate-400" />
                                                <span>{request.doctorId.userId.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-sm">
                                        <p className="text-xs uppercase tracking-[0.24em] text-white/45">Review status</p>
                                        <p className="mt-1 text-sm font-semibold">Awaiting admin decision</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 sm:p-7">
                                <h3 className="text-lg font-semibold text-slate-950">Requested changes</h3>
                                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {[
                                        ["Phone", request.doctorId.phoneNumber, request.phoneNumber],
                                        ["Specialization", request.doctorId.specialization, request.specialization],
                                        ["Qualification", request.doctorId.qualification, request.qualification],
                                        ["Experience", `${request.doctorId.experience} Years`, `${request.experience} Years`],
                                        ["Consultation Fee", `₹${request.doctorId.consultationFee}`, `₹${request.consultationFee}`],
                                        ["Available Days", request.doctorId.availableDays.join(", "), request.availableDays.join(", ")],
                                    ].map(([field, current, requested]) => {
                                        const changed = isChanged(current, requested);

                                        return (
                                            <div key={field} className={`rounded-2xl border p-4 transition duration-200 ${changed ? "border-blue-200 bg-blue-50/60" : "border-slate-200 bg-slate-50/70"}`}>
                                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{field}</p>
                                                <div className="mt-4 grid gap-2">
                                                    <div>
                                                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">Current</p>
                                                        <p className="mt-1 text-sm font-medium text-slate-700">{current}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-blue-500">Requested</p>
                                                        <p className={`mt-1 text-sm font-semibold ${changed ? "text-blue-700" : "text-slate-700"}`}>{requested}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="border-t border-slate-200 px-6 py-5 sm:px-7">
                                <button
                                    type="button"
                                    onClick={() => setExpandedCard(expandedCard === request._id ? null : request._id)}
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 ease-out hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    <ClipboardList className="h-4 w-4" />
                                    {expandedCard === request._id ? "Hide complete doctor profile" : "Review complete doctor profile"}
                                </button>
                            </div>

                            {expandedCard === request._id && (

                                <div className="border-t border-slate-200 bg-slate-50 p-6 sm:p-7">
                                    <div className="grid gap-4 lg:grid-cols-2">
                                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <h3 className="text-lg font-semibold text-slate-950">Personal information</h3>
                                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                                <div className="rounded-2xl bg-slate-50 p-4">
                                                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Name</p>
                                                    <p className="mt-2 font-semibold text-slate-950">{request.doctorId.userId.name}</p>
                                                </div>
                                                <div className="rounded-2xl bg-slate-50 p-4">
                                                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Email</p>
                                                    <p className="mt-2 font-semibold text-slate-950">{request.doctorId.userId.email}</p>
                                                </div>
                                                <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                                                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Phone Number</p>
                                                    <p className={`mt-2 font-semibold ${isChanged(request.doctorId.phoneNumber, request.phoneNumber) ? "text-blue-700" : "text-slate-950"}`}>{request.phoneNumber}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <h3 className="text-lg font-semibold text-slate-950">Professional information</h3>
                                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                                {[
                                                    ["Specialization", request.specialization],
                                                    ["Qualification", request.qualification],
                                                    ["Experience", `${request.experience} Years`],
                                                    ["Consultation Fee", `₹${request.consultationFee}`],
                                                ].map(([label, value]) => (
                                                    <div key={label} className={`rounded-2xl border p-4 ${isChanged(request.doctorId[label.toLowerCase()] ?? request.doctorId.experience, request[label.toLowerCase()] ?? request.experience) ? "border-blue-200 bg-blue-50/60" : "border-slate-200 bg-slate-50"}`}>
                                                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
                                                        <p className="mt-2 font-semibold text-slate-950">{value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Available Days</p>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {request.availableDays.map((day) => (
                                                        <span key={day} className="rounded-full bg-white px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-200">
                                                            {day}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )}

                            <div className="flex flex-col gap-3 border-t border-slate-200 p-6 sm:flex-row sm:justify-end">
                                <button
                                    onClick={() => handleReject(request._id)}
                                    disabled={processingId === request._id}
                                    className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-semibold text-rose-700 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processingId === request._id ? "Processing..." : "Reject Request"}
                                </button>

                                <button
                                    onClick={() => handleApprove(request._id)}
                                    disabled={processingId === request._id}
                                    className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition duration-200 ease-out hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processingId === request._id ? "Processing..." : "Approve Changes"}
                                </button>

                            </div>


                        </article>
                    ))
                )}

                </div>
            </div>
        </DashboardLayout>
    );
}

export default ProfileRequests;
