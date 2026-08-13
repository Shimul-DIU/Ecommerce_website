import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MapPin,
  User,
  Store,
} from "lucide-react";
import logout from '../../../context/AuthContext'
const UserDashboardNavbar = ({ isExpanded, setIsExpanded }) => {

  const navItems = [
    { to: "/userDashboard/user-overview", icon: LayoutDashboard, label: "Overview" },
    { to: "/userDashboard/user-orders", icon: ShoppingBag, label: "Orders" },
    { to: "/userDashboard/user-wishlist", icon: Heart, label: "Wishlist" },
    { to: "/userDashboard/user-addresses", icon: MapPin, label: "Addresses" },
    { to: "/userDashboard/user-profile", icon: User, label: "Profile" },
  ];

  // মেনু আইটেমে ক্লিক করলে সাইডবার বন্ধ করার জন্য ফাংশন
  const handleItemClick = (e) => {
    e.stopPropagation();
    if (setIsExpanded) setIsExpanded(false);
  };

  return (
    <aside
      onClick={() => setIsExpanded && setIsExpanded(true)}
      className={`sticky top-20 z-40 flex flex-col justify-between bg-white border-r border-slate-200 transition-all duration-300 h-[calc(100vh-5rem)] overflow-hidden py-4 ${
        isExpanded ? "w-64" : "w-13"
      } lg:w-60 cursor-pointer lg:cursor-default`}
    >
      <div className="flex flex-col w-full">
        {/* Header / Brand Logo */}
        <div className="flex items-center justify-between gap-2.5  mb-4 pb-3 border-b border-slate-100 overflow-hidden">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Store size={18} className="text-white" />
            </div>
            <span
              className={`whitespace-nowrap font-semibold text-slate-800 text-base transition-opacity duration-200 ${
                isExpanded ? "inline" : "hidden"
              } lg:inline`}
            >
              ShimulShop
            </span>
          </div>

          {/* Close Button for Mobile */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (setIsExpanded) setIsExpanded(false);
            }}
            className={`flex-shrink-0 w-7 h-7 rounded-lg items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors ${
              isExpanded ? "flex" : "hidden"
            } lg:hidden`}
          >
            <FontAwesomeIcon icon={faXmark} size="sm" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5 px-2 w-full">
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
                <span
                  className={`whitespace-nowrap transition-opacity duration-200 ${
                    isExpanded ? "inline" : "hidden"
                  } lg:inline`}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="border-t border-slate-100 pt-3 px-2 w-full">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (setIsExpanded) setIsExpanded(false);
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span onClick={()=>logout()}
            className={`whitespace-nowrap transition-opacity duration-200 ${
              isExpanded ? "inline" : "hidden"
            } lg:inline`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default UserDashboardNavbar;