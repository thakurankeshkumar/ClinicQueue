import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

function Doctors() {

    const menuItems = [
        { label: "Dashboard", path: "/patient/dashboard" },
        { label: "Doctors", path: "/patient/doctors" },
        { label: "My Appointments", path: "/patient/appointments" },
        { label: "Logout", path: "/login" },
    ];

    const doctors = [
        {
            id: 1,
            name: "Dr. Rahul Sharma",
            specialization: "Cardiologist",
            experience: 5,
            consultationFee: 500,
            availableDays: ["Monday", "Wednesday", "Friday"]
        },
        {
            id: 2,
            name: "Dr. Priya Singh",
            specialization: "Dermatologist",
            experience: 8,
            consultationFee: 700,
            availableDays: ["Tuesday", "Thursday"]
        },
        {
            id: 3,
            name: "Dr. Amit Kumar",
            specialization: "Neurologist",
            experience: 12,
            consultationFee: 1000,
            availableDays: ["Monday", "Saturday"]
        }
    ];

    return (
        <DashboardLayout
            title="Ankesh Kumar"
            role="Patient"
            menuItems={menuItems}
        >

            <h1 className="text-3xl font-bold">
                Available Doctors
            </h1>

            <p className="mt-2 text-slate-600">
                Browse available doctors and book your appointment.
            </p>

            <input
                type="text"
                placeholder="Search doctor..."
                className="mt-8 w-full rounded-xl border px-4 py-3"
            />

            <div className="mt-8 grid gap-6 lg:grid-cols-2">

                {doctors.map((doctor) => (

                    <div
                        key={doctor.id}
                        className="rounded-xl bg-white p-6 shadow"
                    >

                        <h2 className="text-xl font-semibold">
                            {doctor.name}
                        </h2>

                        <p className="mt-2 text-slate-600">
                            {doctor.specialization}
                        </p>

                        <p className="mt-2">
                            <strong>Experience:</strong> {doctor.experience} Years
                        </p>

                        <p>
                            <strong>Fee:</strong> ₹{doctor.consultationFee}
                        </p>

                        <p className="mt-2">
                            <strong>Available:</strong>{" "}
                            {doctor.availableDays.join(", ")}
                        </p>

                        <Link
                            to={`/patient/doctors/${doctor.id}`}
                            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2 text-white"
                        >
                            View Details
                        </Link>

                    </div>

                ))}

            </div>

        </DashboardLayout>
    );
}

export default Doctors;