import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faBell,
  faGear,
  faUser,
  faChevronDown,
  faSignOutAlt,
  faXmark,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PAGE_TITLES = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/orders": "Orders",
  "/admin/customers": "Customers",
  "/admin/coupons": "Coupons",
  "/admin/banner": "Banner",
  "/admin/reviews": "Reviews",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Settings",
};

const iconBtn =
  "relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E4DDCE] bg-white text-[#16241F]/70 transition-all duration-200 hover:border-[#B08946] hover:bg-[#B08946] hover:text-[#16241F]";

export default function AdminNavbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutAdmin } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");

  const profileRef = useRef(null);
  const desktopInputRef = useRef(null);

  const pageTitle = PAGE_TITLES[location.pathname] || "Admin Panel";

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login");
  };

  // ================= SEARCH =================
  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(
      q ? `/admin/products?search=${encodeURIComponent(q)}` : "/admin/products"
    );
    setMobileSearch(false);
  };

  const clearSearch = () => {
    setQuery("");
    if (location.pathname === "/admin/products") {
      navigate("/admin/products");
    }
    desktopInputRef.current?.focus();
  };

  // URL এর search এর সাথে নাভবারের বক্স মিলিয়ে রাখে
  useEffect(() => {
    if (location.pathname === "/admin/products") {
      const params = new URLSearchParams(location.search);
      setQuery(params.get("search") || "");
    } else {
      setQuery("");
    }
  }, [location.pathname, location.search]);

  // বাইরে ক্লিক, Esc, আর Ctrl+K হ্যান্ডেল
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setMobileSearch(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        // ডেস্কটপ সার্চ দেখা গেলে সেখানে ফোকাস, না হলে মোবাইল সার্চ খুলবে
        if (desktopInputRef.current?.offsetParent !== null) {
          desktopInputRef.current.focus();
        } else {
          setMobileSearch(true);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-40 flex h-16 w-full items-center justify-between gap-3 border-b-2 border-[#B08946] bg-[#FAF6EF] px-3 shadow-md sm:px-4 md:px-6">
      {/* ================= LEFT ================= */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          aria-label="Open sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16241F] text-[#B08946] shadow-sm transition-colors hover:bg-[#B08946] hover:text-[#16241F] md:hidden"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* Page title */}
        <div className="leading-tight">
          <p className="hidden text-[10px] font-bold uppercase tracking-[0.22em] text-[#B08946] sm:block">
            Admin Panel
          </p>
          <h1 className="text-base font-extrabold text-[#16241F] sm:text-lg">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* ================= CENTER SEARCH (DESKTOP) ================= */}
      <form
        onSubmit={handleSearch}
        className="hidden w-full max-w-md flex-1 md:block"
      >
        <div
          className={`flex h-11 items-center overflow-hidden rounded-full bg-white transition-all duration-200 ${
            searchFocused
              ? "ring-2 ring-[#B08946] shadow-[0_0_0_4px_rgba(176,137,70,0.2)]"
              : "ring-1 ring-[#B08946]/30"
          }`}
        >
          <button
            type="submit"
            aria-label="Search"
            className="ml-4 shrink-0 text-sm text-[#B08946] transition-colors hover:text-[#16241F]"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>

          <input
            ref={desktopInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="h-full w-full flex-1 bg-transparent px-3 text-sm text-[#16241F] outline-none placeholder:text-[#16241F]/40"
          />

          {query ? (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="mr-3 flex h-6 w-6 items-center justify-center rounded-full text-[#16241F]/50 transition-colors hover:bg-[#FAF6EF] hover:text-[#16241F]"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xs" />
            </button>
          ) : (
            <kbd className="mr-3 hidden rounded-md border border-[#E4DDCE] bg-[#FAF6EF] px-2 py-0.5 text-[10px] font-semibold text-[#16241F]/50 lg:block">
              Ctrl K
            </kbd>
          )}
        </div>
      </form>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Mobile search toggle */}
        <button
          onClick={() => setMobileSearch((p) => !p)}
          aria-label="Search"
          className={`${iconBtn} md:hidden`}
        >
          <FontAwesomeIcon icon={mobileSearch ? faXmark : faSearch} />
        </button>

        {/* View store */}
        <Link
          to="/"
          title="View Store"
          className={`${iconBtn} hidden sm:flex`}
          aria-label="View store"
        >
          <FontAwesomeIcon icon={faStore} />
        </Link>

        {/* Notifications */}
        <button className={iconBtn} aria-label="Notifications">
          <FontAwesomeIcon icon={faBell} />
          <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-extrabold leading-none text-white ring-2 ring-[#FAF6EF]">
            3
          </span>
        </button>

        {/* Settings */}
        <Link
          to="/admin/settings"
          className={`${iconBtn} hidden sm:flex`}
          aria-label="Settings"
        >
          <FontAwesomeIcon icon={faGear} />
        </Link>

        {/* Profile */}
        <div
          ref={profileRef}
          className="relative ml-1 border-l border-[#16241F]/15 pl-2.5 sm:pl-3"
        >
          <button
            onClick={() => setProfileOpen((p) => !p)}
            aria-haspopup="true"
            aria-expanded={profileOpen}
            className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-white sm:pr-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#16241F] text-[#B08946] ring-2 ring-[#B08946]">
              <FontAwesomeIcon icon={faUser} className="text-sm" />
            </span>

            <span className="hidden text-left leading-tight lg:block">
              <span className="block text-sm font-bold text-[#16241F]">Admin</span>
              <span className="block text-[10px] uppercase tracking-wider text-[#B08946]">
                Administrator
              </span>
            </span>

            <FontAwesomeIcon
              icon={faChevronDown}
              className={`text-[10px] text-[#16241F]/60 transition-transform duration-200 ${
                profileOpen ? "rotate-180 text-[#B08946]" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-[#E4DDCE] bg-white text-sm shadow-2xl">
              <div className="bg-[#16241F] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#B08946]">
                  Welcome
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-[#FAF6EF]">
                  Admin
                </p>
              </div>

              <Link
                to="/admin/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[#16241F] transition-colors hover:bg-[#FAF6EF] hover:text-[#B08946]"
              >
                <FontAwesomeIcon icon={faUser} className="w-4 text-xs text-[#B08946]" />
                My Profile
              </Link>

              <Link
                to="/admin/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[#16241F] transition-colors hover:bg-[#FAF6EF] hover:text-[#B08946]"
              >
                <FontAwesomeIcon icon={faGear} className="w-4 text-xs text-[#B08946]" />
                Settings
              </Link>

              <Link
                to="/"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[#16241F] transition-colors hover:bg-[#FAF6EF] hover:text-[#B08946]"
              >
                <FontAwesomeIcon icon={faStore} className="w-4 text-xs text-[#B08946]" />
                View Store
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 border-t border-[#E4DDCE]/70 px-4 py-2.5 text-left text-red-500 transition-colors hover:bg-red-50"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="w-4 text-xs" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= MOBILE SEARCH ================= */}
      {mobileSearch && (
        <form
          onSubmit={handleSearch}
          className="absolute left-0 top-full w-full border-b-2 border-[#B08946] bg-[#FAF6EF] p-3 shadow-lg md:hidden"
        >
          <div className="flex h-11 items-center overflow-hidden rounded-full bg-white ring-1 ring-[#B08946]/40">
            <button
              type="submit"
              aria-label="Search"
              className="ml-4 shrink-0 text-sm text-[#B08946]"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="h-full w-full bg-transparent px-3 text-sm text-[#16241F] outline-none placeholder:text-[#16241F]/40"
            />
          </div>
        </form>
      )}
    </nav>
  );
}