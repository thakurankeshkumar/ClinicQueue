import { Navigate } from "react-router-dom";
import useAuth from "../context/auth/useAuth";
import FullScreenLoader from "./FullScreenLoader";

function ProtectedRoute({ children, allowedRoles }) {

    const { user, loading } = useAuth();

    if (loading) {
        return (
            <FullScreenLoader title="Checking access" subtitle="Verifying your secure clinic session." />
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        switch (user.role) {
            case "patient":
                return <Navigate to="/patient/dashboard" replace />;

            case "doctor":
                return <Navigate to="/doctor/dashboard" replace />;

            case "admin":
                return <Navigate to="/admin/dashboard" replace />;

            default:
                return <Navigate to="/login" replace />;
        }
    }
    return children;
}

export default ProtectedRoute;
