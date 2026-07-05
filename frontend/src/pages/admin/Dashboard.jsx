import DashboardLayout from "../../layouts/DashboardLayout";

function Dashboard() {

    const menuItems = [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Pending Doctors", path: "/admin/doctors" },
        { label: "Profile Requests", path: "/admin/profile-requests" },
        { label: "Logout", path: "/login" },
    ];

    return (
        <DashboardLayout title="Administrator" role="Admin" menuItems={menuItems}>
            <h2 className="text-3xl font-bold">Welcome Back 👋</h2>
            <p className="mt-2 text-slate-600">Manage doctors and monitor clinic activities.</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Pending Doctors</h3>
                    <p className="mt-3 text-4xl font-bold">4</p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Profile Requests</h3>
                    <p className="mt-3 text-4xl font-bold">2</p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Approved Doctors</h3>
                    <p className="mt-3 text-4xl font-bold">18</p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Total Doctors</h3>
                    <p className="mt-3 text-4xl font-bold">22</p>
                </div>
            </div>
            <div className="mt-10 rounded-xl bg-white p-6 shadow">
                <h3 className="mb-6 text-xl font-semibold">Recent Activity</h3>
                <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                        <h4 className="font-semibold">Dr. Aman Gupta</h4>
                        <p className="text-sm text-slate-500">New doctor registration</p>
                        <p className="mt-2 text-amber-600">Pending Approval</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h4 className="font-semibold">Dr. Priya Singh</h4>
                        <p className="text-sm text-slate-500">Profile update request</p>
                        <p className="mt-2 text-blue-600">Awaiting Review</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;