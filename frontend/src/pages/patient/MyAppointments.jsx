import DashboardLayout from "../../layouts/DashboardLayout";

function MyAppointments() {

    const menuItems = [
        { label: "Dashboard", path: "/patient/dashboard" },
        { label: "Doctors", path: "/patient/doctors" },
        { label: "My Appointments", path: "/patient/appointments" },
        { label: "Logout", path: "/login" },
    ];

    const appointments = [
        {
            id: 1,
            doctorName: "Dr. Rahul Sharma",
            specialization: "Cardiologist",
            appointmentDate: "15 July 2026",
            appointmentTime: "10:30 AM",
            tokenNumber: 1030,
            reasonForVisit: "Fever and headache",
            status: "approved"
        },
        {
            id: 2,
            doctorName: "Dr. Priya Singh",
            specialization: "Dermatologist",
            preferredDate: "20 July 2026",
            reasonForVisit: "Skin allergy",
            status: "pending"
        },
        {
            id: 3,
            doctorName: "Dr. Amit Kumar",
            specialization: "Neurologist",
            reasonForVisit: "Migraine",
            rejectionReason: "Doctor unavailable on selected date.",
            status: "rejected"
        },
        {
            id: 4,
            doctorName: "Dr. Rahul Sharma",
            specialization: "Cardiologist",
            appointmentDate: "10 July 2026",
            appointmentTime: "11:00 AM",
            tokenNumber: 1100,
            reasonForVisit: "Routine checkup",
            status: "completed"
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            case "completed":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <DashboardLayout
            title="Ankesh Kumar"
            role="Patient"
            menuItems={menuItems}
        >

            <h1 className="text-3xl font-bold">
                My Appointments
            </h1>

            <p className="mt-2 text-slate-600">
                Track all your appointment requests and their status.
            </p>

            <div className="mt-8 space-y-6">

                {appointments.map((appointment) => (

                    <div
                        key={appointment.id}
                        className="rounded-xl bg-white p-6 shadow"
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-semibold">
                                    {appointment.doctorName}
                                </h2>

                                <p className="text-slate-600">
                                    {appointment.specialization}
                                </p>

                            </div>

                            <span
                                className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusColor(appointment.status)}`}
                            >
                                {appointment.status}
                            </span>

                        </div>

                        <div className="mt-5 space-y-2">

                            <p>
                                <strong>Reason:</strong> {appointment.reasonForVisit}
                            </p>

                            {appointment.appointmentDate && (
                                <p>
                                    <strong>Appointment Date:</strong> {appointment.appointmentDate}
                                </p>
                            )}

                            {appointment.appointmentTime && (
                                <p>
                                    <strong>Appointment Time:</strong> {appointment.appointmentTime}
                                </p>
                            )}

                            {appointment.tokenNumber && (
                                <p>
                                    <strong>Token Number:</strong> {appointment.tokenNumber}
                                </p>
                            )}

                            {appointment.preferredDate && (
                                <p>
                                    <strong>Preferred Date:</strong> {appointment.preferredDate}
                                </p>
                            )}

                            {appointment.rejectionReason && (
                                <p className="text-red-600">
                                    <strong>Reason:</strong> {appointment.rejectionReason}
                                </p>
                            )}

                        </div>

                    </div>

                ))}

            </div>

        </DashboardLayout>
    );
}

export default MyAppointments;