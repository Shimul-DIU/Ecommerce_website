import { Outlet } from "react-router-dom";
import AdminNavbar from "./../components/admin/AdminNavbar";

const Adminlayout = () => {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <aside className="w-64  text-white">
        Sidebar
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <AdminNavbar />

        {/* Content */}
        <div className="p-4 flex-1 ">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default Adminlayout;