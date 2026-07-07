import useAuth from "../../context/auth/useAuth";
import { useEffect, useMemo, useState } from "react";
import { getDoctorDashboard } from "../../api/doctor";
import DashboardLayout from "../../layouts/DashboardLayout";

function AppointmentHistory() {

    const menuItems = [
        { label: "Dashboard", path: "/doctor/dashboard" },
        { label: "My Profile", path: "/doctor/profile" },
        { label: "Appointment Requests", path: "/doctor/appointments" },
        { label: "Appointment History", path: "/doctor/history" },
        { label: "Logout", action: "logout" },
    ];


    const { user } = useAuth();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchHistory = async () => {

            try {

                const response = await getDoctorDashboard();

                setAppointments(response.data.allAppointments);

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load appointment history."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchHistory();

    }, []);

    const historyAppointments = useMemo(() => {

        return appointments.filter(appointment =>
            appointment.status === "completed" ||
            appointment.status === "rejected"
        );

    }, [appointments]);







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


    if (loading) {
        return (
            <DashboardLayout
                title={user?.name || "Doctor"}
                role="Doctor"
                menuItems={menuItems}
            >
                <h2 className="text-2xl font-semibold">
                    Loading Appointment History...
                </h2>
            </DashboardLayout>
        );
    }


    if (error) {
        return (
            <DashboardLayout
                title={user?.name || "Doctor"}
                role="Doctor"
                menuItems={menuItems}
            >
                <div className="rounded-lg bg-red-100 p-4 text-red-700">
                    {error}
                </div>
            </DashboardLayout>
        );
    }




    return (
        <DashboardLayout title="Dr. Rahul Sharma" role="Doctor" menuItems={menuItems}>

            <h1 className="text-3xl font-bold">Appointment History</h1>

            <p className="mt-2 text-slate-600">Review your completed and rejected appointment history.</p>

            <div className="mt-8 space-y-6">

                <div className="mt-8 space-y-8">

                    {
                        historyAppointments.length === 0 && (

                            <div className="rounded-xl bg-white p-10 text-center shadow">

                                <h2 className="text-xl font-semibold">
                                    No Appointment History
                                </h2>

                                <p className="mt-2 text-slate-500">
                                    Completed and rejected appointments will appear here.
                                </p>

                            </div>

                        )
                    }

                    {
                        historyAppointments.map((appointment) => (

                            appointment.status === "completed" ? (

                                <div
                                    key={appointment._id}
                                    className="rounded-2xl border-l-8 border-green-600 bg-white p-8 shadow"
                                >

                                    <div className="flex items-start justify-between">

                                        <div>

                                            <h2 className="text-2xl font-bold">
                                                {appointment.patientId?.name}
                                            </h2>

                                            <p className="mt-1 text-slate-500">
                                                {appointment.patientId?.gender} • {appointment.patientId?.email}
                                            </p>

                                        </div>

                                        <div className="rounded-full bg-green-100 px-5 py-2 font-semibold text-green-700">

                                            ✓ Completed

                                        </div>

                                    </div>

                                    <div className="mt-8 grid gap-5 md:grid-cols-2">

                                        <div>

                                            <p className="text-sm text-slate-500">
                                                Appointment Date
                                            </p>

                                            <p className="font-semibold">
                                                {new Date(
                                                    appointment.appointmentDate
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        weekday: "short",
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-sm text-slate-500">
                                                Appointment Time
                                            </p>

                                            <p className="font-semibold">
                                                {appointment.appointmentTime}
                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-sm text-slate-500">
                                                Queue Token
                                            </p>

                                            <p className="text-2xl font-bold text-blue-600">
                                                #{appointment.tokenNumber}
                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-sm text-slate-500">
                                                Duration
                                            </p>

                                            <p className="font-semibold">
                                                {appointment.duration} Minutes
                                            </p>

                                        </div>

                                    </div>

                                    <div className="mt-8 rounded-xl bg-slate-100 p-5">

                                        <h3 className="font-semibold">
                                            Reason For Visit
                                        </h3>

                                        <p className="mt-2 text-slate-600">
                                            {appointment.reasonForVisit}
                                        </p>

                                    </div>

                                    <div className="mt-6 text-right text-sm text-slate-500">

                                        Completed on{" "}

                                        {
                                            appointment.completedAt &&
                                            new Date(
                                                appointment.completedAt
                                            ).toLocaleString(
                                                "en-IN",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )
                                        }

                                    </div>

                                </div>

                            ) : (

                                <div
                                    key={appointment._id}
                                    className="rounded-2xl border-l-8 border-red-600 bg-white p-8 shadow"
                                >

                                    <div className="flex items-start justify-between">

                                        <div>

                                            <h2 className="text-2xl font-bold">
                                                {appointment.patientId?.name}
                                            </h2>

                                            <p className="mt-1 text-slate-500">
                                                {appointment.patientId?.gender} • {appointment.patientId?.email}
                                            </p>

                                        </div>

                                        <div className="rounded-full bg-red-100 px-5 py-2 font-semibold text-red-700">

                                            ✕ Rejected

                                        </div>

                                    </div>

                                    <div className="mt-8 grid gap-5 md:grid-cols-2">

                                        <div>

                                            <p className="text-sm text-slate-500">
                                                Preferred Date
                                            </p>

                                            <p className="font-semibold">
                                                {
                                                    appointment.preferredDate &&
                                                    new Date(
                                                        appointment.preferredDate
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            weekday: "short",
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )
                                                }
                                            </p>

                                        </div>

                                    </div>

                                    <div className="mt-8 rounded-xl bg-slate-100 p-5">

                                        <h3 className="font-semibold">
                                            Reason For Visit
                                        </h3>

                                        <p className="mt-2 text-slate-600">
                                            {appointment.reasonForVisit}
                                        </p>

                                    </div>

                                    <div className="mt-6 rounded-xl bg-red-50 p-5">

                                        <h3 className="font-semibold text-red-700">
                                            Rejection Reason
                                        </h3>

                                        <p className="mt-2 text-red-600">
                                            {appointment.rejectionReason}
                                        </p>

                                    </div>

                                </div>

                            )

                        ))
                    }

                </div>

            </div>

        </DashboardLayout>
    );
}

export default AppointmentHistory;