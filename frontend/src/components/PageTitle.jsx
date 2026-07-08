import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";

const pageTitles = [
    ["/", "ClinicQueue | Smart Clinic Queue Management"],
    ["/login", "Login | ClinicQueue"],
    ["/register", "Create Account | ClinicQueue"],
    ["/patient/dashboard", "Patient Dashboard | ClinicQueue"],
    ["/patient/doctors", "Find Doctors | ClinicQueue"],
    ["/patient/doctors/:id", "Doctor Details | ClinicQueue"],
    ["/patient/appointments", "My Appointments | ClinicQueue"],
    ["/doctor/dashboard", "Doctor Dashboard | ClinicQueue"],
    ["/doctor/profile", "Doctor Profile | ClinicQueue"],
    ["/doctor/appointments", "Appointment Requests | ClinicQueue"],
    ["/doctor/history", "Appointment History | ClinicQueue"],
    ["/admin/dashboard", "Admin Dashboard | ClinicQueue"],
    ["/admin/doctors", "Pending Doctors | ClinicQueue"],
    ["/admin/profile-requests", "Profile Requests | ClinicQueue"],
];

function PageTitle() {
    const location = useLocation();

    useEffect(() => {
        const matchedTitle = pageTitles.find(([path]) => matchPath({ path, end: true }, location.pathname))?.[1];
        document.title = matchedTitle || "ClinicQueue";
    }, [location.pathname]);

    return null;
}

export default PageTitle;
