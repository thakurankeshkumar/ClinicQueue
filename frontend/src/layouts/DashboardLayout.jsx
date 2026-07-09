import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";
import useAuth from "../context/auth/useAuth";
import { ArrowRight, CheckCircle2, Clock3, LogOut, Menu, ShieldCheck, Stethoscope, X } from "lucide-react";

function DashboardLayout({ title, role, menuItems, children }) {

    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const activeItem = useMemo(() => {
        return menuItems.find((item) => item.path && location.pathname.startsWith(item.path));
    }, [location.pathname, menuItems]);

    const openLogoutDialog = () => {
        setMobileMenuOpen(false);
        setLogoutDialogOpen(true);
    };

    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            await logoutUser();
            setUser(null);
            navigate("/", { replace: true });
        } catch (err) {
            console.error(err);
        } finally {
            setLogoutLoading(false);
            setLogoutDialogOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(13,148,136,0.1),transparent_22%),linear-gradient(180deg,#F8FAFC_0%,#F8FAFC_100%)] text-slate-900">
            <div className="mx-auto flex min-h-screen max-w-[1760px] flex-col px-2.5 py-2.5 sm:px-4 lg:px-5 lg:py-5">
                <header className="sticky top-3 z-30 rounded-3xl border border-slate-200 bg-white/92 px-4 py-3 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:px-5 lg:px-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(true)}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 lg:hidden"
                                aria-label="Open navigation"
                            >
                                <Menu className="h-5 w-5" />
                            </button>

                            <Link to="/" className="inline-flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-600/20">
                                    <Stethoscope className="h-5 w-5" />
                                </span>
                                <div className="hidden sm:block">
                                    <p className="text-lg font-semibold tracking-tight text-slate-950">ClinicQueue</p>
                                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Healthcare dashboard</p>
                                </div>
                            </Link>
                        </div>

                        <div className="flex min-w-0 flex-1 items-center justify-center px-2">
                            <div className="hidden min-w-0 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 sm:flex">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" />
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-950">{title}</p>
                                    <p className="truncate text-xs text-slate-500 capitalize">{role} workspace</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mt-3 grid flex-1 gap-3 lg:grid-cols-[312px_minmax(0,1fr)] lg:gap-4">
                    <aside className="hidden self-start rounded-[1.75rem] border border-slate-200 bg-white/92 p-4 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.24)] backdrop-blur-xl lg:sticky lg:top-28 lg:flex lg:max-h-[calc(100vh-8rem)] lg:flex-col">
                        <div className="rounded-3xl bg-[linear-gradient(180deg,#0F172A_0%,#111827_100%)] p-5 text-white shadow-[0_20px_80px_-50px_rgba(15,23,42,0.7)]">
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/45">Active workspace</p>
                            <div className="mt-4 flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-2xl font-semibold tracking-tight">{title}</p>
                                    <p className="mt-1 text-sm text-white/65 capitalize">{role} dashboard</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                                    <ArrowRight className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="mt-5 grid gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                                <div className="flex items-center gap-2">
                                    <Clock3 className="h-4 w-4 text-teal-300" />
                                    <span>{activeItem ? `Currently on ${activeItem.label}` : "Ready for your next action"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                                    <span>Secure, role-based workspace</span>
                                </div>
                            </div>
                        </div>

                        <nav className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
                            {menuItems.map((item) => {
                                const isActive = item.path ? location.pathname === item.path || location.pathname.startsWith(`${item.path}/`) : false;

                                if (item.action === "logout") {
                                    return (
	                                        <button
	                                            key={item.label}
	                                            onClick={openLogoutDialog}
	                                            className="group flex w-full items-center justify-between rounded-2xl border border-transparent px-4 py-3.5 text-left text-slate-700 transition duration-200 ease-out hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
	                                        >
                                            <span className="font-medium">{item.label}</span>
                                            <LogOut className="h-4 w-4 opacity-70 transition group-hover:opacity-100" />
                                        </button>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`group flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium transition duration-200 ease-out ${
                                            isActive
                                                ? "bg-[linear-gradient(90deg,rgba(37,99,235,0.12),rgba(13,148,136,0.08))] text-slate-950 shadow-sm ring-1 ring-blue-200"
                                                : "text-slate-600 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-950"
                                        }`}
                                    >
                                        <span>{item.label}</span>
                                        {isActive && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    <main className="min-w-0 rounded-[1.75rem] border border-slate-200 bg-white/92 p-4 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.24)] backdrop-blur-xl sm:p-6 lg:p-8">
                        <div className="mb-4 flex items-center justify-between gap-4 lg:hidden">
                            <div className="min-w-0">
                                <p className="truncate text-lg font-semibold text-slate-950">{title}</p>
                                <p className="truncate text-sm text-slate-500 capitalize">{role} workspace</p>
                            </div>
                            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                {activeItem ? activeItem.label : "Dashboard"}
                            </div>
                        </div>

                        {children}
                    </main>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
                    <aside
                        className="absolute left-0 top-0 h-full w-[86%] max-w-sm border-r border-slate-200 bg-white p-4 shadow-[0_30px_100px_-45px_rgba(15,23,42,0.6)] animate-[dashboard-drawer_220ms_ease-out]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between rounded-[1.25rem] bg-slate-50 px-4 py-3">
                            <div>
                                <p className="text-base font-semibold text-slate-950">ClinicQueue</p>
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Navigation</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
                                aria-label="Close navigation"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <nav className="mt-4 space-y-2">
                            {menuItems.map((item) => {
                                const isActive = item.path ? location.pathname === item.path || location.pathname.startsWith(`${item.path}/`) : false;

                                if (item.action === "logout") {
                                    return (
	                                        <button
	                                            key={item.label}
	                                            onClick={openLogoutDialog}
	                                            className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-slate-700 transition hover:bg-red-50 hover:text-red-600"
	                                        >
                                            <span className="font-medium">{item.label}</span>
                                            <LogOut className="h-4 w-4" />
                                        </button>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center justify-between rounded-2xl px-4 py-3.5 font-medium transition ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"}`}
                                    >
                                        <span>{item.label}</span>
                                        {isActive && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>
                </div>
            )}

            {logoutDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
                    <div
                        className="absolute inset-0"
                        onClick={() => !logoutLoading && setLogoutDialogOpen(false)}
                    />
                    <div className="relative w-full max-w-md overflow-hidden rounded-4xl border border-white/15 bg-white p-6 shadow-[0_30px_120px_-48px_rgba(15,23,42,0.65)] animate-[dashboard-pop_220ms_ease-out] sm:p-8">
                        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-600 via-teal-500 to-emerald-500" />
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                                <LogOut className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Confirm logout</p>
                                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Leave this dashboard?</h3>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    You’ll be signed out and returned to the landing page. Any current view stays intact until you confirm.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center gap-3 text-sm text-slate-700">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span>Safe, quick, and reversible until confirmed</span>
                            </div>
                        </div>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setLogoutDialogOpen(false)}
                                disabled={logoutLoading}
                                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition duration-200 ease-out hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={logoutLoading}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-red-600 to-rose-500 px-5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition duration-200 ease-out hover:-translate-y-0.5 hover:from-red-700 hover:to-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {logoutLoading ? "Signing out..." : "Confirm logout"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardLayout;
