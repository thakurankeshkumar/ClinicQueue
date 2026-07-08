import { useEffect, useMemo, useState } from "react";
import AuthContext from "./AuthContext";
import { getProfile } from "../../api/auth";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const authValue = useMemo(() => ({
        user,
        setUser,
        loading,
        isAuthenticated: !!user,
    }), [user, loading]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                setUser(response.data.user);
            } catch (err) {
                console.error(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <AuthContext.Provider
            value={authValue}>
            {children}
        </AuthContext.Provider>
    );
}
