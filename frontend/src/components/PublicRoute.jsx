import { Navigate } from "react-router-dom";
import useAuth from "../context/auth/useAuth";
import FullScreenLoader from "./FullScreenLoader";

function PublicRoute({ children }) {

    const { user, loading } = useAuth();

    if (loading) {
        return (
            <FullScreenLoader title="Loading ClinicQueue" subtitle="Preparing your session." />
        );
    }

    if (user) {
        switch (user.role) {
            case "patient":
                return <Navigate to="/patient/dashboard" replace />;
            case "doctor":
                return <Navigate to="/doctor/dashboard" replace />;
            case "admin":
                return <Navigate to="/admin/dashboard" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }
    return children;
}

export default PublicRoute;
