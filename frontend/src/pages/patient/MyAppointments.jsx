import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getMyAppointments } from "../../api/patient";
import useAuth from "../../context/auth/useAuth";
import { CalendarDays, ClipboardList, Clock3, Hash, Stethoscope } from "lucide-react";

function MyAppointments() {

    const { user } = useAuth();

    const menuItems = [
        { label: "Dashboard", path: "/patient/dashboard" },
        { label: "Doctors", path: "/patient/doctors" },
        { label: "My Appointments", path: "/patient/appointments" },
        { label: "Logout", action: "logout" },
    ];

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await getMyAppointments();
                setAppointments(response.data.appointments);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load appointments.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();

    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "completed":
                return "bg-blue-100 text-blue-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const appointmentStats = useMemo(() => {
        return appointments.reduce((stats, appointment) => {
            stats[appointment.status] = (stats[appointment.status] || 0) + 1;
            return stats;
        }, {});
    }, [appointments]);

    if (loading) {
        return (
            <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
                <div className="space-y-5 animate-pulse">
                    <div className="h-36 rounded-[2rem] border border-slate-200 bg-slate-100" />
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-44 rounded-2xl border border-slate-200 bg-slate-100" />
                    ))}
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
                <div className="rounded-lg bg-red-100 p-4 text-red-700">{error}</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
            <div className="space-y-8">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Appointment timeline</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">My Appointments</h1>
                    <p className="mt-3 max-w-2xl text-slate-600">Track all appointment requests, queue tokens, and doctor decisions in one place.</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-4">
                        {["pending", "approved", "completed", "rejected"].map((status) => (
                            <div key={status} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{status}</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-950">{appointmentStats[status] || 0}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {appointments.length === 0 ? (
                    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                        <ClipboardList className="mx-auto h-10 w-10 text-slate-400" />
                        <h2 className="mt-4 text-xl font-semibold text-slate-950">No Appointments Found</h2>
                        <p className="mt-2 text-slate-500">Book your first appointment to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {appointments.map((appointment) => (
                            <article key={appointment._id} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                            <Stethoscope className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-slate-950">{appointment.doctorId?.userId?.name}</h2>
                                            <p className="mt-1 text-sm text-slate-500">{appointment.doctorId?.specialization}</p>
                                        </div>
                                    </div>
                                    <span className={`w-fit rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusColor(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                </div>

                                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Reason</p>
                                    <p className="mt-2 text-slate-700">{appointment.reasonForVisit}</p>
                                </div>

                                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                    {appointment.preferredDate && (
                                        <div className="rounded-2xl border border-slate-200 p-4">
                                            <CalendarDays className="h-4 w-4 text-slate-400" />
                                            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Preferred Date</p>
                                            <p className="mt-1 font-semibold text-slate-950">{new Date(appointment.preferredDate).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                    {appointment.appointmentDate && (
                                        <div className="rounded-2xl border border-slate-200 p-4">
                                            <CalendarDays className="h-4 w-4 text-slate-400" />
                                            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Appointment Date</p>
                                            <p className="mt-1 font-semibold text-slate-950">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                    {appointment.appointmentTime && (
                                        <div className="rounded-2xl border border-slate-200 p-4">
                                            <Clock3 className="h-4 w-4 text-slate-400" />
                                            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Appointment Time</p>
                                            <p className="mt-1 font-semibold text-slate-950">{appointment.appointmentTime}</p>
                                        </div>
                                    )}
                                    {appointment.tokenNumber && (
                                        <div className="rounded-2xl border border-slate-200 p-4">
                                            <Hash className="h-4 w-4 text-slate-400" />
                                            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Token Number</p>
                                            <p className="mt-1 font-semibold text-slate-950">#{appointment.tokenNumber}</p>
                                        </div>
                                    )}
                                </div>

                                {appointment.rejectionReason && (
                                    <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em]">Rejection Reason</p>
                                        <p className="mt-2">{appointment.rejectionReason}</p>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default MyAppointments;
