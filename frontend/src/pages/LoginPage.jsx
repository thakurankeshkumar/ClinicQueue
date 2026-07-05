import { Link } from "react-router-dom";

function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-600">ClinicQueue</h1>
                    <h2 className="mt-6 text-2xl font-semibold text-slate-900">Welcome Back</h2>
                    <p className="mt-2 text-slate-600">Login to continue to your dashboard.</p>
                </div>

                <form className="mt-8 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                        <input type="email" placeholder="Enter your email"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <input type="password" placeholder="Enter your password"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600" />
                    </div>
                    <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">Login</button>
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