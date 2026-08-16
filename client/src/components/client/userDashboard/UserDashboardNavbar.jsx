import { NavLink } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MapPin,
  Package,
  Store,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const UserDashboardNavbar = ({ isExpanded = true, setIsExpanded }) => {
  const { logout } = useContext(AuthContext);

  const navItems = [
    { to: "/userDashboard/user-overview", icon: LayoutDashboard, label: "Overview" },
    { to: "/userDashboard/user-orders", icon: Package, label: "Orders" },
    { to: "/userDashboard/cart", icon: ShoppingBag, label: "Card" },
    { to: "/userDashboard/wishlist", icon: Heart, label: "Wishlist" },
    { to: "/userDashboard/user-addresses", icon: MapPin, label: "Addresses" },
    // { to: "/userDashboard/user-profile", icon: , label: "Profile" },
  ];

  const handleItemClick = (e) => {
    e.stopPropagation();
    // Mobile-এ ক্লিক করলে বন্ধ হবে, desktop-এ না চাইলে condition উঠিয়ে দিতে পারেন
    if (setIsExpanded && window.innerWidth < 640) setIsExpanded(false);
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    if (setIsExpanded && window.innerWidth < 640) setIsExpanded(false);
    if (typeof logout === "function") logout();
  };

  return (
    <aside
      className={`sticky top-0 md:mt-4 lg:mt-6 z-40 bg-white border-b sm:border-b-0 sm:border-r border-slate-200 transition-all duration-300 w-full sm:h-screen ${isExpanded ? "sm:w-64" : "sm:w-64" /* ডেস্কটপে সব সময় চওড়া (w-64) রাখতে চাইলে */
        } sm:flex sm:flex-col sm:justify-between sm:p-4`}
    >
      {/* ==========================================
          1. MOBILE LAYOUT (< sm screens)
         ========================================== */}
      <div className="sm:hidden min-w-full  bg-white">
        <nav className="flex items-center justify-between gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 w-full h-12">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleItemClick}
                title={item.label}
                className={({ isActive }) =>
                  `flex items-center justify-center flex-1 h-9 rounded-lg transition-all duration-200 ${isActive
                    ? " text-blue-600 scale-105"
                    : "text-slate-500 hover:bg-slate-200/60 hover:text-slate-800"
                  }`
                }
              >
                <Icon size={18} />
              </NavLink>
            );
          })}

          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center justify-center flex-1 h-9 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </nav>
      </div>

      {/* ==========================================
          2. DESKTOP SIDEBAR (>= sm screens)
         ========================================== */}
      <div className="hidden sm:flex sm:flex-col sm:justify-between h-full w-full bg-white">
        <div className="flex flex-col w-full ">
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 px-2">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Store size={20} className="text-white" />
            </div>
            <span className="whitespace-nowrap font-bold text-slate-800 text-lg tracking-tight">
              ShimulShop
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5 w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleItemClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full ${isActive
                      ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                    }`
                  }
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="whitespace-nowrap">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="border-t border-slate-100 pt-3 w-full">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="whitespace-nowrap">
              Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default UserDashboardNavbar;