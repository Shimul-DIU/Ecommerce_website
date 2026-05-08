import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {

  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/admin/login" />;

};

export default AdminProtectedRoute;