import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Activity,
    ArrowRight,
    CalendarClock,
    CheckCircle2,
    Clock3,
    ShieldCheck,
    Stethoscope,
    Users,
} from "lucide-react";

const features = [
    {
        icon: CalendarClock,
        title: "Fast appointment flow",
        description: "Let patients request visits quickly with a clean booking path and a queue-first experience.",
    },
    {
        icon: ShieldCheck,
        title: "Secure role-based access",
        description: "Keep patient, doctor, and admin areas clearly separated with trusted access controls.",
    },
    {
        icon: Activity,
        title: "Live operational visibility",
        description: "See activity, pending requests, and status changes in a dashboard built for clarity.",
    },
    {
        icon: Stethoscope,
        title: "Verified doctor profiles",
        description: "Present doctor credentials and specialties in a format that feels premium and dependable.",
    },
    {
        icon: Users,
        title: "Designed for teams",
        description: "Support patients, clinicians, and administrators with a consistent interface system.",
    },
    {
        icon: CheckCircle2,
        title: "Responsive by default",
        description: "Use a layout that adapts smoothly across desktop, tablet, and mobile screens.",
    },
];

const steps = [
    {
        number: "01",
        title: "Find a doctor",
        description: "Browse verified doctors by specialty and review their availability at a glance.",
    },
    {
        number: "02",
        title: "Request a slot",
        description: "Submit the appointment in a focused flow that reduces friction and unnecessary steps.",
    },
    {
        number: "03",
        title: "Confirm the visit",
        description: "Doctors approve requests and manage upcoming appointments from their dashboard.",
    },
    {
        number: "04",
        title: "Arrive prepared",
        description: "Patients reach the clinic with the status, timing, and next step already clear.",
    },
];

