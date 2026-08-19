import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const UserProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext)

  // এখনো authentication check শেষ হয়নি
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // authentication check শেষ
  // কিন্তু user নেই
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // user আছে
  return <Outlet />;
};

export default UserProtectedRoute;