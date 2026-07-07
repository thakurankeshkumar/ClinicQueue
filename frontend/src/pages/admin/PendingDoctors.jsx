import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import useAuth from "../../context/auth/useAuth";
import { getPendingDoctors, approveDoctor, rejectDoctor, } from "../../api/admin";


function PendingDoctors() {

    const menuItems = [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Pending Doctors", path: "/admin/doctors" },
        { label: "Profile Requests", path: "/admin/profile-requests" },
        { label: "Logout", action: "logout" },
    ];

    const { user } = useAuth();

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [processingId, setProcessingId] = useState(null);



    useEffect(() => {
        const fetchPendingDoctors = async () => {
            try {
                const response = await getPendingDoctors();
                setDoctors(response.data.doctors);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load pending doctors.");
            } finally {
                setLoading(false);
            }
        };
        fetchPendingDoctors();
    }, []);


    const handleApprove = async (doctorId) => {

        setProcessingId(doctorId);
        setError("");
        setSuccess("");

        try {
            await approveDoctor(doctorId);
            setDoctors(prev => prev.filter(doctor => doctor._id !== doctorId));
            setSuccess("Doctor approved successfully.");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to approve doctor.");
        } finally {
            setProcessingId(null);
        }
    };


    const handleReject = async (doctorId) => {

        setProcessingId(doctorId);
        setError("");
        setSuccess("");

        try {
            await rejectDoctor(doctorId);
            setDoctors(prev => prev.filter(doctor => doctor._id !== doctorId));
            setSuccess("Doctor rejected successfully.");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to reject doctor.");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <DashboardLayout title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>
                <h2 className="text-2xl font-semibold">
                    Loading Pending Doctors...
                </h2>
            </DashboardLayout>
        );
    }

    if (error && doctors.length === 0) {
        return (
            <DashboardLayout title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}       >
                <div className="rounded-lg bg-red-100 p-4 text-red-700">
                    {error}
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>

            <h1 className="text-3xl font-bold">Pending Doctor Registrations</h1>
            <p className="mt-2 text-slate-600">Review new doctor registration requests.</p>

            {error && (<div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">{error}</div>)}

            {success && (<div className="mt-6 rounded-lg bg-green-100 p-4 text-green-700">{success}</div>)}



            <div className="mt-8 space-y-6">

                {doctors.length === 0 ? (

                    <div className="rounded-xl bg-white p-8 text-center shadow">

                        <h2 className="text-xl font-semibold">
                            No Pending Doctors
                        </h2>

                        <p className="mt-2 text-slate-500">
                            All doctor registration requests have been reviewed.
                        </p>

                    </div>

                ) : (
                    doctors.map((doctor) => (
                        <div key={doctor._id} className="rounded-xl bg-white p-6 shadow">
                            <h2 className="text-xl font-semibold">{doctor.name}</h2>
                            <p className="mt-2"><strong>Email:</strong> {doctor.email}</p>
                            <p className="mt-2"><strong>Gender:</strong> {doctor.gender?.charAt(0).toUpperCase() + doctor.gender?.slice(1)}</p>
                            <div className="mt-6 flex gap-4">
                                <button onClick={() => handleApprove(doctor._id)} disabled={processingId === doctor._id}
                                    className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:opacity-60">
                                    {processingId === doctor._id ? "Processing..." : "Approve"}
                                </button>
                                <button onClick={() => handleReject(doctor._id)} disabled={processingId === doctor._id}
                                    className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-60">
                                    {processingId === doctor._id ? "Processing..." : "Reject"}
                                </button>
                            </div>
                        </div>
                    ))
                )}

            </div>

        </DashboardLayout>
    );
}

export default PendingDoctors;