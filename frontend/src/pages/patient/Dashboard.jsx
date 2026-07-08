import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getPatientDashboard } from "../../api/patient";
import useAuth from "../../context/auth/useAuth";
import { CalendarCheck2, CheckCircle2, Clock3, Search, ShieldAlert } from "lucide-react";

function Dashboard() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        upcomingAppointments: 0,
        pendingAppointments: 0,
        completedAppointments: 0,
        rejectedAppointments: 0,
        recentAppointments: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const menuItems = [
        { label: "Dashboard", path: "/patient/dashboard" },
        { label: "Doctors", path: "/patient/doctors" },
        { label: "My Appointments", path: "/patient/appointments" },
        { label: "Logout", action: "logout" },
    ];

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await getPatientDashboard();
                setDashboardData(response.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load dashboard.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
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
            <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
                <div className="rounded-lg bg-red-100 p-4 text-red-700">{error}</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
            <div className="space-y-8">
                <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-[0_28px_90px_-55px_rgba(15,23,42,0.85)]">
                    <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-200/70">Patient dashboard</p>
                            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, {user?.name || "Patient"}</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                                Track appointments, follow approvals, and get back to the right doctor faster.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <p className="text-sm text-slate-300">Next step</p>
                            <p className="mt-2 text-2xl font-semibold">{dashboardData.pendingAppointments > 0 ? "Waiting for confirmation" : "Find a doctor"}</p>
                            <p className="mt-2 text-sm text-slate-400">{dashboardData.pendingAppointments} pending appointment request{dashboardData.pendingAppointments === 1 ? "" : "s"}</p>
                        </div>
                    </div>
                </section>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {[
                        ["Upcoming", dashboardData.upcomingAppointments, CalendarCheck2, "text-blue-600", "bg-blue-50"],
                        ["Pending", dashboardData.pendingAppointments, Clock3, "text-amber-600", "bg-amber-50"],
                        ["Completed", dashboardData.completedAppointments, CheckCircle2, "text-emerald-600", "bg-emerald-50"],
                        ["Rejected", dashboardData.rejectedAppointments, ShieldAlert, "text-rose-600", "bg-rose-50"],
                    ].map(([label, value, Icon, color, bg]) => (
                        <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} ${color}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
                            <p className="mt-1 text-4xl font-semibold tracking-tight text-slate-950">{value}</p>
                        </div>
                    ))}
                </div>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Recent activity</p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Latest appointments</h2>
                        </div>
                    </div>

                    {dashboardData.recentAppointments.length === 0 ? (
                        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                            <Search className="mx-auto h-8 w-8 text-slate-400" />
                            <p className="mt-3 font-semibold text-slate-800">No recent appointments found.</p>
                            <p className="mt-1 text-sm text-slate-500">Booked visits will appear here automatically.</p>
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-3">
                            {dashboardData.recentAppointments.map((appointment) => (
                                <div key={appointment._id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h3 className="font-semibold text-slate-950">{appointment.doctorId?.userId?.name}</h3>
                                            <p className="mt-1 text-sm text-slate-500">{appointment.reasonForVisit}</p>
                                        </div>
                                        <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                            appointment.status === "approved" ? "bg-emerald-50 text-emerald-700" : appointment.status === "pending"
                                                ? "bg-amber-50 text-amber-700" : appointment.status === "completed" ? "bg-blue-50 text-blue-700" : "bg-rose-50 text-rose-700"
                                        }`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout >
    );
}

export default Dashboard;
