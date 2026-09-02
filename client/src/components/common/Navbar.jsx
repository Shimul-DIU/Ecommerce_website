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
  faRandom,
  faSignOutAlt,
  faBoxOpen,
  faUserShield,
  faHouse,
  faPhone,
  faBell,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

import { CountContext } from "../../context/countContext";
import { AuthContext } from "../../context/AuthContext";
import { getInitials } from "../../utils/getInitials";

// --------------------------------------------------
// COUNT BADGE
// --------------------------------------------------

const CountBadge = ({ count, color }) => {
  if (!count) return null;

  return (
    <span
      className={`absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1
      ${color}
      text-white text-[10px] font-bold
      rounded-full
      flex items-center justify-center
      leading-none
      border-2 border-white shadow-sm`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
};

// --------------------------------------------------
// NAVBAR
// --------------------------------------------------

const Navbar = ({ onMenuClick }) => {
  const { accessToken, logout, user } = useContext(AuthContext);
  const { wishlist, cart } = useContext(CountContext);

  const navigate = useNavigate();

  // Scroll visibility states
  const [showNavbar, setShowNavbar] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const [language, setLanguage] = useState("EN");
  const [currency, setCurrency] = useState("USD");

  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const [activeCategory, setActiveCategory] = useState("All Category");

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);

  const categoryCloseTimer = useRef(null);
  const pagesCloseTimer = useRef(null);
  const mobileMenuRef = useRef(null);

  // --------------------------------------------------
  // SCROLL DIRECTION DETECTION (Hide on down, Show on up)
  // --------------------------------------------------

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scroll direction check
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling Down -> Hide Navbar
        setShowNavbar(false);
      } else {
        // Scrolling Up -> Show Navbar
        setShowNavbar(true);
      }

      // Check if scrolled away from top
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --------------------------------------------------
  // CLOSE MOBILE USER MENU ON OUTSIDE CLICK
  // --------------------------------------------------

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --------------------------------------------------
  // NAV ITEMS
  // --------------------------------------------------

  const navItems = [
    { name: language === "BN" ? "হোম" : "Home", path: "/" },
    { name: language === "BN" ? "পণ্য" : "Shop", path: "/products" },
    { name: language === "BN" ? "একক পেজ" : "Single Page", path: "/single" },
  ];

  const pagesSubmenu = [
    { name: language === "BN" ? "বেস্টসেলার" : "Bestseller", path: "/bestseller" },
    { name: language === "BN" ? "কার্ট" : "Cart Page", path: "/userDashboard/cart" },
    { name: language === "BN" ? "চেকআউট" : "Checkout", path: "/checkout" },
    { name: "404 Page", path: "/404" },
  ];

  const categoryItems = {
    perfume: ["Men's Perfume", "Women's Perfume"],
    jewellery: ["Ring", "Necklace", "Earring"],
    women: ["Dress", "Saree", "Bag", "Shoes"],
    men: ["T-Shirt", "Shirt", "Pant", "Shoes", "Watch"],
  };

  const quickCategories = [
    "All Category",
    "Men",
    "Women",
    "Jewellery",
    "Perfume",
  ];

  // Hover handlers
  const handleCategoryEnter = () => {
    clearTimeout(categoryCloseTimer.current);
    setIsCategoryOpen(true);
  };

  const handleCategoryLeave = () => {
    categoryCloseTimer.current = setTimeout(() => setIsCategoryOpen(false), 150);
  };

  const handlePagesEnter = () => {
    clearTimeout(pagesCloseTimer.current);
    setIsPagesOpen(true);
  };

  const handlePagesLeave = () => {
    pagesCloseTimer.current = setTimeout(() => setIsPagesOpen(false), 150);
  };

  // Search
  const handleSearchOpen = () => setSearchOpen(true);
  const handleSearchClose = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(
      `/products?search=${encodeURIComponent(query.trim())}${
        activeCategory !== "All Category"
          ? `&category=${encodeURIComponent(activeCategory)}`
          : ""
      }`
    );

    setSearchOpen(false);
  };

  // User
  const handleUserIconClick = (isMobile = false) => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (isMobile) {
      setMobileUserMenuOpen((prev) => !prev);
    } else {
      setIsUserMenuOpen((prev) => !prev);
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    setIsUserMenuOpen(false);
    setMobileUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-white transition-all duration-300 ease-in-out
        ${showNavbar ? "translate-y-0" : "-translate-y-full"}
        ${isScrolled ? "shadow-lg" : "shadow-sm"}
      `}
    >
      {/* =====================================================
          TOP UTILITY BAR
      ====================================================== */}
      <div
        className={`
          hidden md:block bg-slate-900 text-slate-100
          overflow-hidden transition-all duration-300 ease-in-out
          ${isScrolled ? "max-h-0 opacity-0 py-0" : "max-h-10 opacity-100 py-1"}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between text-xs lg:text-sm font-medium">
          {/* LEFT */}
          <div className="flex items-center gap-5">
            <Link to="/help" className="hover:text-orange-400 transition-colors">
              Help
            </Link>
            <span className="text-slate-700">/</span>
            <Link to="/support" className="hover:text-orange-400 transition-colors">
              Support
            </Link>
            <span className="text-slate-700">/</span>
            <Link to="/contact" className="hover:text-orange-400 transition-colors">
              Contact
            </Link>
          </div>

          {/* CENTER */}
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <FontAwesomeIcon icon={faPhone} className="text-xs text-orange-400" />
            <span>Call Us: (+012) 1234 567890</span>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {accessToken && (
              <>
                <Link to="/userDashboard/wishlist" className="hover:text-orange-400 transition-colors">
                  Wishlist
                </Link>
                <span className="text-slate-700">|</span>
                <Link to="/userDashboard/notifications" className="hover:text-orange-400 transition-colors">
                  Notifications
                </Link>
                <span className="text-slate-700">|</span>
              </>
            )}

            {/* CURRENCY */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-xs lg:text-sm text-slate-200 hover:text-orange-400 font-medium"
            >
              <option value="USD" className="text-black">USD ($)</option>
              <option value="EUR" className="text-black">Euro (€)</option>
              <option value="BDT" className="text-black">BDT (৳)</option>
            </select>

            <span className="text-slate-700">|</span>

            {/* LANGUAGE */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-xs lg:text-sm text-slate-200 hover:text-orange-400 font-medium"
            >
              <option value="EN" className="text-black">English</option>
              <option value="BN" className="text-black">বাংলা</option>
            </select>

            <span className="text-slate-700">|</span>

            {/* DASHBOARD */}
            <Link
              to={accessToken ? "/userDashboard" : "/login"}
              className="flex items-center gap-1.5 hover:text-orange-400 transition-colors"
            >
              <FontAwesomeIcon icon={faHouse} className="text-xs" />
              <span>My Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE SEARCH TAKEOVER
      ====================================================== */}
      {searchOpen ? (
        <div className="md:hidden bg-white px-4 py-3 border-b border-slate-200">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSearchClose}
              className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-orange-500"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </button>

            <div className="flex-1 h-11 flex items-center bg-slate-100 rounded-lg px-3">
              <FontAwesomeIcon icon={faSearch} className="text-slate-500 text-base mr-2" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === "BN" ? "পণ্য খুঁজুন..." : "Search Looking For?"}
                autoFocus
                className="flex-1 h-full outline-none bg-transparent text-sm text-slate-900 font-medium"
              />
            </div>

            <button type="button" className="text-slate-700 hover:text-orange-500">
              <FontAwesomeIcon icon={faMicrophone} className="text-xl" />
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* =====================================================
              MAIN HEADER (Logo / Search / Actions)
          ====================================================== */}
          <div className="border-b border-slate-100">
            <div
              className={`
                max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between gap-4 lg:gap-8
                transition-all duration-300 ease-in-out
                ${isScrolled ? "h-16 py-1" : "h-20 lg:h-24 py-3"}
              `}
            >
              {/* LOGO */}
              <Link to="/" className="shrink-0 flex items-center">
                <img
                  src={logo}
                  alt="Logo"
                  className={`
                    w-auto object-contain transition-all duration-300
                    ${isScrolled ? "h-9 lg:h-10" : "h-11 lg:h-14"}
                  `}
                />
              </Link>

              {/* SEARCH + CATEGORY PICKER (Desktop) */}
              <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-2xl">
                <div
                  className={`
                    relative w-full flex items-stretch border rounded-lg
                    overflow-visible bg-slate-50/50 hover:bg-white transition-all duration-200
                    ${isScrolled ? "h-10" : "h-12"}
                    ${searchFocused ? "border-orange-500 bg-white ring-2 ring-orange-500/15" : "border-slate-300"}
                  `}
                >
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder={language === "BN" ? "পণ্য খুঁজুন..." : "Search Looking For?"}
                    className="flex-1 h-full pl-4 pr-3 outline-none text-sm lg:text-base text-slate-900 font-medium placeholder:text-slate-400 rounded-l-lg bg-transparent"
                  />

                  {/* CATEGORY PICKER */}
                  <div
                    className="relative shrink-0 border-l border-slate-200"
                    onMouseLeave={() => setIsCategoryPickerOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setIsCategoryPickerOpen((prev) => !prev)}
                      className="h-full px-4 flex items-center gap-2 text-xs lg:text-sm font-semibold text-slate-700 hover:text-orange-600 bg-slate-100/70 whitespace-nowrap transition-colors"
                    >
                      <span>{activeCategory}</span>
                      <FontAwesomeIcon icon={faChevronDown} className="text-xs text-slate-500" />
                    </button>

                    {isCategoryPickerOpen && (
                      <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden z-50 py-1">
                        {quickCategories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setActiveCategory(cat);
                              setIsCategoryPickerOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="h-full px-5 bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors rounded-r-lg"
                  >
                    <FontAwesomeIcon icon={faSearch} className="text-base" />
                  </button>
                </div>
              </form>

              {/* ACTIONS */}
              <div className="flex items-center gap-2 lg:gap-3 shrink-0 -mr-12">
                {/* MOBILE SEARCH TOGGLE */}
                <button
                  onClick={handleSearchOpen}
                  className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-slate-700 hover:text-orange-500 hover:bg-slate-100 transition-colors"
                >
                  <FontAwesomeIcon icon={faSearch} className="text-lg" />
                </button>

                {/* COMPARE */}
                <Link
                  to="/compare"
                  className={`
                    hidden sm:flex relative items-center justify-center rounded-full border border-slate-200
                    text-slate-700 hover:text-orange-500 hover:border-orange-400 hover:bg-orange-50/50 transition-all
                    ${isScrolled ? "w-10 h-10 text-base" : "w-11 h-11 text-lg"}
                  `}
                  aria-label="Compare"
                >
                  <FontAwesomeIcon icon={faRandom} />
                </Link>

                {/* WISHLIST */}
                <Link
                  to="/userDashboard/wishlist"
                  className={`
                    relative flex items-center justify-center rounded-full border border-slate-200
                    text-slate-700 hover:text-orange-500 hover:border-orange-400 hover:bg-orange-50/50 transition-all
                    ${isScrolled ? "w-10 h-10 text-base" : "w-11 h-11 text-lg"}
                  `}
                  aria-label="Wishlist"
                >
                  <FontAwesomeIcon icon={faHeart} />
                  <CountBadge count={wishlist.length} color="bg-orange-500" />
                </Link>

                {/* NOTIFICATIONS */}
                <Link
                  to="/userDashboard/notifications"
                  className={`
                    hidden sm:flex relative items-center justify-center rounded-full border border-slate-200
                    text-slate-700 hover:text-orange-500 hover:border-orange-400 hover:bg-orange-50/50 transition-all
                    ${isScrolled ? "w-10 h-10 text-base" : "w-11 h-11 text-lg"}
                  `}
                  aria-label="Notifications"
                >
                  <FontAwesomeIcon icon={faBell} />
                </Link>

                {/* CART */}
                <Link
                  to="/userDashboard/cart"
                  className={`
                    relative flex items-center gap-2.5 rounded-full border border-slate-200
                    text-slate-800 hover:text-orange-500 hover:border-orange-400 hover:bg-orange-50/50 transition-all
                    ${isScrolled ? "h-10 pl-3 pr-4" : "h-11 pl-3.5 pr-5"}
                  `}
                  aria-label="Cart"
                >
                  <span className="relative flex items-center justify-center">
                    <FontAwesomeIcon icon={faCartShopping} className={isScrolled ? "text-base" : "text-lg"} />
                    <CountBadge count={cart.length} color="bg-orange-500" />
                  </span>
                  <span className="hidden sm:inline text-sm lg:text-base font-bold">
                    {cart.total ? `$${cart.total}` : "$0.00"}
                  </span>
                </Link>

                {/* USER */}
                <div className="relative ml-1" onMouseLeave={() => setIsUserMenuOpen(false)}>
                  <button
                    onClick={() => handleUserIconClick(false)}
                    className={`
                      flex items-center justify-center rounded-full overflow-hidden border-2 border-transparent hover:border-orange-500 transition-all
                      ${isScrolled ? "w-10 h-10" : "w-11 h-11"}
                    `}
                    aria-label="User menu"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.fullname || "User"}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center text-sm font-bold shadow-inner">
                        {getInitials(user?.fullname)}
                      </div>
                    )}
                  </button>

                  {/* DESKTOP USER MENU */}
                  {accessToken && isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50 py-1">
                      <Link
                        to="/userDashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <FontAwesomeIcon icon={faUser} className="w-4 text-slate-400" />
                        My Account
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <FontAwesomeIcon icon={faBoxOpen} className="w-4 text-slate-400" />
                        Orders
                      </Link>

                      <Link
                        to="/userDashboard/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <FontAwesomeIcon icon={faGear} className="w-4 text-slate-400" />
                        Account Settings
                      </Link>

                      <Link
                        to="/admin/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <FontAwesomeIcon icon={faUserShield} className="w-4 text-slate-400" />
                        Admin
                      </Link>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>

                {/* MOBILE MENU TOGGLE */}
                <button
                  onClick={onMenuClick}
                  className="md:hidden w-10 h-10 flex items-center justify-center text-slate-800 hover:text-orange-500 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Open menu"
                >
                  <FontAwesomeIcon icon={faBars} className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================
              DESKTOP CATEGORY NAVIGATION & MENU LINKS
          ====================================================== */}
          <div className="  ">
              <div className="max-w-7xl mx-auto bg-orange-500 shadow-inner ">
              <nav
                className={`
                  flex items-center justify-between transition-all duration-300

                `}
              >
                <div className="flex items-center h-16 w-full ">
                  {/* ALL CATEGORIES */}
                  <div
                    className="relative h-full flex items-center"
                    onMouseEnter={handleCategoryEnter}
                    onMouseLeave={handleCategoryLeave}
                  >
                    <button className="h-full px-4 flex items-center gap-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm lg:text-base font-bold transition-colors rounded-t-md">
                      <FontAwesomeIcon icon={faBars} className="text-base" />
                      <span>All Categories</span>
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`text-xs transition-transform duration-200 ${
                          isCategoryOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isCategoryOpen && (
                      <div className="absolute top-full left-0 w-[550px] bg-white border border-slate-200 shadow-2xl z-50 p-6 rounded-b-xl">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                          {Object.entries(categoryItems).map(([category, items]) => (
                            <div key={category}>
                              <h3 className="text-base lg:text-base font-bold text-slate-900 capitalize mb-3 pb-2 border-b border-slate-100">
                                {category}
                              </h3>
                              <div className="flex flex-col gap-2">
                                {items.map((subItem) => (
                                  <Link
                                    key={subItem}
                                    to={`/${category}/${subItem.toLowerCase().replace(/ /g, "-")}`}
                                    onClick={() => setIsCategoryOpen(false)}
                                    className="text-base  font-medium text-black hover:text-orange-600 transition-colors"
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

                  {/* NAV LINKS */}
                  <div className="flex items-center h-full ml-6 gap-2">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `h-full px-4 flex items-center text-sm lg:text-base font-bold transition-all ${
                            isActive
                              ? "text-white bg-orange-600/60"
                              : "text-orange-50 hover:text-white hover:bg-orange-600/30"
                          }`
                        }
                      >
                        {item.name}
                      </NavLink>
                    ))}

                    {/* PAGES DROPDOWN */}
                    <div
                      className="relative h-full flex items-center"
                      onMouseEnter={handlePagesEnter}
                      onMouseLeave={handlePagesLeave}
                    >
                      <button className="h-full px-4 flex items-center gap-2 text-sm lg:text-base font-bold text-orange-50 hover:text-white hover:bg-orange-600/30 transition-colors">
                        <span>{language === "BN" ? "পেজ" : "Pages"}</span>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`text-xs transition-transform duration-200 ${
                            isPagesOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isPagesOpen && (
                        <div className="absolute top-full left-0 w-52 bg-white border border-slate-200 rounded-b-xl shadow-2xl overflow-hidden z-50 py-2">
                          {pagesSubmenu.map((page) => (
                            <Link
                              key={page.path}
                              to={page.path}
                              onClick={() => setIsPagesOpen(false)}
                              className="block px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            >
                              {page.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    <NavLink
                      to="/contact"
                      className={({ isActive }) =>
                        `h-full px-4 flex items-center text-sm lg:text-base font-bold transition-all ${
                          isActive
                            ? "text-white bg-orange-600/60"
                            : "text-orange-50 hover:text-white hover:bg-orange-600/30"
                        }`
                      }
                    >
                      {language === "BN" ? "যোগাযোগ" : "Contact"}
                    </NavLink>
                  </div>
                </div>

                {/* HOTLINE */}
                <a
                  href="tel:+0123456789"
                  className="h-8 lg:h-9 px-4 lg:px-5 flex items-center gap-2 bg-slate-900 text-white text-xs lg:text-sm font-bold rounded-full hover:bg-black transition-all shadow-md shrink-0"
                >
                  <FontAwesomeIcon icon={faPhone} className="text-orange-400 text-xs" />
                  <span>+0123 456 7890</span>
                </a>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* =====================================================
          MOBILE HEADER BAR (Categories & Offers)
      ====================================================== */}
      {!searchOpen && (
        <div className="md:hidden border-t border-orange-600 bg-orange-500">
          <nav className="h-11 px-4 flex items-center justify-between">
            <button
              onClick={onMenuClick}
              className="flex items-center gap-2 text-sm font-bold text-white active:opacity-80"
            >
              <FontAwesomeIcon icon={faBars} />
              <span>Categories</span>
            </button>

            <Link to="/offers" className="text-sm font-bold text-white hover:underline">
              Offers
            </Link>
          </nav>
        </div>
      )}

      {/* =====================================================
          MOBILE USER DROPDOWN
      ====================================================== */}
      <div ref={mobileMenuRef} className="md:hidden relative">
        {accessToken && mobileUserMenuOpen && (
          <div className="absolute right-4 top-1 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl z-[60] overflow-hidden py-1">
            <Link
              to="/userDashboard"
              onClick={() => setMobileUserMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-orange-50"
            >
              <FontAwesomeIcon icon={faUser} className="w-4 text-slate-400" />
              My Account
            </Link>

            <Link
              to="/orders"
              onClick={() => setMobileUserMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-orange-50"
            >
              <FontAwesomeIcon icon={faBoxOpen} className="w-4 text-slate-400" />
              Orders
            </Link>

            <Link
              to="/userDashboard/settings"
              onClick={() => setMobileUserMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-orange-50"
            >
              <FontAwesomeIcon icon={faGear} className="w-4 text-slate-400" />
              Account Settings
            </Link>

            <Link
              to="/admin/login"
              onClick={() => setMobileUserMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-orange-50"
            >
              <FontAwesomeIcon icon={faUserShield} className="w-4 text-slate-400" />
              Admin
            </Link>

            <div className="border-t border-slate-100 my-1" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 text-left"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;