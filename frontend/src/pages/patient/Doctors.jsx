import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getDoctors } from "../../api/patient";
import useAuth from "../../context/auth/useAuth";
import { ArrowRight, BadgeCheck, BadgeIndianRupee, BriefcaseMedical, CalendarDays, Search, Stethoscope } from "lucide-react";

function Doctors() {

    const { user } = useAuth();

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const menuItems = [
        { label: "Dashboard", path: "/patient/dashboard" },
        { label: "Doctors", path: "/patient/doctors" },
        { label: "My Appointments", path: "/patient/appointments" },
        { label: "Logout", action: "logout" },
    ];

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await getDoctors();
                setDoctors(response.data.doctors);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load doctors.");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const filteredDoctors = useMemo(() => doctors.filter((doctor) => {
        const name = doctor.userId?.name || "";
        const specialization = doctor.specialization || "";
        return (
            name.toLowerCase().includes(search.toLowerCase()) || specialization.toLowerCase().includes(search.toLowerCase())
        );
    }), [doctors, search]);

    if (loading) {
        return (
            <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
                <div className="space-y-6 animate-pulse">
                    <div className="h-40 rounded-[2rem] border border-slate-200 bg-slate-100" />
                    <div className="grid gap-5 lg:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="h-56 rounded-2xl border border-slate-200 bg-slate-100" />
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
                <div className="rounded-lg bg-red-100 p-4 text-red-700">{error}</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
            <div className="space-y-8">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Doctor directory</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Available Doctors</h1>
                            <p className="mt-3 max-w-2xl text-slate-600">Browse verified doctors and book the appointment that fits your care needs.</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                            <p className="text-sm text-slate-500">Showing</p>
                            <p className="text-2xl font-semibold text-slate-950">{filteredDoctors.length} of {doctors.length}</p>
                        </div>
                    </div>

                    <div className="relative mt-6">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by doctor name or specialization"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                    </div>
                </section>

                {filteredDoctors.length === 0 ? (
                    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                        <Stethoscope className="mx-auto h-10 w-10 text-slate-400" />
                        <h2 className="mt-4 text-xl font-semibold text-slate-950">No Doctors Found</h2>
                        <p className="mt-2 text-slate-500">Try another search keyword.</p>
                    </div>
                ) : (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {filteredDoctors.map((doctor) => (
                            <article key={doctor._id} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_24px_70px_-45px_rgba(15,23,42,0.35)]">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                        <BriefcaseMedical className="h-6 w-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="truncate text-xl font-semibold text-slate-950">{doctor.userId?.name}</h2>
                                            {doctor.isProfileVerified && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                                    <BadgeCheck className="h-3.5 w-3.5" />
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm font-medium text-blue-700">{doctor.specialization}</p>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                            <CalendarDays className="h-4 w-4" />
                                            Experience
                                        </p>
                                        <p className="mt-2 font-semibold text-slate-950">{doctor.experience} Years</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                            <BadgeIndianRupee className="h-4 w-4" />
                                            Fee
                                        </p>
                                        <p className="mt-2 font-semibold text-slate-950">₹{doctor.consultationFee}</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {doctor.availableDays.map((day) => (
                                        <span key={day} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                                            {day}
                                        </span>
                                    ))}
                                </div>

                                <Link to={`/patient/doctors/${doctor._id}`} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700">
                                    View Details
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default Doctors;
