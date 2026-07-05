import DashboardLayout from "../../layouts/DashboardLayout";

function Dashboard() {

    const menuItems = [
        { label: "Dashboard", path: "/patient/dashboard" },
        { label: "Doctors", path: "/patient/doctors" },
        { label: "My Appointments", path: "/patient/appointments" },
        { label: "Logout", path: "/login" },
    ];

    return (
        <DashboardLayout title="Ankesh Kumar" role="Patient" menuItems={menuItems}>
            <h2 className="text-3xl font-bold">Welcome Back 👋</h2>
            <p className="mt-2 text-slate-600">Here's an overview of your appointments.</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Upcoming</h3>
                    <p className="mt-3 text-4xl font-bold">2</p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Pending</h3>
                    <p className="mt-3 text-4xl font-bold">1</p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Completed</h3>
                    <p className="mt-3 text-4xl font-bold">8</p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-slate-500">Rejected</h3>
                    <p className="mt-3 text-4xl font-bold">0</p>
                </div>
            </div>
            <div className="mt-10 rounded-xl bg-white p-6 shadow">
                <h3 className="mb-6 text-xl font-semibold">Recent Activity</h3>
                <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                        <h4 className="font-semibold">Dr. Rahul Sharma</h4>
                        <p className="text-sm text-slate-500">Cardiologist</p>
                        <p className="mt-2 text-green-600">Appointment Approved</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h4 className="font-semibold">Dr. Priya Singh</h4>
                        <p className="text-sm text-slate-500">Dermatologist</p>
                        <p className="mt-2 text-amber-600">Awaiting Approval</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;