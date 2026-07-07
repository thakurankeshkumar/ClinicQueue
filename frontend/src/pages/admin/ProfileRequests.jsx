import { useEffect, useState } from "react";
import useAuth from "../../context/auth/useAuth";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getProfileRequests, approveProfileRequest, rejectProfileRequest, } from "../../api/admin";



function ProfileRequests() {

    const menuItems = [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Pending Doctors", path: "/admin/doctors" },
        { label: "Profile Requests", path: "/admin/profile-requests" },
        { label: "Logout", action: "logout" },
    ];

    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [processingId, setProcessingId] = useState(null);
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        const fetchProfileRequests = async () => {
            try {
                const response = await getProfileRequests();
                setRequests(response.data.requests);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load profile requests.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfileRequests();
    }, []);


    const handleApprove = async (requestId) => {

        setProcessingId(requestId);

        setError("");
        setSuccess("");

        try {
            await approveProfileRequest(requestId);
            setRequests(prev => prev.filter(request => request._id !== requestId));
            setSuccess("Profile update approved successfully.");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to approve request.");
        } finally {
            setProcessingId(null);
        }

    };

    const handleReject = async (requestId) => {

        setProcessingId(requestId);

        setError("");
        setSuccess("");

        try {
            await rejectProfileRequest(requestId);
            setRequests(prev => prev.filter(request => request._id !== requestId));
            setSuccess("Profile update rejected successfully.");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to reject request.");
        } finally {
            setProcessingId(null);
        }
    };

    const getChangedFieldsCount = (request) => {

        let count = 0;

        if (request.doctorId.phoneNumber !== request.phoneNumber) count++;
        if (request.doctorId.specialization !== request.specialization) count++;
        if (request.doctorId.qualification !== request.qualification) count++;
        if (request.doctorId.experience !== request.experience) count++;
        if (request.doctorId.consultationFee !== request.consultationFee) count++;

        if (
            JSON.stringify(request.doctorId.availableDays) !== JSON.stringify(request.availableDays)
        ) {
            count++;
        }
        return count;
    };

    const isChanged = (currentValue, requestedValue) => { return JSON.stringify(currentValue) !== JSON.stringify(requestedValue); };


    if (loading) {
        return (
            <DashboardLayout title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>
                <h2 className="text-2xl font-semibold">
                    Loading Profile Requests...
                </h2>
            </DashboardLayout>
        );
    }

    if (error && requests.length === 0) {
        return (
            <DashboardLayout title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>
                <div className="rounded-lg bg-red-100 p-4 text-red-700">
                    {error}
                </div>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout title={user?.name || "Administrator"} role="Admin" menuItems={menuItems}>

            <h1 className="text-3xl font-bold">Profile Update Requests</h1>
            <p className="mt-2 text-slate-600">Review doctor profile update requests.</p>

            {error && (<div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">{error}</div>)}

            {success && (<div className="mt-6 rounded-lg bg-green-100 p-4 text-green-700">{success}</div>)}

            <div className="mt-8 space-y-6">
                {requests.length === 0 ? (
                    <div className="rounded-xl bg-white p-8 text-center shadow">
                        <h2 className="text-xl font-semibold">No Pending Profile Requests</h2>
                        <p className="mt-2 text-slate-500">There are currently no doctor profile update requests.</p>
                    </div>
                ) : (
                    requests.map((request) => (
                        <div key={request._id} className="rounded-xl border border-slate-200 bg-white shadow">

                            {/* Header */}

                            <div className="flex items-center justify-between border-b p-6">
                                <div>
                                    <h2 className="text-2xl font-bold">{request.doctorId.userId.name}</h2>
                                    <p className="mt-1 text-slate-500">{request.doctorId.userId.email}</p>
                                </div>

                                <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                                    📝 {getChangedFieldsCount(request)} Fields Modified
                                </div>
                            </div>

                            {/* Comparison Table */}

                            <div className="p-6">
                                <h3 className="mb-5 text-lg font-semibold">Requested Changes</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b text-left">
                                                <th className="py-3">Field</th>
                                                <th className="py-3 text-slate-500">Current</th>
                                                <th className="py-3 text-blue-600">Requested</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            <tr className="border-b">
                                                <td className="py-4 font-medium">Phone</td>
                                                <td>{request.doctorId.phoneNumber}</td>
                                                <td className={`font-semibold ${isChanged(request.doctorId.phoneNumber, request.phoneNumber) ? "text-blue-600" : "text-slate-700"}`}>{request.phoneNumber}</td>
                                            </tr>

                                            <tr className="border-b">
                                                <td className="py-4 font-medium">Specialization</td>
                                                <td>{request.doctorId.specialization}</td>
                                                <td className={`font-semibold ${isChanged(request.doctorId.specialization, request.specialization) ? "text-blue-600" : "text-slate-700"}`}>{request.specialization}</td>
                                            </tr>

                                            <tr className="border-b">
                                                <td className="py-4 font-medium">Qualification</td>
                                                <td>{request.doctorId.qualification}</td>
                                                <td className={`font-semibold ${isChanged(request.doctorId.qualification, request.qualification) ? "text-blue-600" : "text-slate-700"}`}>{request.qualification}</td>
                                            </tr>

                                            <tr className="border-b">
                                                <td className="py-4 font-medium">Experience</td>
                                                <td>{request.doctorId.experience} Years</td>
                                                <td className={`font-semibold ${isChanged(request.doctorId.experience, request.experience) ? "text-blue-600" : "text-slate-700"}`}>{request.experience} Years</td>
                                            </tr>

                                            <tr className="border-b">
                                                <td className="py-4 font-medium">Consultation Fee</td>
                                                <td>₹{request.doctorId.consultationFee}</td>
                                                <td className={`font-semibold ${isChanged(request.doctorId.consultationFee, request.consultationFee) ? "text-blue-600" : "text-slate-700"}`}>₹{request.consultationFee}</td>
                                            </tr>

                                            <tr>
                                                <td className="py-4 font-medium">Available Days</td>
                                                <td>{request.doctorId.availableDays.join(", ")}</td>
                                                <td className={`font-semibold ${isChanged(request.doctorId.availableDays, request.availableDays) ? "text-blue-600" : "text-slate-700"}`}>{request.availableDays.join(", ")}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="border-t px-6 py-5">
                                <button type="button" onClick={() => setExpandedCard(expandedCard === request._id ? null : request._id)}
                                    className="font-semibold text-blue-600 hover:text-blue-700">
                                    {expandedCard === request._id ? "Hide Complete Doctor Profile ▲" : "Review Complete Doctor Profile ▼"}
                                </button>
                            </div>

                            {expandedCard === request._id && (

                                <div className="border-t bg-slate-50 p-6">

                                    <div className="rounded-xl bg-white p-6 shadow-sm">

                                        <h3 className="mb-6 text-lg font-bold">Personal Information</h3>

                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div>
                                                <p className="text-sm text-slate-500">Name</p>
                                                <p className="mt-1 font-semibold">{request.doctorId.userId.name}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-slate-500">Email</p>
                                                <p className="mt-1 font-semibold">{request.doctorId.userId.email}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-slate-500">Phone Number</p>
                                                <p className={`mt-1 rounded-lg px-2 py-1 font-semibold ${isChanged(request.doctorId.phoneNumber, request.phoneNumber)
                                                    ? "bg-blue-100 text-blue-700" : ""}`}>{request.phoneNumber}</p>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

                                        <h3 className="mb-6 text-lg font-bold">
                                            Professional Information
                                        </h3>

                                        <div className="grid gap-6 md:grid-cols-2">

                                            {/* Specialization */}

                                            <div>

                                                <p className="text-sm text-slate-500">Specialization</p>

                                                <div className={`mt-2 rounded-lg border px-3 py-2 ${isChanged(request.doctorId.specialization,
                                                    request.specialization) ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
                                                    {request.specialization}
                                                </div>

                                            </div>

                                            {/* Qualification */}

                                            <div>

                                                <p className="text-sm text-slate-500">Qualification</p>

                                                <div className={`mt-2 rounded-lg border px-3 py-2 ${isChanged(request.doctorId.qualification,
                                                    request.qualification) ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
                                                    {request.qualification}
                                                </div>

                                            </div>

                                            {/* Experience */}

                                            <div>

                                                <p className="text-sm text-slate-500">Experience</p>

                                                <div className={`mt-2 rounded-lg border px-3 py-2 ${isChanged(request.doctorId.experience,
                                                    request.experience) ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
                                                    {request.experience} Years
                                                </div>

                                            </div>

                                            {/* Consultation Fee */}

                                            <div>

                                                <p className="text-sm text-slate-500">Consultation Fee</p>

                                                <div
                                                    className={`mt-2 rounded-lg border px-3 py-2 ${isChanged(request.doctorId.consultationFee, request.consultationFee)
                                                        ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
                                                    ₹{request.consultationFee}
                                                </div>

                                            </div>

                                        </div>

                                        {/* Available Days */}

                                        <div className="mt-6">

                                            <p className="text-sm text-slate-500">Available Days</p>
                                            <div
                                                className={`mt-3 flex flex-wrap gap-2 rounded-lg border p-3 ${isChanged(request.doctorId.availableDays,
                                                    request.availableDays) ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
                                                {request.availableDays.map(day => (
                                                    <span key={day} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                                                        {day}
                                                    </span>
                                                ))}
                                            </div>

                                        </div>

                                    </div>


                                </div>

                            )}

                            <div className="flex items-center justify-end gap-4 border-t p-6">

                                <button onClick={() => handleReject(request._id)} disabled={processingId === request._id}
                                    className="rounded-lg bg-red-600 px-6 py-2 text-white transition hover:bg-red-700 disabled:opacity-60">
                                    {processingId === request._id ? "Processing..." : "Reject Request"}
                                </button>

                                <button onClick={() => handleApprove(request._id)} disabled={processingId === request._id}
                                    className="rounded-lg bg-green-600 px-6 py-2 text-white transition hover:bg-green-700 disabled:opacity-60">
                                    {processingId === request._id ? "Processing..." : "Approve Changes"}
                                </button>

                            </div>


                        </div>
                    ))
                )}

            </div>
        </DashboardLayout>
    );
}

export default ProfileRequests;