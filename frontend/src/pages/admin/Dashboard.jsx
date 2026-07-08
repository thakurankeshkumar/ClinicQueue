import { useEffect, useState } from "react";
import useAuth from "../../context/auth/useAuth";
import { getAdminDashboard } from "../../api/admin";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Activity, ArrowUpRight, CalendarClock, CheckCircle2, Stethoscope, Users } from "lucide-react";

const getStatTone = (label) => {
    if (label.includes("Doctors")) return "from-blue-500/15 to-blue-500/5 text-blue-700";
    if (label.includes("Patients")) return "from-teal-500/15 to-teal-500/5 text-teal-700";
    if (label.includes("Pending")) return "from-amber-500/15 to-amber-500/5 text-amber-700";
    if (label.includes("Profile")) return "from-indigo-500/15 to-indigo-500/5 text-indigo-700";
    if (label.includes("Completed")) return "from-emerald-500/15 to-emerald-500/5 text-emerald-700";
    return "from-slate-500/15 to-slate-500/5 text-slate-700";
};

function Dashboard() {

    const menuItems = [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Pending Doctors", path: "/admin/doctors" },
        { label: "Profile Requests", path: "/admin/profile-requests" },
        { label: "Logout", action: "logout" },
    ];

    const { user } = useAuth();

    const [dashboard, setDashboard] = useState({
        totalDoctors: 0, totalPatients: 0,
        pendingDoctors: 0, pendingProfileRequests: 0,
        todayAppointments: 0, completedAppointmentsToday: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const stats = [
        {
            label: "Total Doctors",
            value: dashboard.totalDoctors,
            icon: Stethoscope,
            hint: "Registered clinicians",
        },
        {
            label: "Total Patients",
            value: dashboard.totalPatients,
            icon: Users,
            hint: "Active patient base",
        },
        {
            label: "Pending Doctors",
            value: dashboard.pendingDoctors,
            icon: Activity,
            hint: "Waiting for review",
        },
        {
            label: "Profile Requests",
            value: dashboard.pendingProfileRequests,
            icon: CalendarClock,
            hint: "Profile updates in queue",
        },
        {
            label: "Today’s Appointments",
            value: dashboard.todayAppointments,
            icon: CheckCircle2,
            hint: "Clinic activity today",
        },
        {
            label: "Completed Today",
            value: dashboard.completedAppointmentsToday,
            icon: ArrowUpRight,
            hint: "Successfully finished",
        },
    ];

    const completionRate = dashboard.todayAppointments > 0
        ? Math.round((dashboard.completedAppointmentsToday / dashboard.todayAppointments) * 100)
        : 0;

    const pendingWorkload = dashboard.pendingDoctors + dashboard.pendingProfileRequests;

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await getAdminDashboard();
                setDashboard({
                    totalDoctors: response.data.totalDoctors,
                    totalPatients: response.data.totalPatients,
                    pendingDoctors: response.data.pendingDoctors,
                    pendingProfileRequests: response.data.pendingProfileRequests,
                    todayAppointments: response.data.todayAppointments,
                    completedAppointmentsToday: response.data.completedAppointmentsToday,
                });
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
            <DashboardLayout title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>
                <div className="space-y-6 animate-[admin-fade_240ms_ease-out]">
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" />
                            <div className="mt-4 h-8 w-72 animate-pulse rounded-full bg-slate-200" />
                            <div className="mt-3 h-4 w-[80%] animate-pulse rounded-full bg-slate-200" />
                        </div>
                        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="h-4 w-36 animate-pulse rounded-full bg-slate-200" />
                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="h-36 animate-pulse rounded-[1.5rem] border border-slate-200 bg-white shadow-sm" />
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>
                <div className="rounded-lg bg-red-100 p-4 text-red-700">
                    {error}
                </div>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>
            <div className="space-y-8 animate-[admin-fade_260ms_ease-out]">
                <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(17,24,39,0.94))] p-6 text-white shadow-[0_30px_100px_-55px_rgba(15,23,42,0.8)] sm:p-8">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Operations center</span>
                            <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-teal-100">Live overview</span>
                        </div>
                        <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, {user?.name || "Administrator"}.</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                            Monitor approvals, track clinic activity, and keep the clinic flow moving from a calmer, more readable command panel.
                        </p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            {[
                                ["Pending workload", pendingWorkload, "Items waiting"],
                                ["Completion rate", `${completionRate}%`, "Appointments completed"],
                                ["Live direction", dashboard.todayAppointments > dashboard.completedAppointmentsToday ? "In progress" : "Stable", "Today’s clinic pace"],
                            ].map(([label, value, hint]) => (
                                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                    <p className="text-xs uppercase tracking-[0.22em] text-white/45">{label}</p>
                                    <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
                                    <p className="mt-1 text-sm text-white/60">{hint}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Clinic snapshot</p>
                                <h3 className="mt-2 text-xl font-semibold text-slate-950">Queue pressure</h3>
                            </div>
                            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                Stable
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                                    <span>Doctors awaiting approval</span>
                                    <span>{dashboard.pendingDoctors}</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100">
                                    <div className="h-2 w-[72%] rounded-full bg-linear-to-r from-amber-500 to-orange-400" />
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                                    <span>Profile requests</span>
                                    <span>{dashboard.pendingProfileRequests}</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100">
                                    <div className="h-2 w-[54%] rounded-full bg-linear-to-r from-blue-600 to-teal-500" />
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                                    <span>Completed appointments today</span>
                                    <span>{completionRate}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100">
                                    <div className="h-2 w-[84%] rounded-full bg-linear-to-r from-emerald-500 to-teal-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Admin metrics</p>
                            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">A cleaner view of clinic operations.</h3>
                        </div>
                        <p className="hidden max-w-md text-sm leading-6 text-slate-500 md:block">
                            Each card is designed as a quick-read summary so the admin can scan status without opening deeper pages.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {stats.map(({ label, value, icon: Icon, hint }) => (
                            <article
                                key={label}
                                className={`group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-gradient-to-br p-5 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_24px_80px_-40px_rgba(15,23,42,0.28)] ${getStatTone(label)}`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-slate-950 shadow-sm ring-1 ring-slate-200/70 transition group-hover:scale-105">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200/70">
                                        Live
                                    </span>
                                </div>
                                <p className="mt-5 text-sm font-medium text-slate-600">{label}</p>
                                <div className="mt-2 flex items-end justify-between gap-4">
                                    <p className="text-4xl font-semibold tracking-tight text-slate-950">{value}</p>
                                    <div className="mb-2 h-2 w-16 rounded-full bg-white/70">
                                        <div className="h-2 w-10 rounded-full bg-slate-900/40 transition duration-300 group-hover:w-14" />
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-slate-600">{hint}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Working rhythm</p>
                                <h3 className="mt-2 text-xl font-semibold text-slate-950">Today’s operational load</h3>
                            </div>
                            <div className="rounded-2xl bg-slate-50 px-4 py-2 text-right">
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Completed</p>
                                <p className="text-lg font-semibold text-slate-950">{dashboard.completedAppointmentsToday}</p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                                ["Doctors", dashboard.totalDoctors, "From onboarding to approval", "blue"],
                                ["Patients", dashboard.totalPatients, "Growing clinic base", "teal"],
                                ["Pending", pendingWorkload, "Needs attention", "amber"],
                                ["Appointments", dashboard.todayAppointments, "Today’s flow", "emerald"],
                            ].map(([label, value, hint, color]) => (
                                <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-white">
                                    <p className="text-sm font-medium text-slate-500">{label}</p>
                                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
                                    <p className={`mt-2 text-sm ${color === "amber" ? "text-amber-700" : color === "teal" ? "text-teal-700" : color === "emerald" ? "text-emerald-700" : "text-blue-700"}`}>
                                        {hint}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#0F172A_0%,#111827_100%)] p-6 text-white shadow-[0_30px_100px_-55px_rgba(15,23,42,0.8)] sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">Action focus</p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight">What needs your attention now?</h3>
                        <div className="mt-6 space-y-4">
                            {[
                                ["Pending doctor approvals", dashboard.pendingDoctors, "Review queue stability", "from-amber-500 to-orange-400"],
                                ["Profile requests waiting", dashboard.pendingProfileRequests, "Approve clinic profile changes", "from-blue-600 to-teal-500"],
                                ["Appointments completed", dashboard.completedAppointmentsToday, "Track clinic throughput", "from-emerald-500 to-teal-500"],
                            ].map(([label, value, hint, gradient]) => (
                                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-white">{label}</p>
                                            <p className="mt-1 text-sm text-white/60">{hint}</p>
                                        </div>
                                        <div className={`rounded-full bg-gradient-to-r ${gradient} px-3 py-1 text-sm font-semibold text-white shadow-sm`}>
                                            {value}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;