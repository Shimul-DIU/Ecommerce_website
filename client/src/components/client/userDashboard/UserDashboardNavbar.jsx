import { NavLink } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MapPin,
  User,
  Store,
} from "lucide-react";
import logout from "../../../context/AuthContext";

const UserDashboardNavbar = ({ isExpanded, setIsExpanded }) => {
  const navItems = [
    { to: "/userDashboard/user-overview", icon: LayoutDashboard, label: "Overview" },
    { to: "/userDashboard/user-orders", icon: ShoppingBag, label: "Orders" },
    { to: "/userDashboard/user-wishlist", icon: Heart, label: "Wishlist" },
    { to: "/userDashboard/user-addresses", icon: MapPin, label: "Addresses" },
    { to: "/userDashboard/user-profile", icon: User, label: "Profile" },
  ];

  const handleItemClick = (e) => {
    e.stopPropagation();
    if (setIsExpanded) setIsExpanded(false);
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    if (setIsExpanded) setIsExpanded(false);
    if (typeof logout === "function") logout();
  };

  return (
    <aside
      className={`sticky top-0 lg:top-20 z-40 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 transition-all duration-300 w-full lg:h-[calc(100vh-5rem)] ${
        isExpanded ? "lg:w-64" : "lg:w-20"
      } lg:flex lg:flex-col lg:justify-between lg:py-4 `}
    >
      {/* ==========================================
          MOBILE & TABLET LAYOUT (Single Row, Small Height, Full Width)
         ========================================== */}
      <div className="sm:hidden w-full">
        <nav className="flex items-center justify-between gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 w-full h-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleItemClick}
                title={item.label}
                className={({ isActive }) =>
                  `flex items-center justify-center flex-1 h-8 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-200 scale-105"
                      : "text-slate-500 hover:bg-slate-200/60 hover:text-slate-800"
                  }`
                }
              >
                <Icon size={17} />

              </NavLink>
            );
          })}

          {/* Logout Icon */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center justify-center flex-1 h-8 rounded-lg text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
          >
            <LogOut size={17} />
          </button>
        </nav>
      </div>

      {/* ==========================================
          DESKTOP SIDEBAR LAYOUT (lg:flex)
         ========================================== */}
      <div  className="hidden sm:flex sm:flex-col sm:justify-between h-full min-w-80 bg-blue-400">
        <div className="flex flex-col w-full">

          <div className="flex items-center justify-between gap-2.5 mb-4 pb-3 border-b border-slate-100 px-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
                <Store size={18} className="text-white" />
              </div>
              {isExpanded && (
                <span className="whitespace-nowrap font-bold text-slate-800 text-base tracking-tight transition-opacity duration-200">
                  ShimulShop
                </span>
              )}
            </div>
          </div>

          <nav className="flex flex-col gap-1.5 w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleItemClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                    }`
                  }
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {isExpanded && (
                    <span className="whitespace-nowrap transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-100 pt-3 w-full">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {isExpanded && (
              <span className="whitespace-nowrap transition-opacity duration-200">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default UserDashboardNavbar;