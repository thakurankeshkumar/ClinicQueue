import { useState } from "react";
import { Link } from "react-router-dom";

function RegisterPage() {

    const [role, setRole] = useState("patient");
    const [gender, setGender] = useState("male");

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                {/* Logo */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-600">ClinicQueue</h1>
                    <h2 className="mt-6 text-2xl font-semibold text-slate-900">Create {role === "patient" ? "Patient" : "Doctor"} Account</h2>
                    <p className="mt-2 text-slate-600">Join ClinicQueue as a Patient or Doctor.</p>
                </div>
                {/* Role Toggle */}
                <div className="mt-8 flex rounded-xl bg-slate-100 p-1">
                    <button onClick={() => setRole("patient")} className={`flex-1 rounded-lg py-2 font-medium transition ${role === "patient"
                        ? "bg-blue-600 text-white shadow" : "text-slate-600"}`}>Patient</button>
                    <button onClick={() => setRole("doctor")} className={`flex-1 rounded-lg py-2 font-medium transition ${role === "doctor"
                        ? "bg-blue-600 text-white shadow" : "text-slate-600"}`}>Doctor</button>
                </div>

                {/* Form */}

                <form className="mt-8 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
                        <input type="text" placeholder="Enter your name"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600" />
                    </div>
                    {/* Email */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                        <input type="email" placeholder="Enter your email"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600" />
                    </div>
                    {/* Password */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                        <input type="password" placeholder="Enter your password"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600" />
                    </div>
                    {/* Gender */}

                    <div>
                        <label className="mb-3 block text-sm font-medium text-slate-700">Gender</label>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setGender("male")} className={`flex-1 rounded-xl border py-2 transition ${gender === "male"
                                ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"}`}>Male</button>

                            <button type="button" onClick={() => setGender("female")} className={`flex-1 rounded-xl border py-2 transition ${gender === "female"
                                ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"}`}>Female</button>

                            <button type="button" onClick={() => setGender("other")} className={`flex-1 rounded-xl border py-2 transition ${gender === "other"
                                ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"}`}>Other</button>
                        </div>
                    </div>
                    {/* Submit */}

                    <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">Create Account</button>
                </form>
                {/* Login */}

                <p className="mt-8 text-center text-slate-600">Already have an account?
                    <Link to="/login" className="ml-2 font-semibold text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;