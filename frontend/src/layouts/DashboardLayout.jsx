import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";
import useAuth from "../context/auth/useAuth";

function DashboardLayout({ title, role, menuItems, children }) {

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleLogout = async () => {
        console.log("Logout clicked");
        try {
            await logoutUser();
            console.log("Logout API success");
            setUser(null);
            console.log("User cleared");
            navigate("/", { replace: true });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Navbar */}

            <header className="flex h-16 items-center justify-between border-b bg-white px-8">
                <h1 className="text-2xl font-bold text-blue-600">ClinicQueue</h1>
                <div className="text-right">
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-slate-500 capitalize">{role}</p>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 border-r bg-white min-h-[calc(100vh-64px)]">
                    <nav className="p-5 space-y-2">
                        {menuItems.map((item) => (
                            item.action === "logout" ? (
                                <button key={item.label} onClick={handleLogout}
                                    className="block w-full rounded-lg px-4 py-3 text-left text-slate-700 transition hover:bg-red-50 hover:text-red-600">
                                    {item.label}
                                </button>
                            ) : (
                                <Link key={item.path} to={item.path}
                                    className="block rounded-lg px-4 py-3 text-slate-700 transition hover:bg-blue-50 hover:text-blue-600">
                                    {item.label}
                                </Link>
                            )
                        ))}
                    </nav>
                </aside>

                {/* Main */}

                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
}

export default DashboardLayout;