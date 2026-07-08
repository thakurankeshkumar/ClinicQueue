import useAuth from "../../context/auth/useAuth";
import { useEffect, useMemo, useState } from "react";
import { getDoctorDashboard } from "../../api/doctor";
import DashboardLayout from "../../layouts/DashboardLayout";
import { CalendarDays, CheckCircle2, Clock3, History, UserRound, XCircle } from "lucide-react";

function AppointmentHistory() {

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
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await getDoctorDashboard();
                setAppointments(response.data.allAppointments);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load appointment history.");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();

    }, []);

    const historyAppointments = useMemo(() => {
        return appointments.filter(appointment => appointment.status === "completed" || appointment.status === "rejected");
    }, [appointments]);

    const historyStats = useMemo(() => {
        return historyAppointments.reduce((stats, appointment) => {
            stats[appointment.status] = (stats[appointment.status] || 0) + 1;
            return stats;
        }, {});
    }, [historyAppointments]);

    if (loading) {
        return (
            <DashboardLayout title={user?.name || "Doctor"} role="Doctor" menuItems={menuItems}>
                <div className="space-y-6 animate-pulse">
                    <div className="h-40 rounded-[2rem] border border-slate-200 bg-slate-100" />
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-56 rounded-2xl border border-slate-200 bg-slate-100" />
                    ))}
                </div>
            </DashboardLayout>
        );
    }


    if (error) {
        return (
            <DashboardLayout title={user?.name || "Doctor"} role="Doctor" menuItems={menuItems}>
                <div className="rounded-lg bg-red-100 p-4 text-red-700">
                    {error}
                </div>
            </DashboardLayout>
        );
    }




    return (
        <DashboardLayout title={user?.name || "Doctor"} role="Doctor" menuItems={menuItems}>
            <div className="space-y-8">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Patient records</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Appointment History</h1>
                    <p className="mt-3 max-w-2xl text-slate-600">Review completed visits and rejected requests with their clinical context.</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Total</p>
                            <p className="mt-2 text-2xl font-semibold text-slate-950">{historyAppointments.length}</p>
                        </div>
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Completed</p>
                            <p className="mt-2 text-2xl font-semibold text-emerald-900">{historyStats.completed || 0}</p>
                        </div>
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">Rejected</p>
                            <p className="mt-2 text-2xl font-semibold text-rose-900">{historyStats.rejected || 0}</p>
                        </div>
                    </div>
                </section>

            <div className="space-y-5">
                {
                    historyAppointments.length === 0 && (
                        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                            <History className="mx-auto h-10 w-10 text-slate-400" />
                            <h2 className="text-xl font-semibold">
                                No Appointment History
                            </h2>
                            <p className="mt-2 text-slate-500">
                                Completed and rejected appointments will appear here.
                            </p>
                        </div>
                    )
                }

                {
                    historyAppointments.map((appointment) => (

                        appointment.status === "completed" ? (

                            <article key={appointment._id} className="rounded-[1.5rem] border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                            <UserRound className="h-5 w-5" />
                                        </div>
                                        <div>
                                        <h2 className="text-2xl font-bold">
                                            {appointment.patientId?.name}
                                        </h2>
                                        <p className="mt-1 text-slate-500">
                                            {appointment.patientId?.gender?.charAt(0).toUpperCase() +
                                                appointment.patientId?.gender?.slice(1)} • {appointment.patientId?.email}
                                        </p>
                                        </div>
                                    </div>
                                    <div className="flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-5 py-2 font-semibold text-emerald-700">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Completed
                                    </div>
                                </div>

                                <div className="mt-8 grid gap-5 md:grid-cols-2">

                                    <div>
                                        <p className="flex items-center gap-2 text-sm text-slate-500"><CalendarDays className="h-4 w-4" />Appointment Date</p>
                                        <p className="font-semibold">
                                            {new Date(appointment.appointmentDate).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    weekday: "short",
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                }
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="flex items-center gap-2 text-sm text-slate-500"><Clock3 className="h-4 w-4" />Appointment Time</p>
                                        <p className="font-semibold">{appointment.appointmentTime}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">Queue Token</p>
                                        <p className="text-2xl font-bold text-blue-600">#{appointment.tokenNumber ?? "-"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">Duration</p>
                                        <p className="font-semibold">{appointment.duration ?? "-"} Minutes</p>
                                    </div>

                                </div>

                                <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                                    <h3 className="font-semibold">Reason For Visit</h3>
                                    <p className="mt-2 text-slate-600">{appointment.reasonForVisit}</p>
                                </div>

                                <div className="mt-6 text-right text-sm text-slate-500">
                                    Completed on{" "}
                                    {appointment.completedAt &&
                                        new Date(appointment.completedAt).toLocaleString("en-IN", {
                                            weekday: "short",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                </div>

                            </article>

                        ) : (

                            <article key={appointment._id} className="rounded-[1.5rem] border border-rose-200 bg-white p-6 shadow-sm sm:p-8">

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                                            <UserRound className="h-5 w-5" />
                                        </div>
                                        <div>
                                        <h2 className="text-2xl font-bold"> {appointment.patientId?.name}</h2>

                                        <p className="mt-1 text-slate-500">
                                            {appointment.patientId?.gender?.charAt(0).toUpperCase() +
                                                appointment.patientId?.gender?.slice(1)} • {appointment.patientId?.email}
                                        </p>
                                        </div>
                                    </div>

                                    <div className="flex w-fit items-center gap-2 rounded-full bg-rose-50 px-5 py-2 font-semibold text-rose-700">
                                        <XCircle className="h-4 w-4" />
                                        Rejected
                                    </div>
                                </div>

                                <div className="mt-8 grid gap-5 md:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-slate-500">Preferred Date</p>

                                        <p className="font-semibold">
                                            {
                                                appointment.preferredDate &&
                                                new Date(
                                                    appointment.preferredDate
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        weekday: "short",
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    }
                                                )
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                                    <h3 className="font-semibold">Reason For Visit</h3>
                                    <p className="mt-2 text-slate-600">{appointment.reasonForVisit}</p>
                                </div>

                                <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5">
                                    <h3 className="font-semibold text-red-700">Rejection Reason</h3>
                                    <p className="mt-2 text-red-600">{appointment.rejectionReason}</p>
                                </div>
                                <div className="mt-6 text-right text-sm text-slate-500">
                                    Rejected on{" "}
                                    {appointment.rejectedAt &&
                                        new Date(appointment.rejectedAt).toLocaleString(
                                            "en-IN",
                                            {
                                                weekday: "short",
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                </div>
                            </article>
                        )
                    ))
                }
            </div>
            </div>
        </DashboardLayout>
    );
}

export default AppointmentHistory;
