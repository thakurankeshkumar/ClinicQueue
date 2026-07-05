import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth"
import useAuth from "../context/auth/useAuth";

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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-600">ClinicQueue</h1>
                    <h2 className="mt-6 text-2xl font-semibold text-slate-900">Welcome Back</h2>
                    <p className="mt-2 text-slate-600">Login to continue to your dashboard.</p>
                </div>

                {
                    error && (<div className="mt-5 rounded-lg bg-red-100 p-3 text-red-700">{error}</div>)
                }

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter your email"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Enter your password"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">{loading ? "Logging in..." : "Login"}</button>
                </form>

                <p className="mt-8 text-center text-slate-600">
                    Don't have an account?
                    <Link to="/register" className="ml-2 font-semibold text-blue-600 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;