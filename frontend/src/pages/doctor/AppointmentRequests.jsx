import useAuth from "../../context/auth/useAuth";
import { useEffect, useMemo, useState } from "react";
import { getDoctorAppointments, approveAppointment, rejectAppointment, completeAppointment, } from "../../api/doctor";
import DashboardLayout from "../../layouts/DashboardLayout";

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
                <h2 className="text-2xl font-semibold">Loading Appointment Requests...</h2>
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

            <h1 className="text-3xl font-bold">Appointment Requests</h1>

            <p className="mt-2 text-slate-600">Review and manage incoming appointment requests.</p>

            {
                actionError && (<div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">{actionError}</div>)
            }

            {
                success && (<div className="mt-6 rounded-lg bg-green-100 p-4 text-green-700">{success}</div>)
            }
            <div className="mt-8 space-y-6">

                {pendingAppointments.map((appointment) => (

                    <div key={appointment._id} className="rounded-xl bg-white p-6 shadow">

                        <h2 className="text-xl font-semibold">
                            {appointment.patientId?.name}
                        </h2>

                        <p className="mt-2">
                            <strong>Gender:</strong> {appointment.patientId?.gender?.charAt(0).toUpperCase() +
                                appointment.patientId?.gender?.slice(1)}
                        </p>

                        <p className="mt-2">
                            <strong>Email:</strong>{" "}{appointment.patientId?.email}
                        </p>

                        <p className="mt-2">
                            <strong>Preferred Date:</strong> {new Date(appointment.preferredDate).toLocaleDateString(
                                "en-IN",
                                {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }
                            )}
                        </p>

                        <p className="mt-2">
                            <strong>Reason:</strong> {appointment.reasonForVisit}
                        </p>

                        <div className="mt-6 flex gap-4">

                            <button
                                onClick={() => {
                                    setSelectedId(appointment._id);
                                    setAction("approve");
                                }}
                                className="rounded-lg bg-green-600 px-5 py-2 text-white"
                            >
                                Approve
                            </button>

                            <button
                                onClick={() => {
                                    setSelectedId(appointment._id);
                                    setAction("reject");
                                }}
                                className="rounded-lg bg-red-600 px-5 py-2 text-white"
                            >
                                Reject
                            </button>

                        </div>

                        {selectedId === appointment._id && action === "approve" && (

                            <form onSubmit={(e) => handleApprove(e, appointment._id)} className="mt-8 space-y-4 border-t pt-6">

                                <div>

                                    <label className="mb-2 block font-medium">
                                        Appointment Date
                                    </label>

                                    <input type="date" value={approvalForm.appointmentDate} onChange={(e) =>
                                        setApprovalForm({ ...approvalForm, appointmentDate: e.target.value, })}
                                        className="w-full rounded-lg border px-4 py-3" />

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
                                        })} className="w-full rounded-lg border px-4 py-3" />
                                </div>

                                <div>

                                    <label className="mb-2 block font-medium">
                                        Duration (Minutes)
                                    </label>

                                    <input
                                        type="number"
                                        value={approvalForm.duration}
                                        onChange={(e) => setApprovalForm({ ...approvalForm, duration: e.target.value, })}
                                        className="w-full rounded-lg border px-4 py-3" />

                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-green-600 px-6 py-3 text-white disabled:opacity-60"
                                >
                                    {processing ? "Approving..." : "Confirm Approval"}
                                </button>

                            </form>

                        )}

                        {selectedId === appointment._id && action === "reject" && (

                            <form onSubmit={(e) =>
                                handleReject(e, appointment._id)
                            } className="mt-8 space-y-4 border-t pt-6">

                                <div>

                                    <label className="mb-2 block font-medium">
                                        Rejection Reason
                                    </label>

                                    <textarea rows="4" value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)} placeholder="Enter rejection reason..."
                                        className="w-full rounded-lg border px-4 py-3" />

                                </div>

                                <button type="submit" disabled={processing}
                                    className="rounded-lg bg-red-600 px-6 py-3 text-white disabled:opacity-60">
                                    {processing ? "Rejecting..." : "Reject Appointment"}
                                </button>

                            </form>

                        )}

                    </div>

                ))}

            </div>
            <div className="mt-14">

                <h2 className="text-2xl font-bold">
                    🏥 Today's Appointment Queue
                </h2>

                <p className="mt-2 text-slate-600">
                    Approved appointments waiting in today's queue.
                </p>

                {
                    queueAppointments.length === 0 ? (

                        <div className="mt-6 rounded-xl bg-white p-8 text-center shadow">
                            <h3 className="text-lg font-semibold">
                                No Patients In Queue
                            </h3>

                            <p className="mt-2 text-slate-500">
                                Approved appointments will appear here.
                            </p>
                        </div>

                    ) : (

                        <div className="mt-8 grid gap-6 lg:grid-cols-2">

                            {queueAppointments.map((appointment) => (

                                <div
                                    key={appointment._id}
                                    className="rounded-2xl border-l-8 border-blue-600 bg-white p-6 shadow"
                                >

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-sm font-semibold uppercase text-slate-500">
                                                Queue Token
                                            </p>

                                            <h2 className="mt-1 text-5xl font-extrabold text-blue-600">
                                                #{appointment.tokenNumber}
                                            </h2>

                                        </div>

                                        <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">

                                            Approved

                                        </div>

                                    </div>

                                    <hr className="my-6" />

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

                                        <div className="rounded-xl bg-slate-100 p-4">

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
                                        className="mt-8 w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700 cursor-pointer disabled:opacity-60"
                                    >
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

            </div>

        </DashboardLayout>
    );
}

export default AppointmentRequests;