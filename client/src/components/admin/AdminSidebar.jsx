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
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const menuItems = [
    { name: "Dashboard", icon: faHouse, path: "/admin" },
    { name: "Products", icon: faBox, path: "/admin/products" },
    { name: "Categories", icon: faList, path: "/admin/categories" },
    { name: "Orders", icon: faCartShopping, path: "/admin/orders" },
    { name: "Customers", icon: faUsers, path: "/admin/customers" },
    { name: "Coupons", icon: faPercent, path: "/admin/coupons" },
    { name: "Banner", icon: faImage, path: "/admin/banner" },
    { name: "Reviews", icon: faComment, path: "/admin/reviews" },
    { name: "Analytics", icon: faChartLine, path: "/admin/analytics" },
    { name: "Settings", icon: faGear, path: "/admin/settings" },
  ];

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b">
          <h2 className="text-xl font-bold text-blue-600">Admin Panel</h2>

          <button
            className="md:hidden text-gray-600 hover:text-gray-800"
            onClick={() => setSidebarOpen(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="text-xl" />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-64px)]">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <FontAwesomeIcon icon={item.icon} className="w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}