import { useEffect, useState } from "react";
import useAuth from "../../context/auth/useAuth";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getDoctor, bookAppointment } from "../../api/patient";

function DoctorDetails() {

    const { id } = useParams();
    const { user } = useAuth();
    const menuItems = [
        { label: "Dashboard", path: "/patient/dashboard" },
        { label: "Doctors", path: "/patient/doctors" },
        { label: "My Appointments", path: "/patient/appointments" },
        { label: "Logout", action: "logout" },
    ];
    const [doctor, setDoctor] = useState(null);
    const [formData, setFormData] = useState({ reasonForVisit: "", preferredDate: "" });

    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await getDoctor(id);
                setDoctor(response.data.doctor);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load doctor.");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value, });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (booking) return;

        setBooking(true);
        setError("");
        setSuccess("");

        try {
            await bookAppointment({
                doctorId: doctor._id,
                preferredDate: formData.preferredDate,
                reasonForVisit: formData.reasonForVisit
            });
            setSuccess("Appointment request submitted successfully.");
            setFormData({ reasonForVisit: "", preferredDate: "" });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to book appointment.");
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
                <h2 className="text-2xl font-semibold">Loading Doctor...</h2>
            </DashboardLayout>
        );
    }

    if (error && !doctor) {
        return (
            <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
                <div className="rounded-lg bg-red-100 p-4 text-red-700">{error}</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title={user?.name || "Patient"} role="Patient" menuItems={menuItems}>
            <Link to="/patient/doctors" className="text-blue-600 hover:underline">← Back to Doctors</Link>
            {/* Doctor Details */}

            <div className="mt-6 rounded-xl bg-white p-8 shadow">
                <h1 className="text-3xl font-bold">{doctor.userId?.name}</h1>
                <p className="mt-2 text-lg text-slate-600">{doctor.specialization}</p>
                <div className="mt-6 space-y-3">
                    <p> <strong>Qualification:</strong>{" "}{doctor.qualification}</p>
                    <p> <strong>Experience:</strong>{" "}{doctor.experience} Years</p>
                    <p> <strong>Consultation Fee:</strong> ₹{doctor.consultationFee}</p>
                    <p> <strong>Available Days:</strong>{" "} {doctor.availableDays.join(", ")}</p>
                </div>
            </div>
            {/* Appointment Form */}

            <div className="mt-8 rounded-xl bg-white p-8 shadow">
                <h2 className="text-2xl font-bold">Book Appointment</h2>
                {error && doctor && (<div className="mt-5 rounded-lg bg-red-100 p-3 text-red-700">{error}</div>)}

                {success && (<div className="mt-5 rounded-lg bg-green-100 p-3 text-green-700">{success}</div>)}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <label className="mb-2 block font-medium">Reason for Visit</label>
                        <textarea name="reasonForVisit" rows="4" value={formData.reasonForVisit} onChange={handleChange}
                            placeholder="Describe your health concern..." className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600" />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">Preferred Date</label>
                        <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange}
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600" />
                    </div>

                    <button type="submit" disabled={booking} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                        {booking ? "Submitting..." : "Request Appointment"}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );

}

export default DoctorDetails;