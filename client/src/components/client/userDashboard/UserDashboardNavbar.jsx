import { NavLink } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import {
  LogOut,
  Home,
  ShoppingBag,
  Heart,
  MapPin,
  User,
  X,
} from "lucide-react";

const UserDashboardNavbar = ({ isExpanded, setIsExpanded }) => {
  const navItems = [
    { to: "user-overview", icon: Home, label: "Overview" },
    { to: "user-orders", icon: ShoppingBag, label: "Orders" },
    { to: "user-wishlist", icon: Heart, label: "Wishlist" },
    { to: "user-addresses", icon: MapPin, label: "Addresses" },
    { to: "user-profile", icon: User, label: "Profile" },
  ];

  return (
    <aside
      onClick={() => setIsExpanded(true)}
      className={`sticky top-0 z-40 flex h-screen flex-col bg-slate-900 transition-all duration-300 flex-shrink-0
      ${isExpanded ? "w-60" : "w-16"}
      lg:w-60 cursor-pointer lg:cursor-default`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
        <div className="flex items-center">
          <img
            src={logo}
            alt="logo"
            className="h-8 w-8 rounded-md flex-shrink-0"
          />
          <span
            className={`ml-3 whitespace-nowrap text-lg font-bold text-white transition-opacity duration-300
            ${isExpanded ? "opacity-100" : "opacity-0"}
            lg:opacity-100`}
          >
            Shimulshop
          </span>
        </div>

        {isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
            className="lg:hidden text-slate-300 hover:text-white"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-2 py-4 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors w-full ${isActive
                  ? "bg-rose-600 text-white font-semibold"
                  : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              <span
                className={`whitespace-nowrap transition-opacity duration-300
                ${isExpanded ? "opacity-100" : "opacity-0"}
                lg:opacity-100`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-700 p-2">
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
        >
          <LogOut size={18} />
          <span
            className={`whitespace-nowrap transition-opacity duration-300
            ${isExpanded ? "opacity-100" : "opacity-0"}
            lg:opacity-100`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default UserDashboardNavbar;