function LandingPage() {
    const [showIntro, setShowIntro] = useState(true);
    const [introLeaving, setIntroLeaving] = useState(false);

    useEffect(() => {
        const leaveTimer = window.setTimeout(() => {
            setIntroLeaving(true);
        }, 1550);

        const hideTimer = window.setTimeout(() => {
            setShowIntro(false);
        }, 2200);

        return () => {
            window.clearTimeout(leaveTimer);
            window.clearTimeout(hideTimer);
        };
    }, []);

    return (
        <div
            className="min-h-screen bg-[#F8FAFC] text-slate-900"
            style={{ fontFamily: "Inter, sans-serif" }}
        >
            {showIntro && (
                <div className={`fixed inset-0 z-[60] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(13,148,136,0.2),transparent_32%),linear-gradient(180deg,#0F172A_0%,#0B1220_100%)] text-white transition-all duration-700 ease-out ${introLeaving ? "opacity-0 scale-[1.03]" : "opacity-100 scale-100"}`}>
                    <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.06),transparent_28%,rgba(255,255,255,0.04)_46%,transparent_64%,rgba(255,255,255,0.05)_82%,transparent)] opacity-60" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_48%)]" />
                    <div className="absolute inset-x-0 top-1/2 h-px bg-[linear-gradient(90deg,transparent,rgba(125,211,252,0.8),rgba(45,212,191,0.9),transparent)] opacity-40 animate-[queue-scanline_2.4s_ease-in-out_infinite]" />
                    <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55 backdrop-blur-sm">
                        Queue flow initializing
                    </div>
                    <div className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55 backdrop-blur-sm">
                        Live sync active
                    </div>

                    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-10 px-6 text-center">
                        <div className="relative flex h-36 w-36 items-center justify-center">
                            <div className="absolute inset-0 rounded-full border border-white/10" />
                            <div className="absolute inset-4 rounded-full border border-white/20 animate-[queue-orbit_1.8s_linear_infinite]" />
                            <div className="absolute inset-8 rounded-full border border-teal-400/40 animate-[queue-orbit-reverse_2.2s_linear_infinite]" />
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-slate-950 shadow-[0_0_0_14px_rgba(255,255,255,0.06)] animate-[queue-pulse_1.8s_ease-in-out_infinite]">
                                <Stethoscope className="h-8 w-8 text-blue-600" />
                            </div>
                            <span className="absolute bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-emerald-400 shadow-[0_0_0_10px_rgba(52,211,153,0.12)] animate-pulse" />
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/60">ClinicQueue</p>
                            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                                Queue up. Move smooth.
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
                                A quick visual sync while your clinic experience loads into place.
                            </p>
                        </div>

                        <div className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.9)] backdrop-blur-md sm:p-6">
                            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                                <div className="text-left">
                                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/40">Live queue board</p>
                                    <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">Now serving clinic flow</h2>
                                </div>
                                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-100">
                                    Serving A-17
                                </div>
                            </div>

                            <div className="mt-5 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
                                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-4 text-left shadow-[0_18px_70px_-40px_rgba(15,23,42,0.9)]">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-white">Patient ticket flow</p>
                                            <p className="mt-1 text-xs text-white/60">From request to doctor approval</p>
                                        </div>
                                        <span className="rounded-full border border-blue-400/20 bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-100">Queue A-17</span>
                                    </div>

                                    <div className="mt-4 flex items-center gap-3 overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4">
                                        {[
                                            ["01", "Submitted"],
                                            ["02", "Queued"],
                                            ["03", "Doctor review"],
                                            ["04", "Dashboard ready"],
                                        ].map(([step, label], index) => (
                                            <div key={step} className="flex min-w-0 flex-1 items-center gap-3">
                                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${index === 0 ? "border-blue-300/40 bg-blue-400/15 text-blue-100" : index === 1 ? "border-teal-300/40 bg-teal-400/15 text-teal-100" : "border-white/10 bg-white/5 text-white/60"}`}>
                                                    {step}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-white">{label}</p>
                                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                                                        <div className="h-full w-1/2 rounded-full bg-linear-to-r from-white via-teal-300 to-blue-300 animate-[queue-progress_1.45s_ease-in-out_infinite]" style={{ animationDelay: `${index * 140}ms` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                        {[
                                            ["Patient", "Booked"],
                                            ["Doctor", "Reviewing"],
                                            ["Admin", "Synced"],
                                        ].map(([label, value], index) => (
                                            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left animate-[queue-card_1.9s_ease-in-out_infinite]" style={{ animationDelay: `${index * 180}ms` }}>
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">{label}</p>
                                                <p className="mt-2 text-sm font-semibold text-white">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    {[
                                        ["Appointment request", "Queued", "bg-blue-500/15 text-blue-100 border-blue-400/20"],
                                        ["Doctor approval", "Processing", "bg-teal-500/15 text-teal-100 border-teal-400/20"],
                                        ["Dashboard sync", "Ready", "bg-emerald-500/15 text-emerald-100 border-emerald-400/20"],
                                    ].map(([title, status, tone], index) => (
                                    <div
                                        key={title}
                                        className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 text-left shadow-[0_20px_80px_-40px_rgba(15,23,42,0.8)] backdrop-blur-sm animate-[queue-card_1.8s_ease-in-out_infinite] transition-transform duration-300 ease-out hover:-translate-y-0.5"
                                        style={{ animationDelay: `${index * 220}ms` }}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-white">{title}</p>
                                                <p className="mt-1 text-xs text-white/60">Syncing clinic flow</p>
                                            </div>
                                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>{status}</span>
                                        </div>
                                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                                            <div className="h-full w-1/2 rounded-full bg-linear-to-r from-white via-teal-300 to-blue-300 animate-[queue-progress_1.35s_ease-in-out_infinite]" />
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-2 text-white/60">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-400 animate-pulse" />
                        <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse [animation-delay:120ms]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse [animation-delay:240ms]" />
                    </div>
                </div>
            )}

            <div className="relative isolate overflow-hidden">
                <div className="absolute inset-x-0 top-0 -z-10 h-168 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_35%),radial-gradient(circle_at_top_right,rgba(13,148,136,0.18),transparent_28%),linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_45%,#F8FAFC_100%)]" />
                <div className="absolute -left-40 top-24 -z-10 h-72 w-72 rounded-full bg-blue-500/8 blur-2xl" />
                <div className="absolute -right-40 top-40 -z-10 h-72 w-72 rounded-full bg-teal-500/8 blur-2xl" />

                <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/95">
                    <div className="mx-auto flex max-w-360 flex-col gap-4 px-6 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
                        <Link to="/" className="inline-flex items-center gap-3 self-start">
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-600/20">
                                <Stethoscope className="h-5 w-5" />
                            </span>
                            <span>
                                <span className="block text-lg font-semibold tracking-tight text-slate-900">ClinicQueue</span>
                                <span className="block text-xs font-medium uppercase tracking-[0.24em] text-slate-500">Healthcare management</span>
                            </span>
                        </Link>

                        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
                            <a className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900" href="#features">Features</a>
                            <a className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900" href="#workflow">Workflow</a>
                            <a className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900" href="#contact">Contact</a>
                        </div>

                        <div className="flex items-center gap-3 self-start sm:self-auto">
                            <Link
                                to="/login"
                                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-blue-700"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </header>

                <main>
                    <section className="mx-auto grid max-w-360 gap-16 px-6 py-16 sm:px-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:px-10 lg:py-24">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5">
                                <span className="h-2 w-2 rounded-full bg-teal-500" />
                                Production-ready clinic operations
                            </div>

                            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                                A premium clinic queue system built for speed, trust, and clarity.
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                                ClinicQueue helps patients book appointments, doctors manage schedules, and admins keep the platform organized with a calm, modern healthcare dashboard experience.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/register"
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-slate-800 motion-reduce:transform-none"
                                >
                                    Get started
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <a
                                    href="#features"
                                    className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 motion-reduce:transform-none"
                                >
                                    Explore features
                                </a>
                            </div>

                            <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <CalendarClock className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-2xl font-semibold tracking-tight">24/7</p>
                                            <p className="text-sm text-slate-500">Booking access</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                                            <Clock3 className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-2xl font-semibold tracking-tight">Less wait</p>
                                            <p className="text-sm text-slate-500">Queue visibility</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                            <ShieldCheck className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-2xl font-semibold tracking-tight">Secure</p>
                                            <p className="text-sm text-slate-500">Role-based access</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-6 rounded-4xl bg-linear-to-br from-blue-600/10 via-white to-teal-500/10 blur-xl" />
                            <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_70px_-40px_rgba(15,23,42,0.28)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_30px_90px_-42px_rgba(15,23,42,0.32)]">
                                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Today’s clinic overview</p>
                                        <p className="text-xs text-slate-500">A calm dashboard view for day-to-day operations</p>
                                    </div>
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        Live
                                    </span>
                                </div>

                                <div className="grid gap-4 p-5 sm:grid-cols-2">
                                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/80 transition duration-200 ease-out hover:bg-white hover:shadow-sm motion-reduce:transform-none">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-slate-600">Appointments today</p>
                                            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">+12%</span>
                                        </div>
                                        <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">128</p>
                                        <div className="mt-4 h-2 rounded-full bg-slate-200">
                                            <div className="h-2 w-[72%] rounded-full bg-linear-to-r from-blue-600 to-teal-500" />
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/80 transition duration-200 ease-out hover:bg-white hover:shadow-sm motion-reduce:transform-none">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-slate-600">Pending approvals</p>
                                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">5 urgent</span>
                                        </div>
                                        <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">24</p>
                                        <div className="mt-4 flex items-end gap-2">
                                            <span className="h-10 w-3 rounded-full bg-blue-200" />
                                            <span className="h-16 w-3 rounded-full bg-teal-300" />
                                            <span className="h-12 w-3 rounded-full bg-blue-400" />
                                            <span className="h-20 w-3 rounded-full bg-teal-500" />
                                            <span className="h-14 w-3 rounded-full bg-blue-600" />
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 ease-out hover:shadow-md sm:col-span-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">Upcoming flow</p>
                                                <p className="text-xs text-slate-500">Clean step-by-step queue movement</p>
                                            </div>
                                            <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-600 to-teal-500" />
                                        </div>

                                        <div className="mt-4 space-y-3">
                                            {[
                                                ["10:00 AM", "Dr. Ahmed", "Confirmed"],
                                                ["10:30 AM", "Dr. Sara", "Waiting"],
                                                ["11:00 AM", "Dr. Noor", "Approved"],
                                            ].map(([time, doctor, status]) => (
                                                <div key={time} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                                                    <div>
                                                        <p className="font-medium text-slate-900">{doctor}</p>
                                                        <p className="text-slate-500">{time}</p>
                                                    </div>
                                                    <span className="rounded-full bg-white px-3 py-1 font-medium text-slate-700 ring-1 ring-slate-200">{status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="features" className="mx-auto max-w-360 px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Why ClinicQueue</p>
                            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                                A cleaner interface for every role in the clinic.
                            </h2>
                            <p className="mt-4 text-base leading-7 text-slate-600">
                                The landing experience mirrors a modern healthcare SaaS product: simple, credible, and designed around clear next actions.
                            </p>
                        </div>

                        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {features.map(({ icon: Icon, title, description }) => (
                                <article key={title} className="group rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-md hover:shadow-slate-900/5 motion-reduce:transform-none">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-md shadow-slate-900/10 transition group-hover:bg-blue-600">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-5 text-lg font-semibold text-slate-950">{title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section id="workflow" className="mx-auto grid max-w-360 gap-8 px-6 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-16">
                        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">How it works</p>
                            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                                A simple appointment journey, presented with less noise.
                            </h2>
                            <div className="mt-8 space-y-5">
                                {steps.map(({ number, title, description }) => (
                                    <div key={number} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-blue-700 ring-1 ring-slate-200">
                                            {number}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-950">{title}</h3>
                                            <p className="mt-1 text-sm leading-7 text-slate-600">{description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[1.75rem] bg-[linear-gradient(180deg,#0F172A_0%,#111827_100%)] p-6 text-white shadow-[0_28px_80px_-52px_rgba(15,23,42,0.72)] sm:p-8">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 ring-1 ring-white/10">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                Built for operational confidence
                            </div>

                            <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                                Everything feels more controlled when the interface is calm.
                            </h2>
                            <p className="mt-4 text-base leading-7 text-slate-300">
                                The same application logic remains intact, while the presentation becomes clearer, more premium, and easier to trust across every user role.
                            </p>

                            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                {[
                                    ["Role ready", "Patient, doctor, admin"],
                                    ["Fast flows", "Less friction in booking"],
                                    ["Responsive", "Mobile and desktop"],
                                ].map(([label, value]) => (
                                    <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                        <p className="text-sm text-slate-300">{label}</p>
                                        <p className="mt-2 text-lg font-semibold text-white">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="contact" className="mx-auto max-w-360 px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
                        <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow duration-300 ease-out sm:p-10 lg:flex lg:items-end lg:justify-between">
                            <div className="max-w-2xl">
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Get started</p>
                                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                                    Bring a production-ready healthcare dashboard to your clinic.
                                </h2>
                                <p className="mt-4 text-base leading-7 text-slate-600">
                                    Register now to explore the patient, doctor, and admin experiences with the new design system.
                                </p>
                            </div>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
                                <Link
                                    to="/login"
                                    className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-slate-700 transition duration-200 ease-out hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 motion-reduce:transform-none"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-teal-500 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-200 ease-out hover:-translate-y-0.5 hover:from-blue-700 hover:to-teal-600 motion-reduce:transform-none"
                                >
                                    Create account
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-slate-200 bg-white/70">
                    <div className="mx-auto flex max-w-360 flex-col gap-3 px-6 py-6 text-sm text-slate-500 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
                        <p className="font-semibold text-slate-900">ClinicQueue</p>
                        <p>Modern healthcare scheduling, designed for clarity and trust.</p>
                        <p>© 2026 ClinicQueue. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default LandingPage;