import DashboardLayout from "../../layouts/DashboardLayout";

function Dashboard() {

    const menuItems = [
        { label: "Dashboard", path: "/doctor/dashboard" },
        { label: "My Profile", path: "/doctor/profile" },
        { label: "Appointment Requests", path: "/doctor/appointments" },
        { label: "Appointment History", path: "/doctor/history" },
        { label: "Logout", path: "/login" },
    ];

    return (
        <DashboardLayout title="Dr. Rahul Sharma" role="Doctor" menuItems={menuItems}>
            <h2 className="text-3xl font-bold">Welcome Back 👋</h2>
            <p className="mt-2 text-slate-600">Here's an overview of today's appointments.</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Today's Appointments</h3>
                    <p className="mt-3 text-4xl font-bold">6</p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Pending Requests</h3>
                    <p className="mt-3 text-4xl font-bold">3</p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Completed Today</h3>
                    <p className="mt-3 text-4xl font-bold">4</p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Upcoming</h3>
                    <p className="mt-3 text-4xl font-bold">8</p>
                </div>
            </div>
            <div className="mt-10 rounded-xl bg-white p-6 shadow">
                <h3 className="mb-6 text-xl font-semibold">Recent Appointments</h3>
                <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                        <h4 className="font-semibold">Ankesh Kumar</h4>
                        <p className="text-sm text-slate-500">Fever and headache</p>
                        <p className="mt-2 text-green-600">Completed</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h4 className="font-semibold">Rohit Kumar</h4>
                        <p className="text-sm text-slate-500">General Checkup</p>
                        <p className="mt-2 text-red-600">Rejected</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;