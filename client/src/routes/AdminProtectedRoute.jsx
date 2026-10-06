import { Outlet,Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminProtectedRoute = () => {
  const { admin, adminLoading } = useAuth();

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return admin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;