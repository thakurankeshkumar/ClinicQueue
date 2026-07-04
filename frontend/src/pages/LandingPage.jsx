import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50">

            {/* Navbar */}
            <nav className="border-b bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <h1 className="text-2xl font-bold text-blue-600">ClinicQueue</h1>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex gap-6 text-slate-600">
                            <a href="#">Home</a>
                            <a href="#">Features</a>
                            <a href="#">About</a>
                        </div>
                        <div className="flex gap-3">
                            <Link to="/login" className="rounded-lg border border-blue-600 px-5 py-2 text-blue-600 transition hover:bg-blue-50">
                                Login
                            </Link>

                            <Link to="/register" className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700">
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}

            <section className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-16 px-6 py-24 lg:flex-row">
                <div className="max-w-xl">
                    <h1 className="text-5xl font-bold leading-tight text-slate-900">
                        Manage Clinic Appointments
                        <span className="block text-blue-600">Smarter & Faster</span>
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Book appointments, manage patient queues and simplify clinic
                        operations with a secure and modern healthcare management system.
                    </p>

                    <div className="mt-10 flex gap-4">
                        <Link to="/register" className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">
                            Get Started
                        </Link>

                        <button className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-100">
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Hero Illustration */}

                <div className="flex h-[420px] w-full max-w-lg items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
                    <p className="text-slate-500"> Healthcare Illustration</p>
                </div>
            </section>

            {/* Features Section */}

            <section className="bg-white py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-slate-900">Why Choose ClinicQueue?</h2>
                        <p className="mt-4 text-slate-600">Everything you need to manage clinic appointments efficiently.</p>
                    </div>

                    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-2xl border bg-slate-50 p-8 transition hover:-translate-y-1 hover:shadow-lg">
                            <h3 className="text-xl font-semibold">📅 Easy Appointment Booking</h3>
                            <p className="mt-3 text-slate-600">Patients can request appointments quickly with verified doctors.</p>
                        </div>

                        <div className="rounded-2xl border bg-slate-50 p-8 transition hover:-translate-y-1 hover:shadow-lg">
                            <h3 className="text-xl font-semibold">👨‍⚕️ Verified Doctors</h3>
                            <p className="mt-3 text-slate-600">Every doctor goes through an approval and profile verification process.</p>
                        </div>

                        <div className="rounded-2xl border bg-slate-50 p-8 transition hover:-translate-y-1 hover:shadow-lg">
                            <h3 className="text-xl font-semibold">⏱ Smart Queue Management</h3>
                            <p className="mt-3 text-slate-600">Organized appointment scheduling reduces waiting time.</p>
                        </div>

                        <div className="rounded-2xl border bg-slate-50 p-8 transition hover:-translate-y-1 hover:shadow-lg">
                            <h3 className="text-xl font-semibold">🔒 Secure Authentication</h3>
                            <p className="mt-3 text-slate-600">JWT-based authentication with secure role-based access.</p>
                        </div>

                        <div className="rounded-2xl border bg-slate-50 p-8 transition hover:-translate-y-1 hover:shadow-lg">
                            <h3 className="text-xl font-semibold">📊 Role-Based Dashboards</h3>
                            <p className="mt-3 text-slate-600">Separate dashboards for Patients, Doctors and Admins.</p>
                        </div>

                        <div className="rounded-2xl border bg-slate-50 p-8 transition hover:-translate-y-1 hover:shadow-lg">
                            <h3 className="text-xl font-semibold">📱 Fully Responsive</h3>
                            <p className="mt-3 text-slate-600">Works seamlessly across desktop, tablet and mobile devices.</p>
                        </div>
                    </div>
                </div>
            </section>


            {/* How It Works */}

            <section className="bg-slate-50 py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-slate-900">How It Works</h2>
                        <p className="mt-4 text-slate-600">Book your appointment in just a few simple steps.</p>
                    </div>

                    <div className="mt-16 grid gap-8 md:grid-cols-4">
                        <div className="text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">1</div>
                            <h3 className="mt-6 text-xl font-semibold">Find a Doctor</h3>
                            <p className="mt-2 text-slate-600">Browse verified doctors by specialization.</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">2</div>
                            <h3 className="mt-6 text-xl font-semibold">Book Appointment</h3>
                            <p className="mt-2 text-slate-600">Submit your appointment request.</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">3</div>
                            <h3 className="mt-6 text-xl font-semibold">Doctor Approval</h3>
                            <p className="mt-2 text-slate-600">The doctor schedules and confirms your visit.</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">4</div>
                            <h3 className="mt-6 text-xl font-semibold">Visit Clinic</h3>
                            <p className="mt-2 text-slate-600">Arrive on time and receive your consultation.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}

            <section className="bg-blue-600 py-24">
                <div className="mx-auto max-w-4xl px-6 text-center text-white">
                    <h2 className="text-4xl font-bold">Ready to Simplify Your Clinic Experience?</h2>
                    <p className="mt-6 text-lg text-blue-100">Join ClinicQueue today and experience faster, smarter appointment management.</p>
                    <Link to="/register" className="mt-10 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-slate-100">
                        Get Started
                    </Link>
                </div>
            </section>

            {/* Footer */}

            <footer className="bg-slate-900 py-8">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-slate-400 md:flex-row">
                    <h3 className="text-xl font-bold text-white">ClinicQueue</h3>
                    <p>© 2026 ClinicQueue. All rights reserved.</p>
                </div>
            </footer>

        </div>
    );
}

export default LandingPage;