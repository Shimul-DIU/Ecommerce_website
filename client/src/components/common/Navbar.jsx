import { useState, useRef, useContext, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBars,
  faCartShopping,
  faMicrophone,
  faSearch,
  faUser,
  faChevronDown,
  faHeart,
  faGlobe,
  faMoneyBillWave,
  faSignOutAlt,
  faBoxOpen,
  faUserShield
} from "@fortawesome/free-solid-svg-icons";
import { CountContext } from "../../context/countContext";
import { useScroll } from "../../hooks/useScroll";
import { AuthContext } from '../../context/AuthContext'
import { getInitials } from "../../utils/getInitials";

// ---- Consistent icon-size tokens (used everywhere instead of one-off text-lg/text-xl) ----
const ICON_SM = "text-[13px]";      // top utility bar (globe, currency)
const ICON_ACTION = "text-[18px] sm:text-[19px] md:text-[18px]"; // search / heart / cart / bars — same visual size everywhere
const AVATAR_SIZE = "w-7 h-7 sm:w-10 sm:h-10"; // avatar/fallback circle, same on mobile & desktop

const CountBadge = ({ count, color }) => {
  if (!count) return null;
  return (
    <span
      className={`absolute -top-1 -right-1 min-w-[16px] h-4 px-1 ${color} text-white text-[10px] font-semibold rounded-full flex items-center justify-center leading-none shadow-sm`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
};

const Navbar = ({ onMenuClick }) => {
  const { accessToken, logout, user } = useContext(AuthContext);

  const navigate = useNavigate();
  const isScrolled = useScroll();
  const { wishlist, cart } = useContext(CountContext);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Language & Currency
  const [language, setLanguage] = useState("EN");
  const [currency, setCurrency] = useState("BDT (৳)");

  const closeTimer = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: language === "BN" ? "হোম" : "Home", path: "/" },
    { name: language === "BN" ? "প্রোডাক্টস" : "Products", path: "/products" },
    { name: language === "BN" ? "ক্যাটাগরি" : "Categories", path: "/categories", dropdown: true },
    { name: language === "BN" ? "অফার" : "Offers", path: "/offers" },
    { name: language === "BN" ? "যোগাযোগ" : "Contact", path: "/contact" },
  ];

  const categoryItems = {
    perfume: ["Men's Perfume", "Women's Perfume"],
    jewellery: ["Ring", "Necklace", "Earring"],
    women: ["Dress", "Saree", "Bag", "Shoes"],
    men: ["T-Shirt", "Shirt", "Pant", "Shoes", "Watch"],
  };

  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current);
    setIsCategoryOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setIsCategoryOpen(false);
    }, 150);
  };

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setQuery("");
  };

  // User icon click handling logic
  const handleUserIconClick = (isMobile = false) => {
    if (!accessToken) {
      navigate("/login");
    } else {
      if (isMobile) {
        setMobileUserMenuOpen((prev) => !prev);
      } else {
        setIsUserMenuOpen((prev) => !prev);
      }
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    setIsUserMenuOpen(false);
    setMobileUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 translate-y-0">
      <div className="max-w-7xl mx-auto">
        {/* ================= TOP ANNOUNCEMENT & UTILITY BAR ================= */}
        <div
          className="max-w-7xl rounded-t-md mx-auto ps-6 bg-white border-b border-b-gray-300 text-slate-600 text-xs transition-all duration-300 overflow-hidden  lg:pt-1 h-5 md:h-6 pb-0.5 opacity-100"

        >
          <div className="flex items-center justify-between">
            <p className="hidden sm:block text-slate-500 bg-white">
              🚀 Free shipping on orders over ৳2000! Limited offer.
            </p>

            <div className="flex items-center justify-end gap-4 ml-auto">
              <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800 transition-colors">
                <FontAwesomeIcon icon={faGlobe} className={ICON_SM} />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer text-xs sm:text-sm text-slate-600"
                >
                  <option value="EN">English (EN)</option>
                  <option value="BN">বাংলা (BN)</option>
                </select>
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800 transition-colors">
                <FontAwesomeIcon icon={faMoneyBillWave} className={ICON_SM} />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer text-xs text-slate-600"
                >
                  <option value="BDT (৳)">BDT (৳)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MOBILE SEARCH ================= */}
        {searchOpen ? (
          <nav className="md:hidden bg-white px-3 md:px-6 py-3 flex items-center gap-3 rounded-b-md shadow-sm">
            <button
              onClick={handleSearchClose}
              aria-label="Close search"
              className="text-slate-700 hover:text-slate-900 transition-colors shrink-0 p-2 -m-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} className={ICON_ACTION} />
            </button>
            <div className="flex-1 flex items-center bg-slate-50 rounded-full pl-4 pr-2 h-10 shadow-sm border border-slate-200">
              <FontAwesomeIcon icon={faSearch} className="text-slate-400 text-sm mr-2 shrink-0" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                className="flex-1 h-full outline-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <button
              aria-label="Voice search"
              className="text-slate-700 hover:text-slate-900 transition-colors shrink-0 p-2 -m-2"
            >
              <FontAwesomeIcon icon={faMicrophone} className={ICON_ACTION} />
            </button>
          </nav>
        ) : (
          <>
            {/* ================= DESKTOP NAVBAR ================= */}
            <div
              className={`hidden max-w-7xl rounded-b-md mx-auto md:px-6 md:block bg-white shadow-sm transition-all duration-300 h-14
                `}
            >
              <nav className="h-full flex items-center gap-8">
                <Link to="/" className="shrink-0 flex items-center">
                  <img src={logo} alt="logo" className={`transition-all duration-300 h-10`} />
                </Link>

                {/* Search Bar */}
                <div className="flex-1 flex justify-center">
                  <div
                    className={`flex items-center border rounded-full px-4 h-10 w-full max-w-sm transition-all duration-200 ${searchFocused
                      ? "ring-2 ring-blue-500/40 border-blue-500 bg-white"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                  >
                    <FontAwesomeIcon icon={faSearch} className="text-slate-400 text-sm mr-2.5 shrink-0" />
                    <input
                      type="text"
                      placeholder={language === "BN" ? "পণ্য খুঁজুন..." : "Search products..."}
                      className="flex-1 h-full outline-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400"
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                    />
                  </div>
                </div>

                {/* Navigation Links & Action Icons */}
                <div className="flex items-center gap-6 shrink-0">
                  <div className="flex items-center gap-6 text-sm sm:text-base font-medium ">
                    {navItems.map((item) => (
                      <div
                        key={item.path}
                        className="relative"
                        onMouseEnter={item.dropdown ? handleMouseEnter : undefined}
                        onMouseLeave={item.dropdown ? handleMouseLeave : undefined}
                      >
                        {item.dropdown ? (
                          <>
                            <button
                              className="flex items-center gap-1.5 py-5 hover:text-blue-600 transition-colors"
                              aria-expanded={isCategoryOpen}
                            >
                              {item.name}
                              <FontAwesomeIcon
                                icon={faChevronDown}
                                className={`text-[10px] transition-transform duration-200 ${isCategoryOpen ? "rotate-180 text-blue-600" : "text-slate-400"
                                  }`}
                              />
                            </button>

                            {isCategoryOpen && (
                              <div
                                className="absolute top-full left-1/2 -translate-x-1/2 mt-0 bg-white shadow-xl rounded-xl py-5 px-2 border border-slate-100 z-50"
                                style={{ width: "440px" }}
                              >
                                <div className="grid grid-cols-2 gap-x-2 gap-y-5">
                                  {Object.entries(categoryItems).map(([category, items]) => (
                                    <div key={category} className="px-3">
                                      <div className="font-semibold text-slate-900 capitalize text-xs tracking-wide mb-2">
                                        {category}
                                      </div>
                                      <div className="flex flex-col gap-1.5">
                                        {items.map((subItem) => (
                                          <Link
                                            key={subItem}
                                            to={`/${category}/${subItem.toLowerCase().replace(/ /g, "-")}`}
                                            onClick={() => setIsCategoryOpen(false)}
                                            className="text-sm text-slate-500 hover:text-blue-600 transition-colors w-fit"
                                          >
                                            {subItem}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <NavLink
                            to={item.path}
                            onClick={() => setIsCategoryOpen(false)}
                            className={({ isActive }) =>
                              `relative py-5 block transition-colors ${isActive
                                ? "text-blue-600 after:absolute after:left-0 after:right-0 after:-bottom-px after:h-0.5 "
                                : "hover:text-blue-600"
                              }`
                            }
                          >
                            {item.name}
                          </NavLink>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-slate-600">
                    <Link
                      to="/userDashboard/wishlist"
                      className="relative hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-slate-50"
                      aria-label="Wishlist"
                    >
                      <FontAwesomeIcon icon={faHeart} className={ICON_ACTION} />
                      <CountBadge count={wishlist.length} color="bg-red-500" />
                    </Link>

                    <Link
                      to="/userDashboard/cart"
                      className="relative hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-slate-50"
                      aria-label="Cart"
                    >
                      <FontAwesomeIcon icon={faCartShopping} className={ICON_ACTION} />
                      <CountBadge count={cart.length} color="bg-blue-600" />
                    </Link>

                    {/* DESKTOP USER MENU */}
                    <div className="relative ml-1" onMouseLeave={() => setIsUserMenuOpen(false)}>
                      <div
                        onClick={() => handleUserIconClick(false)}
                        className="cursor-pointer"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded={isUserMenuOpen}
                        aria-label="User menu"
                      >
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.fullname}
                            className={`${AVATAR_SIZE} rounded-full object-cover`}
                          />
                        ) : (
                          <div className={`cursor-pointer ${AVATAR_SIZE} rounded-full bg-blue-600 text-white flex items-center justify-center text-sm`}>
                            {getInitials(user?.fullname)}
                          </div>
                        )}
                      </div>

                      {/* শুধুমাত্র accessToken থাকলেই ড্রপডাউন রেন্ডার হবে */}
                      {accessToken && isUserMenuOpen && (
                        <div className="absolute -right-2 top-full border w-48 bg-white rounded-xl shadow-xl z-50 text-sm">
                          <Link
                            to="/userDashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <FontAwesomeIcon icon={faUser} className="text-xs w-3.5" /> My Profile
                          </Link>
                          <Link
                            to="/admin/login"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <FontAwesomeIcon icon={faUserShield} className="text-xs w-3.5" /> Admin
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <FontAwesomeIcon icon={faBoxOpen} className="text-xs w-3.5" /> Orders
                          </Link>
                          <hr className="my-1 border-slate-100" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-500 hover:bg-slate-50 text-left transition-colors"
                          >
                            <FontAwesomeIcon icon={faSignOutAlt} className="text-xs w-3.5" /> Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </nav>
            </div>

            {/* ================= MOBILE TOP NAVBAR ================= */}
            <nav className="md:hidden h-12 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-3 transition-all duration-300">
              <Link to="/">
                <img src={logo} alt="logo" className="transition-all basis-2/6 duration-300 h-10 sm:h-11" />
              </Link>

              <div className="flex items-center justify-around basis-4/6 gap-1 text-slate-700">
                <button
                  onClick={handleSearchOpen}
                  aria-label="Search"
                  className=" rounded-full hover:bg-slate-50"
                >
                  <FontAwesomeIcon icon={faSearch} className={ICON_ACTION} />
                </button>

                <Link
                  to="/userDashboard/wishlist"
                  className="relative p-1 rounded-full hover:bg-slate-50 hover:text-blue-600 transition-colors"
                  aria-label="Wishlist"
                >
                  <FontAwesomeIcon icon={faHeart} className={ICON_ACTION} />
                  <CountBadge count={wishlist.length} color="bg-red-500" />
                </Link>

                <Link
                  to="/userDashboard/cart"
                  className="relative p-1 rounded-full hover:bg-slate-50 hover:text-blue-600 transition-colors"
                  aria-label="Cart"
                >
                  <FontAwesomeIcon icon={faCartShopping} className={ICON_ACTION} />
                  <CountBadge count={cart.length} color="bg-blue-600" />
                </Link>

                {/* MOBILE USER MENU (DROPDOWN) */}
                <div className="flex items-center relative" ref={mobileMenuRef}>
                  <div
                    onClick={() => handleUserIconClick(true)}
                    className="cursor-pointer p-1"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded={mobileUserMenuOpen}
                    aria-label="User menu"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullname}
                        className={`${AVATAR_SIZE} rounded-full object-cover`}
                      />
                    ) : (
                      <div className={`cursor-pointer ${AVATAR_SIZE} rounded-full bg-blue-600 text-white flex items-center justify-center text-sm`}>
                        {getInitials(user?.fullname)}
                      </div>
                    )}
                  </div>

                  {/* শুধুমাত্র accessToken থাকলেই ড্রপডাউন রেন্ডার হবে */}
                  {accessToken && mobileUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-100 rounded-lg shadow-xl z-50 text-sm overflow-hidden">
                      <Link
                        to="/userDashboard"
                        onClick={() => setMobileUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <FontAwesomeIcon icon={faUser} className="text-sm w-4 text-slate-400" /> My Profile
                      </Link>
                      <Link
                        to="/admin/login"
                        onClick={() => setMobileUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <FontAwesomeIcon icon={faUserShield} className="text-sm w-4 text-slate-400" /> Admin
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setMobileUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <FontAwesomeIcon icon={faBoxOpen} className="text-sm w-4 text-slate-400" /> Orders
                      </Link>
                      <hr className="my-0.5 border-slate-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-500 hover:bg-slate-50 text-left transition-colors"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-sm w-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>

                <button onClick={onMenuClick} aria-label="Open menu" className=" rounded-full hover:bg-slate-50 text-slate-700">
                  <FontAwesomeIcon icon={faBars} className={ICON_ACTION} />
                </button>
              </div>
            </nav>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
