import DashboardLayout from "../../layouts/DashboardLayout";

function ProfileRequests() {

    const menuItems = [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Pending Doctors", path: "/admin/doctors" },
        { label: "Profile Requests", path: "/admin/profile-requests" },
        { label: "Logout", action: "logout" },
    ];

    const requests = [
        {
            id: 1,
            name: "Dr. Rahul Sharma",
            specialization: "Cardiologist",
            qualification: "MBBS, MD",
            experience: 5,
            consultationFee: 500
        },
        {
            id: 2,
            name: "Dr. Priya Singh",
            specialization: "Dermatologist",
            qualification: "MBBS, MD",
            experience: 8,
            consultationFee: 700
        }
    ];

    return (
        <DashboardLayout
            title="Administrator"
            role="Admin"
            menuItems={menuItems}
        >

            <h1 className="text-3xl font-bold">
                Profile Update Requests
            </h1>

            <p className="mt-2 text-slate-600">
                Review doctor profile update requests.
            </p>

            <div className="mt-8 space-y-6">

                {requests.map((request) => (

                    <div
                        key={request.id}
                        className="rounded-xl bg-white p-6 shadow"
                    >

                        <h2 className="text-xl font-semibold">
                            {request.name}
                        </h2>

                        <p className="mt-2">
                            <strong>Specialization:</strong> {request.specialization}
                        </p>

                        <p className="mt-2">
                            <strong>Qualification:</strong> {request.qualification}
                        </p>

                        <p className="mt-2">
                            <strong>Experience:</strong> {request.experience} Years
                        </p>

                        <p className="mt-2">
                            <strong>Consultation Fee:</strong> ₹{request.consultationFee}
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

export default ProfileRequests;