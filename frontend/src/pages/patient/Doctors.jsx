import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getDoctors } from "../../api/patient";
import useAuth from "../../context/auth/useAuth";

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

    const filteredDoctors = doctors.filter((doctor) => {
        const name = doctor.userId?.name || "";
        const specialization = doctor.specialization || "";
        return (
            name.toLowerCase().includes(search.toLowerCase()) || specialization.toLowerCase().includes(search.toLowerCase())
        );
    });

    if (loading) {
        return (
            <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
                <h2 className="text-2xl font-semibold">Loading Doctors...</h2>
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
            <h1 className="text-3xl font-bold">Available Doctors</h1>
            <p className="mt-2 text-slate-600">Browse available doctors and book your appointment.</p>

            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search doctor..."
                className="mt-8 w-full rounded-xl border px-4 py-3" />
            {
                filteredDoctors.length === 0 ? (
                    <div className="mt-8 rounded-xl bg-white p-8 text-center shadow">
                        <h2 className="text-xl font-semibold">No Doctors Found</h2>
                        <p className="mt-2 text-slate-500">Try another search keyword.</p>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 lg:grid-cols-2">
                        {filteredDoctors.map((doctor) => (
                            <div key={doctor._id} className="rounded-xl bg-white p-6 shadow">
                                <h2 className="text-xl font-semibold">{doctor.userId?.name}</h2>
                                <p className="mt-2 text-slate-600">{doctor.specialization}</p>
                                <p className="mt-2"><strong>Experience:</strong>{" "}{doctor.experience} Years</p>
                                <p><strong>Fee:</strong> ₹{doctor.consultationFee}</p>

                                <p className="mt-2"><strong>Available:</strong>{" "}{doctor.availableDays.join(", ")}</p>
                                <Link to={`/patient/doctors/${doctor._id}`} className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2 text-white">
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )
            }
        </DashboardLayout>
    );
}

export default Doctors;