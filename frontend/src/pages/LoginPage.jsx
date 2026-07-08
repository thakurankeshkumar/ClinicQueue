import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth"
import useAuth from "../context/auth/useAuth";
import FullScreenLoader from "../components/FullScreenLoader";
import {
    ArrowRight,
    CalendarClock,
    LogIn,
    ShieldCheck,
    Stethoscope,
} from "lucide-react";

function LoginPage() {

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // Login User 
            const response = await loginUser(formData);
            // Get User Profile data 
            const user = response.data.user;
            // Save user globally
            setUser(user);

            const dashboardRoutes = {
                patient: "/patient/dashboard",
                doctor: "/doctor/dashboard",
                admin: "/admin/dashboard",
            };

            navigate(dashboardRoutes[user.role] || "/login");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900" style={{ fontFamily: "Inter, sans-serif" }}>
            {loading && (
                <FullScreenLoader
                    title="Logging you in"
                    subtitle="One quick moment while we secure your session and prepare the right dashboard."
                />
            )}
            <div className="relative isolate overflow-hidden">
                <div className="absolute inset-x-0 top-0 -z-10 h-168 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_35%),radial-gradient(circle_at_top_right,rgba(13,148,136,0.12),transparent_30%),linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_55%,#F8FAFC_100%)]" />
                <div className="absolute -left-40 top-24 -z-10 h-72 w-72 rounded-full bg-blue-500/8 blur-2xl" />
                <div className="absolute -right-40 bottom-10 -z-10 h-72 w-72 rounded-full bg-teal-500/8 blur-2xl" />

                <div className="mx-auto grid min-h-screen max-w-360 lg:grid-cols-[0.95fr_1.05fr]">
                    <aside className="hidden border-r border-slate-200/80 bg-white/70 px-10 py-12 backdrop-blur xl:flex xl:flex-col xl:justify-between">
                        <div>
                            <Link to="/" className="inline-flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-600/20">
                                    <Stethoscope className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-lg font-semibold tracking-tight text-slate-950">ClinicQueue</p>
                                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">Secure clinic access</p>
                                </div>
                            </Link>

                            <div className="mt-16 max-w-xl">
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Welcome back</p>
                                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-950">
                                    Sign in to a calmer, cleaner clinic workflow.
                                </h1>
                                <p className="mt-5 text-base leading-7 text-slate-600">
                                    Access your dashboard, manage appointments, and continue from a focused interface designed for healthcare operations.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-4 max-w-md">
                                {[
                                    [CalendarClock, "Fast access", "Return to your role dashboard in just a few seconds."],
                                    [ShieldCheck, "Trusted login", "Protected access for patients, doctors, and admins."],
                                ].map(([Icon, title, description]) => (
                                    <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                <Icon className="h-5 w-5" />
                                            </span>
                                            <div>
                                                <p className="font-semibold text-slate-950">{title}</p>
                                                <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_24px_70px_-45px_rgba(15,23,42,0.65)]">
                            <p className="text-sm font-medium text-slate-300">Designed for reliability</p>
                            <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4 ring-1 ring-white/10">
                                <div>
                                    <p className="text-sm text-slate-300">Queue status</p>
                                    <p className="mt-1 text-lg font-semibold">Stable and responsive</p>
                                </div>
                                <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">Ready</div>
                            </div>
                        </div>
                    </aside>

                    <main className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                        <div className="w-full max-w-xl rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.45)] sm:p-8 lg:p-10 xl:hidden">
                            <div className="text-center">
                                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-600/20">
                                    <LogIn className="h-6 w-6" />
                                </div>
                                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">Welcome back</h2>
                                <p className="mt-3 text-sm leading-6 text-slate-600">Login to continue to your dashboard.</p>
                            </div>

                            {error && (
                                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Enter your email"
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition duration-200 ease-out placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Enter your password"
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition duration-200 ease-out placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-teal-500 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-200 ease-out hover:-translate-y-0.5 hover:from-blue-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transform-none"
                                >
                                    {loading ? "Opening dashboard..." : "Login"}
                                    {!loading && <ArrowRight className="h-4 w-4" />}
                                </button>
                            </form>

                            <p className="mt-8 text-center text-sm text-slate-600">
                                Don't have an account?
                                <Link to="/register" className="ml-2 font-semibold text-blue-600 transition hover:text-blue-700 hover:underline">
                                    Register
                                </Link>
                            </p>
                        </div>

                        <div className="hidden w-full max-w-xl rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.45)] sm:p-8 lg:p-10 xl:block">
                            <div className="text-center">
                                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-600/20">
                                    <LogIn className="h-6 w-6" />
                                </div>
                                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">Welcome back</h2>
                                <p className="mt-3 text-sm leading-6 text-slate-600">Login to continue to your dashboard.</p>
                            </div>

                            {error && (
                                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Enter your email"
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition duration-200 ease-out placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Enter your password"
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition duration-200 ease-out placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-teal-500 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-200 ease-out hover:-translate-y-0.5 hover:from-blue-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transform-none"
                                >
                                    {loading ? "Opening dashboard..." : "Login"}
                                    {!loading && <ArrowRight className="h-4 w-4" />}
                                </button>
                            </form>

                            <p className="mt-8 text-center text-sm text-slate-600">
                                Don't have an account?
                                <Link to="/register" className="ml-2 font-semibold text-blue-600 transition hover:text-blue-700 hover:underline">
                                    Register
                                </Link>
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;