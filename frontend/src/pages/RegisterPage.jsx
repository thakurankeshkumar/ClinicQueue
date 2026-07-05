import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerPatient, registerDoctor } from "../api/auth";

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

                {/* error message */}
                {
                    error && (<div className="mt-5 rounded-lg bg-red-100 p-3 text-red-700">{error}</div>)
                }

                {/* Success message */}
                {
                    success && (<div className="mt-5 rounded-lg bg-green-100 p-3 text-green-700">{success}</div>)
                }

                {/* Form */}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600" />
                    </div>
                    {/* Email */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600" />
                    </div>
                    {/* Password */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600" />
                    </div>
                    {/* Gender */}

                    <div>
                        <label className="mb-3 block text-sm font-medium text-slate-700">Gender</label>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setFormData({ ...formData, gender: "male", })} className={`flex-1 rounded-xl border py-2 transition ${formData.gender === "male"
                                ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"}`}>Male</button>

                            <button type="button" onClick={() => setFormData({ ...formData, gender: "female", })} className={`flex-1 rounded-xl border py-2 transition ${formData.gender === "female"
                                ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"}`}>Female</button>

                            <button type="button" onClick={() => setFormData({ ...formData, gender: "other", })} className={`flex-1 rounded-xl border py-2 transition ${formData.gender === "other"
                                ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"}`}>Other</button>
                        </div>
                    </div>
                    {/* Submit */}

                    <button disabled={loading} className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">{loading ? "Creating Account..." : "Create Account"}</button>
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