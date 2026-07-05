import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getMyAppointments } from "../../api/patient";
import useAuth from "../../context/auth/useAuth";

function MyAppointments() {

    const { user } = useAuth();

    const menuItems = [
        { label: "Dashboard", path: "/patient/dashboard" },
        { label: "Doctors", path: "/patient/doctors" },
        { label: "My Appointments", path: "/patient/appointments" },
        { label: "Logout", action: "logout" },
    ];

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await getMyAppointments();
                setAppointments(response.data.appointments);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load appointments.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();

    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "completed":
                return "bg-blue-100 text-blue-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
                <h2 className="text-2xl font-semibold"> Loading Appointments...</h2>
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
            <h1 className="text-3xl font-bold">My Appointments</h1>
            <p className="mt-2 text-slate-600">Track all your appointment requests and their status.</p>
            {
                appointments.length === 0 ? (
                    <div className="mt-8 rounded-xl bg-white p-8 text-center shadow">
                        <h2 className="text-xl font-semibold">No Appointments Found</h2>
                        <p className="mt-2 text-slate-500">Book your first appointment to get started.</p>
                    </div>
                ) : (
                    <div className="mt-8 space-y-6">
                        {appointments.map((appointment) => (
                            <div key={appointment._id} className="rounded-xl bg-white p-6 shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold">{appointment.doctorId?.userId?.name}</h2>
                                        <p className="text-slate-600">{appointment.doctorId?.specialization}</p>
                                    </div>
                                    <span className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusColor(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                </div>
                                <div className="mt-5 space-y-2">
                                    <p><strong>Reason:</strong>{" "}{appointment.reasonForVisit}</p>

                                    {
                                        appointment.preferredDate && (
                                            <p><strong>Preferred Date:</strong>{" "} {new Date(appointment.preferredDate).toLocaleDateString()}</p>
                                        )
                                    }

                                    {
                                        appointment.appointmentDate && (
                                            <p><strong>Appointment Date:</strong>{" "} {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                                        )
                                    }

                                    {
                                        appointment.appointmentTime && (
                                            <p> <strong>Appointment Time:</strong>{" "}{appointment.appointmentTime}</p>
                                        )
                                    }

                                    {
                                        appointment.tokenNumber && (
                                            <p> <strong>Token Number:</strong>{" "}{appointment.tokenNumber}</p>
                                        )
                                    }

                                    {
                                        appointment.rejectionReason && (
                                            <p className="text-red-600"> <strong>Rejection Reason:</strong>{" "}{appointment.rejectionReason}</p>
                                        )
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </DashboardLayout>
    );
}

export default MyAppointments;