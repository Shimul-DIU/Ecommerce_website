import React from 'react';
import { NavLink } from "react-router-dom";
import logo from '../../../assets/images/logo.png';
import { LogOut } from "lucide-react";

// Import icons from react-icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTableCells,
  faBagShopping,
  faHeart,
  faLocationDot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const UserDashboardNavbar = () => {
  const navItems = [
    { to: "user-overview", icon: faTableCells, label: "Overview" },
    { to: "user-orders", icon: faBagShopping, label: "Orders" },
    { to: "user-wishlist", icon: faHeart, label: "Wishlist" },
    { to: "user-addresses", icon: faLocationDot, label: "Addresses" },
    { to: "user-profile", icon: faUser, label: "Profile" },
  ];

  return (
    <aside className="group flex flex-col bg-slate-900 w-16 hover:w-60 lg:w-60 h-screen sticky top-0 transition-all duration-300">
      <div className="flex items-center h-16 px-4 border-b border-slate-700">
        <img src={logo} alt="logo" className="rounded-md w-8 flex-shrink-0" />
        <span className="ml-3 text-white font-bold text-lg whitespace-nowrap opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity duration-300">
          Shimulshop
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-2 py-4 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${isActive ? "bg-rose-600 font-semibold text-white" : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <FontAwesomeIcon icon={item.icon} className="text-[17px] flex-shrink-0" />
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity duration-300">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-700 p-2">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 transition-colors">
          <LogOut size={17} className="flex-shrink-0" />
          <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity duration-300">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default UserDashboardNavbar;