import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerPatient, registerDoctor } from "../api/auth";
import FullScreenLoader from "../components/FullScreenLoader";
import {
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    Stethoscope,
    UserPlus,
    Users,
} from "lucide-react";

function RegisterPage() {

    const [role, setRole] = useState("patient");
    const [formData, setFormData] = useState({ name: "", email: "", password: "", gender: "male", });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value, }); };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (role === "patient") {
                await registerPatient(formData);
                setSuccess("Registration successful. Please login to continue.");
            } else {
                await registerDoctor(formData);
                setSuccess("Registration submitted successfully. Wait for admin approval before logging in.");
            }

            setTimeout(() => { navigate("/login"); }, 1500);

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
                    title="Creating your account"
                    subtitle="We are setting up your clinic profile and preparing the next step."
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
                                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">Create your account</p>
                                </div>
                            </Link>

                            <div className="mt-16 max-w-xl">
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Join the platform</p>
                                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-950">
                                    Create a role-based account with a clean, guided flow.
                                </h1>
                                <p className="mt-5 text-base leading-7 text-slate-600">
                                    Patients can book faster, doctors can request approval, and every step stays easy to understand.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-4 max-w-md">
                                {[
                                    [Users, "Flexible roles", "Choose patient or doctor with a simple toggle."],
                                    [ShieldCheck, "Secure onboarding", "Keep registration calm, clear, and trustworthy."],
                                ].map(([Icon, title, description]) => (
                                    <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
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

                        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_24px_70px_-45px_rgba(15,23,42,0.65)]">
                            <p className="text-sm font-medium text-slate-300">Simple approval flow</p>
                            <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4 ring-1 ring-white/10">
                                <div>
                                    <p className="text-sm text-slate-300">Doctor registration</p>
                                    <p className="mt-1 text-lg font-semibold">Review before access</p>
                                </div>
                                <div className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300">Pending</div>
                            </div>
                        </div>
                    </aside>

                    <main className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                        <div className="w-full max-w-xl rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.45)] sm:p-8 lg:p-10">
                            <div className="text-center">
                                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-600/20">
                                    <UserPlus className="h-6 w-6" />
                                </div>
                                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">Create {role === "patient" ? "Patient" : "Doctor"} Account</h2>
                                <p className="mt-3 text-sm leading-6 text-slate-600">Join ClinicQueue as a Patient or Doctor.</p>
                            </div>

                            <div className="mt-8 rounded-2xl bg-slate-100 p-1">
                                <div className="grid grid-cols-2 gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setRole("patient")}
                                        className={`rounded-xl py-2.5 text-sm font-semibold transition duration-200 ease-out ${role === "patient"
                                            ? "bg-white text-blue-700 shadow-sm"
                                            : "text-slate-600 hover:text-slate-900"}`}
                                    >
                                        Patient
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole("doctor")}
                                        className={`rounded-xl py-2.5 text-sm font-semibold transition duration-200 ease-out ${role === "doctor"
                                            ? "bg-white text-blue-700 shadow-sm"
                                            : "text-slate-600 hover:text-slate-900"}`}
                                    >
                                        Doctor
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                                        <span>{success}</span>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition duration-200 ease-out placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
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
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition duration-200 ease-out placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-3 block text-sm font-medium text-slate-700">Gender</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, gender: "male" })}
                                            className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition duration-200 ease-out ${formData.gender === "male"
                                                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"}`}
                                        >
                                            Male
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, gender: "female" })}
                                            className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition duration-200 ease-out ${formData.gender === "female"
                                                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"}`}
                                        >
                                            Female
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, gender: "other" })}
                                            className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition duration-200 ease-out ${formData.gender === "other"
                                                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"}`}
                                        >
                                            Other
                                        </button>
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-teal-500 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-200 ease-out hover:-translate-y-0.5 hover:from-blue-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transform-none"
                                >
                                    {loading ? "Creating Account..." : "Create Account"}
                                    {!loading && <ArrowRight className="h-4 w-4" />}
                                </button>
                            </form>

                            <p className="mt-8 text-center text-sm text-slate-600">
                                Already have an account?
                                <Link to="/login" className="ml-2 font-semibold text-blue-600 transition hover:text-blue-700 hover:underline">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;