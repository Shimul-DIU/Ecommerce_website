import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Package, Heart, MapPin, User, LayoutGrid } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";

// ---- Local design tokens ----
const C = {
  ink: "#14213D",
  stamp: "#B23A48",
};

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/user/logout");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside
      style={{ background: C.ink, width: 240, flexShrink: 0 }}
      className="p-5 flex md:flex-col justify-between min-h-screen"
    >
      <div>
        <div className="flex items-center gap-2 mb-8 px-1">
          <div
            style={{ background: C.stamp }}
            className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold"
          >
            S
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Shopfolio</span>
        </div>

        <nav className="flex md:flex-col gap-1 flex-wrap">
          <NavLink
            to="/userDashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left no-underline transition duration-150 ${
                isActive
                  ? "text-white font-semibold"
                  : "text-[#B9C2D6] font-normal hover:bg-[#B23A48]/10"
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? C.stamp : "transparent",
            })}
          >
            <LayoutGrid size={17} />
            Overview
          </NavLink>

          <NavLink
            to="/userDashboard/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left no-underline transition duration-150 ${
                isActive
                  ? "text-white font-semibold"
                  : "text-[#B9C2D6] font-normal hover:bg-[#B23A48]/10"
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? C.stamp : "transparent",
            })}
          >
            <Package size={17} />
            Orders
          </NavLink>

          <NavLink
            to="/userDashboard/wishlist"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left no-underline transition duration-150 ${
                isActive
                  ? "text-white font-semibold"
                  : "text-[#B9C2D6] font-normal hover:bg-[#B23A48]/10"
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? C.stamp : "transparent",
            })}
          >
            <Heart size={17} />
            Wishlist
          </NavLink>

          <NavLink
            to="/userDashboard/addresses"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left no-underline transition duration-150 ${
                isActive
                  ? "text-white font-semibold"
                  : "text-[#B9C2D6] font-normal hover:bg-[#B23A48]/10"
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? C.stamp : "transparent",
            })}
          >
            <MapPin size={17} />
            Addresses
          </NavLink>

          <NavLink
            to="/userDashboard/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left no-underline transition duration-150 ${
                isActive
                  ? "text-white font-semibold"
                  : "text-[#B9C2D6] font-normal hover:bg-[#B23A48]/10"
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? C.stamp : "transparent",
            })}
          >
            <User size={17} />
            Profile
          </NavLink>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="hidden md:flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#B23A48]/20 rounded-lg transition"
        style={{ color: "#8A93A8" }}
      >
        <LogOut size={16} /> Log out
      </button>
    </aside>
  );
}