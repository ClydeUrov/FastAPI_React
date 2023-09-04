import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuthevtication = () => {
    const { user } = useAuth();

    return user?.username ? <Outlet /> : <Navigate to="/login" />;
};

export default RequireAuthevtication;