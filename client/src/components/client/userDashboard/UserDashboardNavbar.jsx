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

const navItems = [
  { to: "/userDashboard/user-overview", icon: LayoutDashboard, label: "Overview" },
  { to: "/userDashboard/user-orders", icon: Package, label: "Orders" },
  { to: "/userDashboard/cart", icon: ShoppingBag, label: "Cart" },
  { to: "/userDashboard/wishlist", icon: Heart, label: "Wishlist" },
  { to: "/userDashboard/user-addresses", icon: MapPin, label: "Addresses" },
];

const UserDashboardNavbar = ({ setIsExpanded }) => {
  const { logout } = useContext(AuthContext);

  const closeOnMobile = () => {
    if (setIsExpanded && window.innerWidth < 640) setIsExpanded(false);
  };

  const handleItemClick = (e) => {
    e.stopPropagation();
    closeOnMobile();
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    closeOnMobile();
    if (typeof logout === "function") logout();
  };

  return (
    <>
      {/* ==========================================
          1. MOBILE BOTTOM BAR (< sm screens)
         ========================================== */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E4DDCE] bg-white/95 shadow-[0_-4px_20px_rgba(22,36,31,0.08)] backdrop-blur sm:hidden">
        <div className="flex items-stretch justify-between px-1 pb-[env(safe-area-inset-bottom)]">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleItemClick}
                title={item.label}
                className={({ isActive }) =>
                  `relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors duration-200 ${
                    isActive
                      ? "text-[#B08946]"
                      : "text-[#16241F]/50 hover:text-[#16241F]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute top-0 h-0.5 w-8 rounded-full bg-[#B08946]" />
                    )}
                    <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
                    <span className="text-[10px] font-semibold">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-red-500 transition-colors hover:text-red-600"
          >
            <LogOut size={20} strokeWidth={2} />
            <span className="text-[10px] font-semibold">Logout</span>
          </button>
        </div>
      </nav>

      {/* ==========================================
          2. DESKTOP SIDEBAR (>= sm screens)
         ========================================== */}
      <aside className="sticky top-0 z-40 hidden h-screen w-64 shrink-0 flex-col justify-between overflow-hidden bg-[#16241F] p-4 text-[#FAF6EF] sm:flex md:pt-6">
        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#B08946]/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-[#B08946]/10" />

        <div className="relative z-10 flex w-full flex-col">
          {/* Logo Section */}
          <div className="mb-6 flex items-center gap-3 border-b border-white/10 px-2 pb-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#B08946] text-[#16241F] shadow-lg shadow-black/20">
              <Store size={22} />
            </div>

            <div className="leading-tight">
              <span className="block whitespace-nowrap text-lg font-bold tracking-tight">
                ShimulShop
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B08946]">
                User Panel
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex w-full flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleItemClick}
                  className={({ isActive }) =>
                    `group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#B08946] font-bold text-[#16241F] shadow-md"
                        : "text-[#FAF6EF]/70 hover:bg-white/10 hover:text-[#FAF6EF]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute -left-4 h-6 w-1 rounded-r-full bg-[#FAF6EF]" />
                      )}
                      <Icon
                        size={20}
                        strokeWidth={2}
                        className={`shrink-0 transition-transform duration-200 ${
                          isActive ? "" : "group-hover:scale-110"
                        }`}
                      />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="relative z-10 w-full border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/15 hover:text-red-200"
          >
            <LogOut size={20} strokeWidth={2} className="shrink-0" />
            <span className="whitespace-nowrap">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default UserDashboardNavbar;