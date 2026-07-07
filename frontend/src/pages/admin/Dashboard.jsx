import { useEffect, useState } from "react";
import useAuth from "../../context/auth/useAuth";
import { getAdminDashboard } from "../../api/admin";
import DashboardLayout from "../../layouts/DashboardLayout";

function Dashboard() {

    const menuItems = [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Pending Doctors", path: "/admin/doctors" },
        { label: "Profile Requests", path: "/admin/profile-requests" },
        { label: "Logout", action: "logout" },
    ];

    const { user } = useAuth();

    const [dashboard, setDashboard] = useState({
        totalDoctors: 0, totalPatients: 0,
        pendingDoctors: 0, pendingProfileRequests: 0,
        todayAppointments: 0, completedAppointmentsToday: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await getAdminDashboard();
                setDashboard({
                    totalDoctors: response.data.totalDoctors,
                    totalPatients: response.data.totalPatients,
                    pendingDoctors: response.data.pendingDoctors,
                    pendingProfileRequests: response.data.pendingProfileRequests,
                    todayAppointments: response.data.todayAppointments,
                    completedAppointmentsToday: response.data.completedAppointmentsToday,
                });
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
            <DashboardLayout title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>
                <h2 className="text-2xl font-semibold">
                    Loading Dashboard...
                </h2>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>
                <div className="rounded-lg bg-red-100 p-4 text-red-700">
                    {error}
                </div>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>
            <h2 className="text-3xl font-bold">Welcome Back 👋</h2>
            <p className="mt-2 text-slate-600">Manage doctors and monitor clinic activities.</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Total Doctors</h3>
                    <p className="mt-3 text-4xl font-bold">
                        {dashboard.totalDoctors}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Total Patients</h3>
                    <p className="mt-3 text-4xl font-bold">
                        {dashboard.totalPatients}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Pending Doctors</h3>
                    <p className="mt-3 text-4xl font-bold text-amber-600">
                        {dashboard.pendingDoctors}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Profile Requests</h3>
                    <p className="mt-3 text-4xl font-bold text-blue-600">
                        {dashboard.pendingProfileRequests}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Today's Appointments</h3>
                    <p className="mt-3 text-4xl font-bold text-green-600">
                        {dashboard.todayAppointments}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Completed Today</h3>
                    <p className="mt-3 text-4xl font-bold text-purple-600">
                        {dashboard.completedAppointmentsToday}
                    </p>
                </div>

            </div>
        </DashboardLayout>
    );
}

export default Dashboard;