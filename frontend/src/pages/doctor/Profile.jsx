import DashboardLayout from "../../layouts/DashboardLayout";

function Profile() {

    const menuItems = [
        { label: "Dashboard", path: "/doctor/dashboard" },
        { label: "My Profile", path: "/doctor/profile" },
        { label: "Appointment Requests", path: "/doctor/appointments" },
        { label: "Appointment History", path: "/doctor/history" },
        { label: "Logout", action: "logout" },
    ];

    const doctor = {
        name: "Dr. Rahul Sharma",
        email: "rahul.doctor@gmail.com",
        phoneNumber: "9876543210",
        specialization: "Cardiologist",
        qualification: "MBBS, MD",
        experience: 5,
        consultationFee: 500,
        availableDays: ["Monday", "Wednesday", "Friday"]
    };

    return (
        <DashboardLayout
            title="Dr. Rahul Sharma"
            role="Doctor"
            menuItems={menuItems}
        >

            <h1 className="text-3xl font-bold">
                My Profile
            </h1>

            <p className="mt-2 text-slate-600">
                View and manage your professional information.
            </p>

            <div className="mt-8 rounded-xl bg-white p-8 shadow">

                <div className="grid gap-6 md:grid-cols-2">

                    <div>
                        <label className="font-semibold">Name</label>
                        <p className="mt-2">{doctor.name}</p>
                    </div>

                    <div>
                        <label className="font-semibold">Email</label>
                        <p className="mt-2">{doctor.email}</p>
                    </div>

                    <div>
                        <label className="font-semibold">Phone Number</label>
                        <p className="mt-2">{doctor.phoneNumber}</p>
                    </div>

                    <div>
                        <label className="font-semibold">Specialization</label>
                        <p className="mt-2">{doctor.specialization}</p>
                    </div>

                    <div>
                        <label className="font-semibold">Qualification</label>
                        <p className="mt-2">{doctor.qualification}</p>
                    </div>

                    <div>
                        <label className="font-semibold">Experience</label>
                        <p className="mt-2">{doctor.experience} Years</p>
                    </div>

                    <div>
                        <label className="font-semibold">Consultation Fee</label>
                        <p className="mt-2">₹{doctor.consultationFee}</p>
                    </div>

                    <div>
                        <label className="font-semibold">Available Days</label>
                        <p className="mt-2">
                            {doctor.availableDays.join(", ")}
                        </p>
                    </div>

                </div>

                <button
                    className="mt-10 rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                >
                    Edit Profile
                </button>

            </div>

        </DashboardLayout>
    );
}

export default Profile;