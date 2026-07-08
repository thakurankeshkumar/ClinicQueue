import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getDoctorDashboard } from "../../api/doctor";
import useAuth from "../../context/auth/useAuth";
import { CalendarCheck2, CheckCircle2, Clock3, ClipboardList, UserRoundCheck } from "lucide-react";

function Dashboard() {

    const { user } = useAuth();

    const menuItems = [
        { label: "Dashboard", path: "/doctor/dashboard" },
        { label: "My Profile", path: "/doctor/profile" },
        { label: "Appointment Requests", path: "/doctor/appointments" },
        { label: "Appointment History", path: "/doctor/history" },
        { label: "Logout", action: "logout" },
    ];

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await getDoctorDashboard();
                setDashboard(response.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load dashboard.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "text-green-600";
            case "completed":
                return "text-blue-600";
            case "pending":
                return "text-yellow-600";
            case "rejected":
                return "text-red-600";
            default:
                return "text-slate-600";
        }
    };

    if (loading) {
        return (
            <DashboardLayout title={user?.name || "Doctor"} role="Doctor" menuItems={menuItems}>
                <div className="space-y-6 animate-pulse">
                    <div className="h-44 rounded-[2rem] border border-slate-200 bg-slate-100" />
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="h-32 rounded-2xl border border-slate-200 bg-slate-100" />
                        ))}
                    </div>
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
                <section className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_28px_90px_-55px_rgba(15,23,42,0.85)] sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-200/70">Doctor dashboard</p>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, {user?.name || "Doctor"}</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                        Review today&apos;s flow, approve new requests, and keep the appointment queue moving.
                    </p>
                </section>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {[
                        ["Today's Appointments", dashboard.todayAppointments, CalendarCheck2, "bg-blue-50 text-blue-600"],
                        ["Pending Requests", dashboard.pendingRequests, Clock3, "bg-amber-50 text-amber-600"],
                        ["Completed Today", dashboard.completedToday, CheckCircle2, "bg-emerald-50 text-emerald-600"],
                        ["Upcoming", dashboard.upcomingAppointments, ClipboardList, "bg-indigo-50 text-indigo-600"],
                    ].map(([label, value, Icon, tone]) => (
                        <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
                            <p className="mt-1 text-4xl font-semibold tracking-tight text-slate-950">{value}</p>
                        </div>
                    ))}
                </div>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Recent appointments</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Latest patient activity</h2>

                    {dashboard.recentAppointments.length === 0 ? (
                        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                            <UserRoundCheck className="mx-auto h-9 w-9 text-slate-400" />
                            <p className="mt-3 font-semibold text-slate-800">No appointments found.</p>
                            <p className="mt-1 text-sm text-slate-500">New and recent appointments will appear here.</p>
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-3">
                            {dashboard.recentAppointments.map((appointment) => (
                                <div key={appointment._id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h3 className="font-semibold text-slate-950">{appointment.patientId?.name}</h3>
                                            <p className="mt-1 text-sm text-slate-500">{appointment.reasonForVisit}</p>
                                        </div>
                                        <span className={`w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(appointment.status)}`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;
