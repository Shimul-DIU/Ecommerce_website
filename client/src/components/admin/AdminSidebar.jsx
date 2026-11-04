import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faBox,
  faList,
  faCartShopping,
  faUsers,
  faPercent,
  faImage,
  faComment,
  faChartLine,
  faGear,
  faXmark,
  faStore,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, Link } from "react-router-dom";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const menuGroups = [
    {
      title: "Main",
      items: [{ name: "Dashboard", icon: faHouse, path: "/admin" }],
    },
    {
      title: "Store",
      items: [
        { name: "Products", icon: faBox, path: "/admin/products" },
        { name: "Categories", icon: faList, path: "/admin/categories" },
        { name: "Orders", icon: faCartShopping, path: "/admin/orders" },
        { name: "Customers", icon: faUsers, path: "/admin/customers" },
      ],
    },
    {
      title: "Marketing",
      items: [
        { name: "Coupons", icon: faPercent, path: "/admin/coupons" },
        { name: "Banner", icon: faImage, path: "/admin/banner" },
        { name: "Reviews", icon: faComment, path: "/admin/reviews" },
      ],
    },
    {
      title: "System",
      items: [
        { name: "Analytics", icon: faChartLine, path: "/admin/analytics" },
        { name: "Settings", icon: faGear, path: "/admin/settings" },
      ],
    },
  ];

  return (
    <>
      {/* Overlay (mobile) */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-64 flex-col bg-[#16241F] shadow-2xl transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header / Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#FAF6EF]/10 px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B08946] text-[#16241F] shadow-md ring-2 ring-[#FAF6EF]/20">
              <FontAwesomeIcon icon={faStore} className="text-base" />
            </span>
            <div className="leading-tight">
              <h2 className="text-base font-extrabold tracking-wide text-[#FAF6EF]">
                Admin Panel
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#B08946]">
                Management
              </p>
            </div>
          </div>

          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#FAF6EF]/70 transition-colors hover:bg-white/10 hover:text-[#B08946] md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FontAwesomeIcon icon={faXmark} className="text-lg" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FAF6EF]/35">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/admin"}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-[#B08946] to-[#C49A52] text-[#16241F] shadow-lg shadow-[#B08946]/20"
                          : "text-[#FAF6EF]/70 hover:bg-white/5 hover:text-[#FAF6EF]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Left active bar */}
                        <span
                          className={`absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#B08946] transition-opacity duration-200 ${
                            isActive ? "opacity-100" : "opacity-0"
                          }`}
                        />

                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm transition-colors duration-200 ${
                            isActive
                              ? "bg-[#16241F]/15 text-[#16241F]"
                              : "bg-white/5 text-[#B08946] group-hover:bg-[#B08946]/15"
                          }`}
                        >
                          <FontAwesomeIcon icon={item.icon} />
                        </span>

                        <span className="flex-1 truncate">{item.name}</span>

                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#16241F]" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#FAF6EF]/10 p-4">
          <Link
            to="/"
            className="flex items-center justify-between rounded-xl border border-[#B08946]/40 bg-white/5 px-4 py-2.5 text-sm font-semibold text-[#FAF6EF] transition-all duration-200 hover:border-[#B08946] hover:bg-[#B08946] hover:text-[#16241F]"
          >
            <span className="flex items-center gap-2.5">
              <FontAwesomeIcon icon={faStore} className="text-xs" />
              View Store
            </span>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
          </Link>
          <p className="mt-3 text-center text-[10px] text-[#FAF6EF]/30">
            © 2026 Admin Panel
          </p>
        </div>
      </aside>
    </>
  );
}