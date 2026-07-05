import DashboardLayout from "../../layouts/DashboardLayout";

function PendingDoctors() {

    const menuItems = [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Pending Doctors", path: "/admin/doctors" },
        { label: "Profile Requests", path: "/admin/profile-requests" },
        { label: "Logout", path: "/login" },
    ];

    const doctors = [
        {
            id: 1,
            name: "Dr. Rahul Sharma",
            email: "rahul@gmail.com",
            gender: "Male"
        },
        {
            id: 2,
            name: "Dr. Priya Singh",
            email: "priya@gmail.com",
            gender: "Female"
        }
    ];

    return (
        <DashboardLayout
            title="Administrator"
            role="Admin"
            menuItems={menuItems}
        >

            <h1 className="text-3xl font-bold">
                Pending Doctor Registrations
            </h1>

            <p className="mt-2 text-slate-600">
                Review new doctor registration requests.
            </p>

            <div className="mt-8 space-y-6">

                {doctors.map((doctor) => (

                    <div
                        key={doctor.id}
                        className="rounded-xl bg-white p-6 shadow"
                    >

                        <h2 className="text-xl font-semibold">
                            {doctor.name}
                        </h2>

                        <p className="mt-2">
                            <strong>Email:</strong> {doctor.email}
                        </p>

                        <p className="mt-2">
                            <strong>Gender:</strong> {doctor.gender}
                        </p>

                        <div className="mt-6 flex gap-4">

                            <button
                                className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
                            >
                                Approve
                            </button>

                            <button
                                className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
                            >
                                Reject
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </DashboardLayout>
    );
}

export default PendingDoctors;