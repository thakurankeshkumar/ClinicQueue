import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getPatientDashboard } from "../../api/patient";
import useAuth from "../../context/auth/useAuth";

function Dashboard() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        upcomingAppointments: 0,
        pendingAppointments: 0,
        completedAppointments: 0,
        rejectedAppointments: 0,
        recentAppointments: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const menuItems = [
        { label: "Dashboard", path: "/patient/dashboard" },
        { label: "Doctors", path: "/patient/doctors" },
        { label: "My Appointments", path: "/patient/appointments" },
        { label: "Logout", action: "logout" },
    ];

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await getPatientDashboard();
                setDashboardData(response.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load dashboard.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
                <h2 className="text-2xl font-semibold">Loading Dashboard...</h2>
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
            <h2 className="text-3xl font-bold">Welcome Back 👋</h2>

            <p className="mt-2 text-slate-600">Here's an overview of your appointments.</p>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Upcoming</h3>
                    <p className="mt-3 text-4xl font-bold">{dashboardData.upcomingAppointments}</p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Pending</h3>
                    <p className="mt-3 text-4xl font-bold">{dashboardData.pendingAppointments}</p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Completed</h3>
                    <p className="mt-3 text-4xl font-bold">{dashboardData.completedAppointments}</p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Rejected</h3>
                    <p className="mt-3 text-4xl font-bold">{dashboardData.rejectedAppointments}</p>
                </div>
            </div>

            <div className="mt-10 rounded-xl bg-white p-6 shadow">
                <h3 className="mb-6 text-xl font-semibold">Recent Activity</h3>
                {
                    dashboardData.recentAppointments.length === 0 ? (
                        <p className="text-slate-500">No recent appointments found.</p>
                    ) : (
                        <div className="space-y-4">
                            {
                                dashboardData.recentAppointments.map((appointment) => (
                                    <div key={appointment._id} className="rounded-lg border p-4">
                                        <h4 className="font-semibold">{appointment.doctorId?.userId?.name}</h4>
                                        <p className="mt-2 text-sm text-slate-500">{appointment.reasonForVisit}</p>
                                        <p className={`mt-2 font-medium capitalize
                                                ${appointment.status === "approved" ? "text-green-600" : appointment.status === "pending"
                                                ? "text-amber-600" : appointment.status === "completed" ? "text-blue-600" : "text-red-600"}`}>
                                            {appointment.status}
                                        </p>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </DashboardLayout >
    );
}

export default Dashboard;