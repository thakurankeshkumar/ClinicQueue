import DashboardLayout from "../../layouts/DashboardLayout";

function AppointmentHistory() {

    const menuItems = [
        { label: "Dashboard", path: "/doctor/dashboard" },
        { label: "My Profile", path: "/doctor/profile" },
        { label: "Appointment Requests", path: "/doctor/appointments" },
        { label: "Appointment History", path: "/doctor/history" },
        { label: "Logout", action: "logout" },
    ];

    const appointments = [
        {
            id: 1,
            patientName: "Ankesh Kumar",
            gender: "Male",
            appointmentDate: "15 July 2026",
            appointmentTime: "10:30 AM",
            status: "completed",
            reason: "Fever and headache"
        },
        {
            id: 2,
            patientName: "Rahul Singh",
            gender: "Male",
            appointmentDate: "14 July 2026",
            appointmentTime: "11:00 AM",
            status: "approved",
            reason: "Routine Checkup"
        },
        {
            id: 3,
            patientName: "Priya Kumari",
            gender: "Female",
            appointmentDate: "13 July 2026",
            appointmentTime: "9:30 AM",
            status: "rejected",
            reason: "Skin Allergy"
        }
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case "completed":
                return "bg-blue-100 text-blue-700";
            case "approved":
                return "bg-green-100 text-green-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <DashboardLayout
            title="Dr. Rahul Sharma"
            role="Doctor"
            menuItems={menuItems}
        >

            <h1 className="text-3xl font-bold">
                Appointment History
            </h1>

            <p className="mt-2 text-slate-600">
                Review all approved, completed and rejected appointments.
            </p>

            <div className="mt-8 space-y-6">

                {appointments.map((appointment) => (

                    <div
                        key={appointment.id}
                        className="rounded-xl bg-white p-6 shadow"
                    >

                        <div className="flex justify-between items-start">

                            <div>

                                <h2 className="text-xl font-semibold">
                                    {appointment.patientName}
                                </h2>

                                <p className="text-slate-600">
                                    {appointment.gender}
                                </p>

                            </div>

                            <span
                                className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${getStatusClass(appointment.status)}`}
                            >
                                {appointment.status}
                            </span>

                        </div>

                        <div className="mt-5 space-y-2">

                            <p>
                                <strong>Date:</strong> {appointment.appointmentDate}
                            </p>

                            <p>
                                <strong>Time:</strong> {appointment.appointmentTime}
                            </p>

                            <p>
                                <strong>Reason:</strong> {appointment.reason}
                            </p>

                        </div>

                    </div>

                ))}

            </div>

        </DashboardLayout>
    );
}

export default AppointmentHistory;