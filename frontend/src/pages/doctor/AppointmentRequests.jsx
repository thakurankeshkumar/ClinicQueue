import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

function AppointmentRequests() {

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
            preferredDate: "15 July 2026",
            reason: "Fever and headache for the last three days."
        },
        {
            id: 2,
            patientName: "Rohit Sharma",
            gender: "Male",
            preferredDate: "18 July 2026",
            reason: "Routine health checkup."
        }
    ];

    const [selectedId, setSelectedId] = useState(null);
    const [action, setAction] = useState("");

    return (
        <DashboardLayout
            title="Dr. Rahul Sharma"
            role="Doctor"
            menuItems={menuItems}
        >

            <h1 className="text-3xl font-bold">
                Appointment Requests
            </h1>

            <p className="mt-2 text-slate-600">
                Review and manage incoming appointment requests.
            </p>

            <div className="mt-8 space-y-6">

                {appointments.map((appointment) => (

                    <div
                        key={appointment.id}
                        className="rounded-xl bg-white p-6 shadow"
                    >

                        <h2 className="text-xl font-semibold">
                            {appointment.patientName}
                        </h2>

                        <p className="mt-2">
                            <strong>Gender:</strong> {appointment.gender}
                        </p>

                        <p className="mt-2">
                            <strong>Preferred Date:</strong> {appointment.preferredDate}
                        </p>

                        <p className="mt-2">
                            <strong>Reason:</strong> {appointment.reason}
                        </p>

                        <div className="mt-6 flex gap-4">

                            <button
                                onClick={() => {
                                    setSelectedId(appointment.id);
                                    setAction("approve");
                                }}
                                className="rounded-lg bg-green-600 px-5 py-2 text-white"
                            >
                                Approve
                            </button>

                            <button
                                onClick={() => {
                                    setSelectedId(appointment.id);
                                    setAction("reject");
                                }}
                                className="rounded-lg bg-red-600 px-5 py-2 text-white"
                            >
                                Reject
                            </button>

                        </div>

                        {selectedId === appointment.id && action === "approve" && (

                            <form className="mt-8 space-y-4 border-t pt-6">

                                <div>

                                    <label className="mb-2 block font-medium">
                                        Appointment Date
                                    </label>

                                    <input
                                        type="date"
                                        className="w-full rounded-lg border px-4 py-3"
                                    />

                                </div>

                                <div>

                                    <label className="mb-2 block font-medium">
                                        Appointment Time
                                    </label>

                                    <input
                                        type="time"
                                        className="w-full rounded-lg border px-4 py-3"
                                    />

                                </div>

                                <div>

                                    <label className="mb-2 block font-medium">
                                        Duration (Minutes)
                                    </label>

                                    <input
                                        type="number"
                                        placeholder="30"
                                        className="w-full rounded-lg border px-4 py-3"
                                    />

                                </div>

                                <button
                                    className="rounded-lg bg-green-600 px-6 py-3 text-white"
                                >
                                    Confirm Approval
                                </button>

                            </form>

                        )}

                        {selectedId === appointment.id && action === "reject" && (

                            <form className="mt-8 space-y-4 border-t pt-6">

                                <div>

                                    <label className="mb-2 block font-medium">
                                        Rejection Reason
                                    </label>

                                    <textarea
                                        rows="4"
                                        placeholder="Enter rejection reason..."
                                        className="w-full rounded-lg border px-4 py-3"
                                    />

                                </div>

                                <button
                                    className="rounded-lg bg-red-600 px-6 py-3 text-white"
                                >
                                    Reject Appointment
                                </button>

                            </form>

                        )}

                    </div>

                ))}

            </div>

        </DashboardLayout>
    );
}

export default AppointmentRequests;