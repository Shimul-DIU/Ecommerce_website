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

const ICON_SM = "text-xs";
const ICON_ACTION = "text-lg sm:text-xl md:text-lg";
const AVATAR_SIZE = "w-7 h-7 sm:w-10 sm:h-10";

const CountBadge = ({ count, color }) => {
  if (!count) return null;
  return (
    <span
      className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 text-white text-[10px] font-semibold rounded-full flex items-center justify-center leading-none shadow-sm"
      style={{ background: color }}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
};

const Navbar = ({ onMenuClick }) => {
  const { accessToken, logout, user } = useContext(AuthContext);

  const navigate = useNavigate();
  const isScrolled = useScroll(); // true যখন স্ক্রল ডাউন, false যখন উপরে
  const { wishlist, cart } = useContext(CountContext);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  const [language, setLanguage] = useState("EN");
  const [currency, setCurrency] = useState("BDT (৳)");

  const closeTimer = useRef(null);
  const mobileMenuRef = useRef(null);

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
    { name: language === "BN" ? "সব ক্যাটাগরি" : "All Categories", path: "/categories", dropdown: true },
    { name: language === "BN" ? "হোম" : "Home", path: "/" },
    { name: language === "BN" ? "পণ্যসমূহ" : "Products", path: "/products" },
    { name: language === "BN" ? "পুরুষ" : "Men", path: "/men" },
    { name: language === "BN" ? "নারী" : "Women", path: "/women" },
    { name: language === "BN" ? "মাছ ধরা" : "Fishing", path: "/fishing" },
    { name: language === "BN" ? "অফার" : "Offers", path: "/offers" },
  ];

  const categoryItems = {
    perfume: ["Men's Perfume", "Women's Perfume"],
    jewellery: ["Ring", "Necklace", "Earring"],
    women: ["Dress", "Saree", "Bag", "Shoes"],
    men: ["T-Shirt", "Shirt", "Pant", "Shoes", "Watch"],
    fishing: ['reel', 'wheel', 'rod', 'hook']
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

  const handleSearchOpen = () => setSearchOpen(true);
  const handleSearchClose = () => {
    setSearchOpen(false);
    setQuery("");
  };

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

  // স্ক্রল ডাউন করলে লুকাবে, স্ক্রল আপ করলে দেখাবে
  const collapsedClass = isScrolled
    ? "max-h-0 opacity-0 py-0 pointer-events-none overflow-hidden"
    : "max-h-20 opacity-100";

  const toggleMobileCategory = () => {
    setMobileCategoryOpen(!mobileCategoryOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 translate-y-0">
      <div className="max-w-7xl mx-auto">
        {/* ================= TOP UTILITY BAR ================= */}
        <div
          className={`max-w-7xl rounded-t-md mx-auto px-1 sm:px-2 md:px-4 lg:px-6 bg-white border-b border-gray-200 text-slate-500 text-xs transition-all duration-300 ${collapsedClass}`}
        >
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-1 text-xs">
              <Link to="/help" className="hover:text-orange-500 transition-colors">Help</Link>
              <span className="text-slate-300">|</span>
              <Link to="/support" className="hover:text-orange-500 transition-colors">Support</Link>
              <span className="text-slate-300">|</span>
              <Link to="/contact" className="hover:text-orange-500 transition-colors">Contact</Link>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 text-xs">
              <div className="flex items-center cursor-pointer hover:text-orange-500 transition-colors">
                <FontAwesomeIcon icon={faGlobe} className="text-orange-500" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer text-xs sm:text-xs text-slate-500"
                >
                  <option value="EN">English (EN)</option>
                  <option value="BN">বাংলা (BN)</option>
                </select>
              </div>

              <div className="flex items-center cursor-pointer hover:text-orange-500 transition-colors">
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-orange-500" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer text-xs text-slate-500"
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
          <nav className="md:hidden bg-white px-3 md:px-6 py-3 flex items-center gap-3 shadow-sm">
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
            {/* ================= DESKTOP NAVBAR (2 ROWS) ================= */}
            <div className="hidden max-w-7xl mx-auto md:block bg-white">
              {/* ROW 1: Logo + Search + Actions (সবসময় visible) */}
              <nav className={`h-14 flex items-center px-5 ${isScrolled ? 'bg-white' : 'bg-white'} gap-8`}>
                <Link to="/" className="shrink-0 flex items-center">
                  <img src={logo} alt="logo" className="transition-all duration-300 h-10" />
                </Link>

                <div className="flex-1 flex justify-center">
                  <div
                    className={`flex items-center border rounded-full h-10 w-full max-w-sm transition-all duration-200 overflow-hidden ${searchFocused ? "border-orange-500 shadow-[0_0_0_2px_rgba(242,139,0,0.2)]" : "border-gray-200"
                      }`}
                  >
                    <FontAwesomeIcon icon={faSearch} className="text-slate-400 text-sm ml-4 shrink-0" />
                    <input
                      type="text"
                      placeholder={language === "BN" ? "পণ্য খুঁজুন..." : "Search products..."}
                      className="flex-1 h-full outline-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 px-2.5"
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                    />
                    <button
                      type="button"
                      className="h-full px-4 text-white text-sm shrink-0 transition-colors bg-orange-500 hover:bg-red-500"
                    >
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-500 shrink-0">
                  <Link
                    to="/userDashboard/wishlist"
                    className="relative transition-colors p-2 rounded-full hover:bg-slate-50 hover:text-orange-500"
                    aria-label="Wishlist"
                  >
                    <FontAwesomeIcon icon={faHeart} className={ICON_ACTION} />
                    <CountBadge count={wishlist.length} color="#F92400" />
                  </Link>

                  <Link
                    to="/userDashboard/cart"
                    className="relative transition-colors p-2 rounded-full hover:bg-slate-50 hover:text-orange-500"
                    aria-label="Cart"
                  >
                    <FontAwesomeIcon icon={faCartShopping} className={ICON_ACTION} />
                    <CountBadge count={cart.length} color="#F28B00" />
                  </Link>

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
                        <div
                             title={user?.fullname}
                          className={`cursor-pointer ${AVATAR_SIZE} rounded-full text-white flex items-center justify-center text-sm bg-orange-500`}
                        >
                          {getInitials(user?.fullname)}
                        </div>
                      )}
                    </div>

                    {accessToken && isUserMenuOpen && (
                      <div className="absolute -right-2  top-full border w-48 bg-white rounded-xl shadow-xl z-50 text-sm">
                        <Link
                          to="/userDashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <FontAwesomeIcon icon={faUser} className="text-xs w-3.5 text-orange-500" /> My Profile
                        </Link>
                        <Link
                          to="/admin/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <FontAwesomeIcon icon={faUserShield} className="text-xs w-3.5 text-orange-500" /> Admin
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <FontAwesomeIcon icon={faBoxOpen} className="text-xs w-3.5 text-orange-500" /> Orders
                        </Link>
                        <hr className="my-1 border-slate-100" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors text-red-500"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="text-xs w-3.5" /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </nav>

              {/* ROW 2: Nav Items (orange background) - স্ক্রল ডাউনে লুকায়, উপরে এলেই দেখায় */}
              <div
                className={`overflow-visible transition-all duration-300 bg-orange-500 ${collapsedClass}`}
              >
                <div className="flex items-center justify-between gap-2 text-sm sm:text-base font-medium h-11 md:h-12 lg:h-13 px-4">
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
                            className={`flex items-center gap-1.5 transition-colors text-black/60 hover:text-white ${item.name === 'All Categories' || item.name === 'সব ক্যাটাগরি'
                              ? 'text-xl md:text-2xl ms-3 text-white'
                              : 'text-base'
                              }`}
                            aria-expanded={isCategoryOpen}
                          >
                            {item.name}
                            <FontAwesomeIcon
                              icon={faChevronDown}
                              className={`text-base transition-transform duration-200 ${isCategoryOpen ? "rotate-180 text-white" : ""
                                }`}
                            />
                          </button>

                          {isCategoryOpen && (
                            <div
                              className="absolute top-10 translate-x-0 mt-0 shadow-xl rounded-xl py-5 px-2 border border-slate-100 z-50"
                              style={{ width: "440px", background: "#F5F5F5" }}
                            >
                              <div className="grid grid-cols-5 gap-3">
                                {Object.entries(categoryItems).map(([category, items]) => (
                                  <div key={category} className="">
                                    <div className="font-semibold text-slate-900 capitalize text-base tracking-wide mb-2">
                                      {category}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      {items.map((subItem) => (
                                        <Link
                                          key={subItem}
                                          to={`/${category}/${subItem.toLowerCase().replace(/ /g, "-")}`}
                                          onClick={() => setIsCategoryOpen(false)}
                                          className="text-base text-slate-600 transition-colors w-fit hover:text-orange-500"
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
                            `relative block transition-colors ${isActive
                              ? "text-white after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-0.5 after:bg-white"
                              : "text-black/60 hover:text-white"
                            }`
                          }
                        >
                          {item.name}
                        </NavLink>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ================= MOBILE NAVBAR ================= */}
            <div className="md:hidden">
              {/* Top mobile nav (সবসময় visible) */}
              <nav className="h-12 md:h-14 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-3 transition-all duration-300">
                <Link to="/">
                  <img src={logo} alt="logo" className="transition-all basis-2/6 duration-300 h-12 md:h-14" />
                </Link>

                <div className="flex items-center justify-around basis-4/6 gap-1 text-slate-600">
                  <button
                    onClick={handleSearchOpen}
                    aria-label="Search"
                    className="rounded-full hover:bg-slate-50 p-1"
                  >
                    <FontAwesomeIcon icon={faSearch} className={ICON_ACTION} />
                  </button>

                  <Link
                    to="/userDashboard/wishlist"
                    className="relative p-1 rounded-full hover:bg-slate-50 transition-colors"
                    aria-label="Wishlist"
                  >
                    <FontAwesomeIcon icon={faHeart} className={ICON_ACTION} />
                    <CountBadge count={wishlist.length} color="#F92400" />
                  </Link>

                  <Link
                    to="/userDashboard/cart"
                    className="relative p-1 rounded-full hover:bg-slate-50 transition-colors"
                    aria-label="Cart"
                  >
                    <FontAwesomeIcon icon={faCartShopping} className={ICON_ACTION} />
                    <CountBadge count={cart.length} color="#F28B00" />
                  </Link>

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
                        <div
                          className={`cursor-pointer ${AVATAR_SIZE} rounded-full text-white flex items-center justify-center text-sm bg-orange-500`}
                        >
                          {getInitials(user?.fullname)}
                        </div>
                      )}
                    </div>

                    {accessToken && mobileUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-100 rounded-lg shadow-xl z-50 text-sm overflow-hidden">
                        <Link
                          to="/userDashboard"
                          onClick={() => setMobileUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <FontAwesomeIcon icon={faUser} className="text-sm w-4 text-orange-500" /> My Profile
                        </Link>
                        <Link
                          to="/admin/login"
                          onClick={() => setMobileUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <FontAwesomeIcon icon={faUserShield} className="text-sm w-4 text-orange-500" /> Admin
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setMobileUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <FontAwesomeIcon icon={faBoxOpen} className="text-sm w-4 text-orange-500" /> Orders
                        </Link>
                        <hr className="my-0.5 border-slate-100" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors text-red-500"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="text-sm w-4" /> Logout
                        </button>
                      </div>
                    )}
                  </div>

                  <button onClick={onMenuClick} aria-label="Open menu" className="rounded-full hover:bg-slate-50 p-1">
                    <FontAwesomeIcon icon={faBars} className={ICON_ACTION} />
                  </button>
                </div>
              </nav>

              {/* Mobile Category Bar - স্ক্রল ডাউনে লুকায়, উপরে এলেই দেখায় */}
              <div className={`bg-orange-500 w-full transition-all duration-300 ${collapsedClass}`}>
                <button
                  onClick={toggleMobileCategory}
                  className="w-full h-12 flex items-center justify-between px-4 text-white text-xl font-medium"
                >
                  <span>{language === "BN" ? "সব ক্যাটাগরি" : "All Categories"}</span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`transition-transform duration-200 ${mobileCategoryOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Mobile Category Dropdown */}
                {mobileCategoryOpen && (
                  <div className="bg-white p-4 shadow-lg border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(categoryItems).map(([category, items]) => (
                        <div key={category}>
                          <div className="font-semibold text-slate-900 capitalize text-sm tracking-wide mb-2">
                            {category}
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {items.map((subItem) => (
                              <Link
                                key={subItem}
                                to={`/${category}/${subItem.toLowerCase().replace(/ /g, "-")}`}
                                onClick={() => setMobileCategoryOpen(false)}
                                className="text-sm text-slate-600 transition-colors w-fit hover:text-orange-500"
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
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;