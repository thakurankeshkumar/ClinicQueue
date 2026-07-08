import useAuth from "../../context/auth/useAuth";
import { useEffect, useMemo, useState } from "react";
import { getDoctorAppointments, approveAppointment, rejectAppointment, completeAppointment, } from "../../api/doctor";
import DashboardLayout from "../../layouts/DashboardLayout";
import { CalendarDays, CheckCircle2, Mail, UserRound, XCircle } from "lucide-react";

function AppointmentRequests() {

    const menuItems = [
        { label: "Dashboard", path: "/doctor/dashboard" },
        { label: "My Profile", path: "/doctor/profile" },
        { label: "Appointment Requests", path: "/doctor/appointments" },
        { label: "Appointment History", path: "/doctor/history" },
        { label: "Logout", action: "logout" },
    ];

    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [pageError, setPageError] = useState("");
    const [actionError, setActionError] = useState("");

    const [selectedId, setSelectedId] = useState(null);
    const [action, setAction] = useState("");
    const [processing, setProcessing] = useState(false);
    const [completingId, setCompletingId] = useState(null);

    const [approvalForm, setApprovalForm] = useState({ appointmentDate: "", appointmentTime: "", duration: 30, });
    const [rejectionReason, setRejectionReason] = useState("");
    const [success, setSuccess] = useState("");


    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await getDoctorAppointments();
                setAppointments(response.data.appointments);
            } catch (err) {
                console.error(err);
                setPageError(err.response?.data?.message || "Failed to load appointments.");
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const pendingAppointments = useMemo(() => {
        return appointments.filter(appointment => appointment.status === "pending");
    }, [appointments]);

    const queueAppointments = useMemo(() => {
        return appointments.filter(appointment => appointment.status === "approved").sort((a, b) => a.tokenNumber - b.tokenNumber);
    }, [appointments]);

    const handleApprove = async (e, appointmentId) => {

        e.preventDefault();

        setProcessing(true);
        setActionError("")
        setSuccess("");

        try {

            const response = await approveAppointment(
                appointmentId,
                {
                    appointmentDate: approvalForm.appointmentDate,
                    appointmentTime: approvalForm.appointmentTime,
                    duration: Number(approvalForm.duration),
                }
            );

            const updatedAppointment = response.data.appointment;

            setAppointments(prev =>
                prev.map(appointment =>
                    appointment._id === appointmentId
                        ? updatedAppointment
                        : appointment
                )
            );

            setSelectedId(null);
            setAction("");

            setApprovalForm({
                appointmentDate: "",
                appointmentTime: "",
                duration: 30,
            });

            setSuccess("Appointment approved successfully.");

        } catch (err) {

            console.error(err);
            setActionError(err.response?.data?.message ||
                "Failed to approve appointment.");

        } finally {

            setProcessing(false);

        }

    };

    const handleReject = async (e, appointmentId) => {

        e.preventDefault();

        setProcessing(true);
        setActionError("");
        setSuccess("");

        try {

            await rejectAppointment(
                appointmentId,
                {
                    rejectionReason,
                }
            );

            setAppointments(prev =>
                prev.filter(
                    appointment =>
                        appointment._id !== appointmentId
                )
            );

            setSelectedId(null);

            setAction("");

            setRejectionReason("");

            setSuccess("Appointment rejected successfully.");

        } catch (err) {

            console.error(err);
            setActionError(err.response?.data?.message ||
                "Failed to reject appointment.");

        } finally {

            setProcessing(false);

        }

    };

    const handleComplete = async (appointmentId) => {

        setCompletingId(appointmentId);
        setActionError("");
        setSuccess("");

        try {

            await completeAppointment(appointmentId);

            setAppointments(prev =>
                prev.filter(
                    appointment => appointment._id !== appointmentId
                )
            );

            setSuccess("Appointment completed successfully.");

        } catch (err) {

            console.error(err);

            setActionError(
                err.response?.data?.message ||
                "Failed to complete appointment."
            );

        } finally {

            setCompletingId(null);

        }

    };

    if (loading) {
        return (
            <DashboardLayout title={user?.name || "Doctor"} role="Doctor" menuItems={menuItems}>
                <div className="space-y-6 animate-pulse">
                    <div className="h-40 rounded-[2rem] border border-slate-200 bg-slate-100" />
                    <div className="grid gap-5 lg:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="h-72 rounded-2xl border border-slate-200 bg-slate-100" />
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (pageError) {
        return (
            <DashboardLayout title={user?.name || "Doctor"} role="Doctor" menuItems={menuItems}>
                <div className="rounded-lg bg-red-100 p-4 text-red-700">{pageError}</div>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout title={user?.name || "Doctor"} role="Doctor" menuItems={menuItems}>
            <div className="space-y-8">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Clinical queue</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Appointment Requests</h1>
                            <p className="mt-3 max-w-2xl text-slate-600">Review new requests, schedule approved visits, and complete active queue items.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:min-w-72">
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Pending</p>
                                <p className="mt-2 text-2xl font-semibold text-amber-900">{pendingAppointments.length}</p>
                            </div>
                            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">In Queue</p>
                                <p className="mt-2 text-2xl font-semibold text-blue-900">{queueAppointments.length}</p>
                            </div>
                        </div>
                    </div>
                </section>

            {
                actionError && (<div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{actionError}</div>)
            }

            {
                success && (<div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">{success}</div>)
            }

            <section>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">New requests</p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Awaiting decision</h2>
                    </div>
                </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-2">
                {pendingAppointments.length === 0 && (
                    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm xl:col-span-2">
                        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
                        <h3 className="mt-4 text-xl font-semibold text-slate-950">No Pending Requests</h3>
                        <p className="mt-2 text-slate-500">New patient requests will appear here.</p>
                    </div>
                )}

                {pendingAppointments.map((appointment) => (

                    <article key={appointment._id} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                                <UserRound className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xl font-semibold text-slate-950">{appointment.patientId?.name}</h3>
                                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                                    <Mail className="h-4 w-4" />
                                    {appointment.patientId?.email}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Gender</p>
                                <p className="mt-2 font-semibold capitalize text-slate-950">{appointment.patientId?.gender}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    <CalendarDays className="h-4 w-4" />
                                    Preferred Date
                                </p>
                                <p className="mt-2 font-semibold text-slate-950">{new Date(appointment.preferredDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</p>
                            </div>
                        </div>

                        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Reason</p>
                            <p className="mt-2 text-slate-700">{appointment.reasonForVisit}</p>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedId(appointment._id);
                                    setAction("approve");
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Approve
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedId(appointment._id);
                                    setAction("reject");
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100"
                            >
                                <XCircle className="h-4 w-4" />
                                Reject
                            </button>

                        </div>

                        {selectedId === appointment._id && action === "approve" && (

                            <form onSubmit={(e) => handleApprove(e, appointment._id)} className="mt-8 grid gap-4 border-t border-slate-200 pt-6">

                                <div>

                                    <label className="mb-2 block font-medium">
                                        Appointment Date
                                    </label>

                                    <input type="date" value={approvalForm.appointmentDate} onChange={(e) =>
                                        setApprovalForm({ ...approvalForm, appointmentDate: e.target.value, })}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100" />

                                </div>

                                <div>

                                    <label className="mb-2 block font-medium">
                                        Appointment Time
                                    </label>

                                    <input
                                        type="time"
                                        value={approvalForm.appointmentTime}
                                        onChange={(e) => setApprovalForm({
                                            ...approvalForm, appointmentTime: e.target.value,
                                        })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100" />
                                </div>

                                <div>

                                    <label className="mb-2 block font-medium">
                                        Duration (Minutes)
                                    </label>

                                    <input
                                        type="number"
                                        value={approvalForm.duration}
                                        onChange={(e) => setApprovalForm({ ...approvalForm, duration: e.target.value, })}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100" />

                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-fit rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white disabled:opacity-60"
                                >
                                    {processing ? "Approving..." : "Confirm Approval"}
                                </button>

                            </form>

                        )}

                        {selectedId === appointment._id && action === "reject" && (

                            <form onSubmit={(e) =>
                                handleReject(e, appointment._id)
                            } className="mt-8 grid gap-4 border-t border-slate-200 pt-6">

                                <div>

                                    <label className="mb-2 block font-medium">
                                        Rejection Reason
                                    </label>

                                    <textarea rows="4" value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)} placeholder="Enter rejection reason..."
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100" />

                                </div>

                                <button type="submit" disabled={processing}
                                    className="w-fit rounded-2xl bg-rose-600 px-6 py-3 font-semibold text-white disabled:opacity-60">
                                    {processing ? "Rejecting..." : "Reject Appointment"}
                                </button>

                            </form>

                        )}

                    </article>

                ))}

            </div>
            </section>

            <section>

                <h2 className="text-2xl font-semibold text-slate-950">
                    Today&apos;s Appointment Queue
                </h2>

                <p className="mt-2 text-slate-600">
                    Approved appointments waiting in today's queue.
                </p>

                {
                    queueAppointments.length === 0 ? (

                        <div className="mt-6 rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                            <h3 className="text-lg font-semibold">
                                No Patients In Queue
                            </h3>

                            <p className="mt-2 text-slate-500">
                                Approved appointments will appear here.
                            </p>
                        </div>

                    ) : (

                        <div className="mt-8 grid gap-5 lg:grid-cols-2">

                            {queueAppointments.map((appointment) => (

                                <div
                                    key={appointment._id}
                                    className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm"
                                >

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                                Queue Token
                                            </p>

                                            <h2 className="mt-1 text-5xl font-extrabold text-blue-600">
                                                #{appointment.tokenNumber}
                                            </h2>

                                        </div>

                                        <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">

                                            Approved

                                        </div>

                                    </div>

                                    <hr className="my-6 border-slate-200" />

                                    <div className="space-y-3">

                                        <p>
                                            <strong>Patient:</strong>{" "}
                                            {appointment.patientId?.name}
                                        </p>

                                        <p>
                                            <strong>Gender:</strong>{" "}
                                            {appointment.patientId?.gender}
                                        </p>

                                        <p>
                                            <strong>Email:</strong>{" "}
                                            {appointment.patientId?.email}
                                        </p>

                                        <p>
                                            <strong>Date:</strong>{" "}
                                            {new Date(
                                                appointment.appointmentDate
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    weekday: "short",
                                                    day: "numeric",
                                                    month: "long",
                                                }
                                            )}
                                        </p>

                                        <p>
                                            <strong>Time:</strong>{" "}
                                            {appointment.appointmentTime}
                                        </p>

                                        <p>
                                            <strong>Duration:</strong>{" "}
                                            {appointment.duration} Minutes
                                        </p>

                                        <div className="rounded-2xl bg-slate-50 p-4">

                                            <p className="font-semibold">
                                                Reason for Visit
                                            </p>

                                            <p className="mt-2 text-slate-600">
                                                {appointment.reasonForVisit}
                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        onClick={() => handleComplete(appointment._id)}
                                        disabled={completingId === appointment._id}
                                        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 cursor-pointer disabled:opacity-60"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        {
                                            completingId === appointment._id
                                                ? "Completing..."
                                                : "Complete Appointment"
                                        }
                                    </button>

                                </div>

                            ))}

                        </div>

                    )

                }

            </section>
            </div>

        </DashboardLayout>
    );
}

export default AppointmentRequests;
