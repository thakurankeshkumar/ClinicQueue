import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

function DoctorDetails() {

    const menuItems = [
        { label: "Dashboard", path: "/patient/dashboard" },
        { label: "Doctors", path: "/patient/doctors" },
        { label: "My Appointments", path: "/patient/appointments" },
        { label: "Logout", path: "/login" },
    ];

    const doctor = {
        name: "Dr. Rahul Sharma",
        specialization: "Cardiologist",
        qualification: "MBBS, MD",
        experience: 5,
        consultationFee: 500,
        availableDays: ["Monday", "Wednesday", "Friday"],
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Appointment Requested!");
    };

    return (
        <DashboardLayout
            title="Ankesh Kumar"
            role="Patient"
            menuItems={menuItems}
        >

            <Link
                to="/patient/doctors"
                className="text-blue-600 hover:underline"
            >
                ← Back to Doctors
            </Link>

            {/* Doctor Details */}

            <div className="mt-6 rounded-xl bg-white p-8 shadow">

                <h1 className="text-3xl font-bold">
                    {doctor.name}
                </h1>

                <p className="mt-2 text-lg text-slate-600">
                    {doctor.specialization}
                </p>

                <div className="mt-6 space-y-3">

                    <p>
                        <strong>Qualification:</strong> {doctor.qualification}
                    </p>

                    <p>
                        <strong>Experience:</strong> {doctor.experience} Years
                    </p>

                    <p>
                        <strong>Consultation Fee:</strong> ₹{doctor.consultationFee}
                    </p>

                    <p>
                        <strong>Available Days:</strong>{" "}
                        {doctor.availableDays.join(", ")}
                    </p>

                </div>

            </div>

            {/* Appointment Form */}

            <div className="mt-8 rounded-xl bg-white p-8 shadow">

                <h2 className="text-2xl font-bold">
                    Book Appointment
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >

                    <div>

                        <label className="mb-2 block font-medium">
                            Reason for Visit
                        </label>

                        <textarea
                            rows="4"
                            placeholder="Describe your health concern..."
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block font-medium">
                            Preferred Date
                        </label>

                        <input
                            type="date"
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
                        />

                    </div>

                    <button
                        className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Request Appointment
                    </button>

                </form>

            </div>

        </DashboardLayout>
    );
}

export default DoctorDetails;