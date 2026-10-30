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
  faUserShield,
  faTableCellsLarge,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { CountContext } from "../../context/CountContext";
import { useScroll } from "../../hooks/useScroll";
import { AuthContext } from "../../context/AuthContext";
import { getInitials } from "../../utils/getInitials";
import useProducts from "../../hooks/useProducts";

const ICON_ACTION = "text-lg sm:text-xl md:text-lg";
const AVATAR_SIZE = "w-8 h-8 sm:w-10 sm:h-10";

const CONTAINER = "w-full min-[1281px]:w-[80%] mx-auto";

/* ---------------- Count Badge ---------------- */
const CountBadge = ({ count, color, textColor = "#fff" }) => {
  if (!count) return null;
  return (
    <span
      className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 text-[10px] font-extrabold rounded-full flex items-center justify-center leading-none shadow-md ring-2 ring-[#16241F]"
      style={{ background: color, color: textColor }}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
};

/* ---------------- Round icon button style ---------------- */
const iconBtn =
  "relative w-10 h-10 rounded-full flex items-center justify-center text-[#FAF6EF]/80 border border-[#FAF6EF]/10 bg-white/5 hover:bg-[#B08946] hover:text-[#16241F] hover:border-[#B08946] transition-all duration-200";

const Navbar = ({ onMenuClick }) => {
  const { accessToken, logout, user } = useContext(AuthContext);

  const navigate = useNavigate();
  const isScrolled = useScroll();
  const { wishlist, cart } = useContext(CountContext);
  const [products] = useProducts();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Hover & Dropdown States
  const [activeDropdown, setActiveDropdown] = useState(null);
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

  // Products ক্যাটাগরির ড্রপডাউন ডাটা স্ট্রাকচার
  const productCategories = [
    { name: language === "BN" ? "পারফিউম (Perfume)" : "Perfume", path: "/products?category=perfume" },
    { name: language === "BN" ? "জুয়েলারি (Jewellery)" : "Jewellery", path: "/products?category=jewellery" },
    { name: language === "BN" ? "নারী (Women)" : "Women", path: "/products?category=women" },
    { name: language === "BN" ? "পুরুষ (Men)" : "Men", path: "/products?category=men" },
    { name: language === "BN" ? "মাছ ধরা (Fishing)" : "Fishing", path: "/products?category=fishing" },
  ];

  // Category Sub-Items Config (Mega Menu for All Categories)
  const categoryItems = {
    all: {
      perfume: ["Men's Perfume", "Women's Perfume", "Attar", "Body Spray"],
      jewellery: ["Ring", "Necklace", "Earring", "Bracelet"],
      women: ["Dress", "Saree", "Bag", "Shoes"],
      men: ["T-Shirt", "Shirt", "Pant", "Shoes", "Watch"],
      fishing: ["Fishing Rods", "Fishing Reels", "Fishing Lines", "Fishing Hooks", "Fishing Lures", "Fishing Accessories"],
    },
    perfume: ["Men's Perfume", "Women's Perfume", "Attar", "Body Spray"],
    jewellery: ["Ring", "Necklace", "Earring", "Bracelet"],
    women: ["Dress", "Saree", "Bag", "Shoes"],
    men: ["T-Shirt", "Shirt", "Pant", "Shoes"],
    fishing: ["Fishing Rods", "Fishing Reels", "Fishing Lines", "Fishing Hooks", "Fishing Lures", "Fishing Accessories"],
  };

  const navItems = [
    {
      id: "all",
      name: language === "BN" ? "সব ক্যাটাগরি" : "All Categories",
      path: "/categories",
      hasDropdown: true,
    },
    { id: "home", name: language === "BN" ? "হোম" : "Home", path: "/" },
    {
      id: "products",
      name: language === "BN" ? "পণ্যসমূহ" : "Products",
      path: "/products",
      hasDropdown: true,
      items: productCategories,
    },
    {
      id: "women",
      name: language === "BN" ? "নারী" : "Women",
      path: "/women",
      hasDropdown: true,
      items: categoryItems.women,
    },
    {
      id: "men",
      name: language === "BN" ? "পুরুষ" : "Men",
      path: "/men",
      hasDropdown: true,
      items: categoryItems.men,
    },
    {
      id: "fishing",
      name: language === "BN" ? "মাছ ধরা" : "Fishing",
      path: "/fishing",
      hasDropdown: true,
      items: categoryItems.fishing,
    },
    { id: "offers", name: language === "BN" ? "অফার" : "Offers", path: "/offers" },
  ];

  const handleMouseEnter = (itemId) => {
    clearTimeout(closeTimer.current);
    setActiveDropdown(itemId);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleSearchOpen = () => setSearchOpen(true);
  const handleSearchClose = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const search = query.trim();
    navigate(search ? `/products?search=${encodeURIComponent(search)}` : "/products");
    setSearchOpen(false);
    setSearchFocused(false);
  };

  const getCategoryLink = (category, subItem) => {
    const normalizedSubItem = subItem
      .toLowerCase()
      .replace(/^fishing\s*-?/, "")
      .replace(/ /g, "-");
    const subcategory = `${category}-${normalizedSubItem}`;

    if (["men", "women", "fishing"].includes(category)) {
      return `/${category}?category=${encodeURIComponent(subcategory)}`;
    }

    return `/products?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`;
  };

  const searchSuggestions = query.trim()
    ? products
        .filter((item) => item.name?.toLowerCase().includes(query.trim().toLowerCase()))
        .slice(0, 5)
    : [];

  const handleSuggestionClick = (productName) => {
    setQuery(productName);
    navigate(`/products?search=${encodeURIComponent(productName)}`);
    setSearchOpen(false);
    setSearchFocused(false);
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

  const collapsedClass = isScrolled
    ? "max-h-0 opacity-0 py-0 pointer-events-none overflow-hidden"
    : "max-h-20 opacity-100";

  const toggleMobileCategory = () => {
    setMobileCategoryOpen(!mobileCategoryOpen);
  };

  /* ---------- Reusable: User avatar ---------- */
  const Avatar = () =>
    user?.avatar ? (
      <img
        src={user.avatar}
        alt={user.fullname}
        className={`${AVATAR_SIZE} rounded-full object-cover ring-2 ring-[#B08946]`}
      />
    ) : (
      <div
        title={user?.fullname}
        className={`${AVATAR_SIZE} rounded-full bg-[#B08946] text-[#16241F] font-bold flex items-center justify-center text-sm ring-2 ring-[#FAF6EF]/20`}
      >
        {accessToken ? (
          getInitials(user?.fullname)
        ) : (
          <FontAwesomeIcon icon={faUser} className="text-sm" />
        )}
      </div>
    );

  /* ---------- Reusable: User dropdown ---------- */
  const UserMenu = ({ onClose, className = "" }) => (
    <div
      className={`absolute z-50 w-52 overflow-hidden rounded-2xl border border-[#E4DDCE] bg-white shadow-2xl text-sm ${className}`}
    >
      <div className="bg-[#16241F] px-4 py-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#B08946]">Welcome</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-[#FAF6EF]">
          {user?.fullname || "User"}
        </p>
      </div>
      {[
        { to: "/userDashboard", icon: faUser, label: "My Profile" },
        { to: "/admin/login", icon: faUserShield, label: "Admin" },
        { to: "/orders", icon: faBoxOpen, label: "Orders" },
      ].map((m) => (
        <Link
          key={m.to}
          to={m.to}
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-[#16241F] hover:bg-[#FAF6EF] hover:text-[#B08946] transition-colors"
        >
          <FontAwesomeIcon icon={m.icon} className="text-xs w-4 text-[#B08946]" />
          {m.label}
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-2.5 border-t border-[#E4DDCE]/70 text-left text-red-500 hover:bg-red-50 transition-colors"
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="text-xs w-4" /> Logout
      </button>
    </div>
  );

  /* ---------- Reusable: Search suggestions ---------- */
  const Suggestions = ({ className = "" }) =>
    searchFocused && searchSuggestions.length > 0 ? (
      <div
        className={`absolute z-50 overflow-hidden rounded-2xl border border-[#E4DDCE] bg-white shadow-2xl ${className}`}
      >
        {searchSuggestions.map((item) => (
          <button
            type="button"
            key={item._id}
            onMouseDown={() => handleSuggestionClick(item.name)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[#16241F] hover:bg-[#FAF6EF] hover:text-[#B08946] transition-colors"
          >
            <FontAwesomeIcon icon={faSearch} className="text-xs text-[#B08946]" />
            <span className="truncate">{item.name}</span>
          </button>
        ))}
      </div>
    ) : null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-lg">
      <div className="w-full">
        {/* ================= TOP UTILITY BAR ================= */}
        <div
          className={`w-full bg-[#0F1A16] text-[#FAF6EF]/60 text-xs transition-all duration-300 ${collapsedClass}`}
        >
          <div className={`${CONTAINER} flex items-center justify-between py-1.5 px-2 sm:px-4 lg:px-6`}>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden md:flex items-center gap-1.5 text-[#B08946]">
                <FontAwesomeIcon icon={faTruckFast} className="text-[11px]" />
                <span className="font-medium">
                  {language === "BN" ? "২০০০ টাকার উপরে ফ্রি ডেলিভারি" : "Free delivery over ৳2000"}
                </span>
              </span>
              <span className="hidden md:block h-3 w-px bg-white/15" />
              <div className="flex items-center gap-2">
                <Link to="/help" className="hover:text-[#B08946] transition-colors">Help</Link>
                <span className="text-white/15">|</span>
                <Link to="/support" className="hover:text-[#B08946] transition-colors">Support</Link>
                <span className="text-white/15">|</span>
                <Link to="/contact" className="hover:text-[#B08946] transition-colors">Contact</Link>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 hover:text-[#B08946] transition-colors">
                <FontAwesomeIcon icon={faGlobe} className="text-[#B08946]" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer text-xs text-inherit"
                >
                  <option value="EN" className="text-black">English (EN)</option>
                  <option value="BN" className="text-black">বাংলা (BN)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 hover:text-[#B08946] transition-colors">
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-[#B08946]" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer text-xs text-inherit"
                >
                  <option value="BDT (৳)" className="text-black">BDT (৳)</option>
                  <option value="USD ($)" className="text-black">USD ($)</option>
                  <option value="EUR (€)" className="text-black">EUR (€)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MOBILE SEARCH ================= */}
        {searchOpen ? (
          <nav className="md:hidden w-full bg-[#16241F]">
            <div className={`${CONTAINER} px-3 py-3 flex items-center gap-3`}>
              <button
                onClick={handleSearchClose}
                aria-label="Close search"
                className="text-[#FAF6EF] hover:text-[#B08946] transition-colors shrink-0 p-2 -m-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} className={ICON_ACTION} />
              </button>
              <div className="relative flex-1">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-[#FAF6EF] rounded-full pl-4 pr-2 h-10 border border-[#B08946]/50"
                >
                  <FontAwesomeIcon icon={faSearch} className="text-[#B08946] text-sm mr-2 shrink-0" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    placeholder="Search products..."
                    autoFocus
                    className="flex-1 h-full outline-none bg-transparent text-sm text-[#16241F] placeholder:text-[#16241F]/40"
                  />
                </form>
                <Suggestions className="top-12 left-0 right-0" />
              </div>
              <button
                aria-label="Voice search"
                className="text-[#FAF6EF] hover:text-[#B08946] transition-colors shrink-0 p-2 -m-2"
              >
                <FontAwesomeIcon icon={faMicrophone} className={ICON_ACTION} />
              </button>
            </div>
          </nav>
        ) : (
          <>
            {/* ================= DESKTOP NAVBAR ================= */}
            <div className="hidden w-full md:block">
              {/* ROW 1: Logo + Search + Actions */}
              <nav className="w-full bg-[#16241F]">
                <div className={`${CONTAINER} h-[68px] flex items-center px-4 lg:px-6 gap-6 lg:gap-10`}>
                  <Link to="/" className="shrink-0 flex items-center">
                    <span className="flex items-center bg-[#FAF6EF] rounded-xl px-3 py-1 ring-2 ring-[#B08946]/60">
                      <img src={logo} alt="logo" className="h-9 transition-all duration-300" />
                    </span>
                  </Link>

                  {/* Search */}
                  <div className="relative flex-1 flex justify-center">
                    <form
                      onSubmit={handleSearchSubmit}
                      className={`flex items-center rounded-full h-11 w-full max-w-xl bg-[#FAF6EF] overflow-hidden transition-all duration-200 ${
                        searchFocused
                          ? "ring-2 ring-[#B08946] shadow-[0_0_0_4px_rgba(176,137,70,0.2)]"
                          : "ring-1 ring-[#B08946]/30"
                      }`}
                    >
                      <FontAwesomeIcon icon={faSearch} className="text-[#B08946] text-sm ml-5 shrink-0" />
                      <input
                        type="text"
                        value={query}
                        placeholder={language === "BN" ? "পণ্য খুঁজুন..." : "Search for products..."}
                        className="flex-1 h-full outline-none bg-transparent text-sm text-[#16241F] placeholder:text-[#16241F]/40 px-3"
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                      />
                      <button
                        type="submit"
                        className="h-full px-6 text-sm font-bold shrink-0 transition-colors bg-[#B08946] text-[#16241F] hover:bg-[#C49A52]"
                      >
                        {language === "BN" ? "খুঁজুন" : "Search"}
                      </button>
                    </form>
                    <Suggestions className="top-[52px] left-1/2 w-full max-w-xl -translate-x-1/2" />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <Link to="/userDashboard/wishlist" className={iconBtn} aria-label="Wishlist">
                      <FontAwesomeIcon icon={faHeart} className={ICON_ACTION} />
                      <CountBadge count={wishlist.length} color="#EF4444" />
                    </Link>

                    <Link to="/userDashboard/cart" className={iconBtn} aria-label="Cart">
                      <FontAwesomeIcon icon={faCartShopping} className={ICON_ACTION} />
                      <CountBadge count={cart.length} color="#B08946" textColor="#16241F" />
                    </Link>

                    <div
                      className="relative ml-1 pl-3 border-l border-[#FAF6EF]/15"
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                    >
                      <div
                        onClick={() => handleUserIconClick(false)}
                        className="cursor-pointer"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded={isUserMenuOpen}
                        aria-label="User menu"
                      >
                        <Avatar />
                      </div>

                      {accessToken && isUserMenuOpen && (
                        <UserMenu
                          className="right-0 top-full"
                          onClose={() => setIsUserMenuOpen(false)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </nav>

              {/* ROW 2: Nav Items */}
              <div
                className={`w-full overflow-visible transition-all duration-300 bg-[#FAF6EF] border-b-2 border-[#B08946] ${collapsedClass}`}
              >
                <div
                  className={`${CONTAINER} flex items-center justify-between gap-1 sm:gap-2 text-xs sm:text-sm font-semibold h-11 md:h-12 lg:h-[52px] px-4 lg:px-6`}
                >
                  {navItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative flex items-center h-full"
                      onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.id)}
                      onMouseLeave={() => item.hasDropdown && handleMouseLeave()}
                    >
                      {item.id === "all" ? (
                        <NavLink
                          to={item.path}
                          className="flex items-center gap-2 bg-[#16241F] text-[#FAF6EF] hover:bg-[#B08946] hover:text-[#16241F] px-4 py-2 rounded-full text-sm font-bold shadow-sm transition-colors duration-200"
                        >
                          <FontAwesomeIcon icon={faTableCellsLarge} className="text-xs" />
                          {item.name}
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className={`text-[10px] transition-transform duration-200 ${
                              activeDropdown === item.id ? "rotate-180" : ""
                            }`}
                          />
                        </NavLink>
                      ) : (
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `relative h-full flex items-center gap-1.5 px-1 transition-colors after:absolute after:left-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-[#B08946] after:transition-all after:duration-300 ${
                              isActive
                                ? "text-[#16241F] after:w-full"
                                : "text-[#16241F]/65 hover:text-[#B08946] after:w-0 hover:after:w-full"
                            }`
                          }
                        >
                          {item.name}
                          {item.hasDropdown && (
                            <FontAwesomeIcon
                              icon={faChevronDown}
                              className={`text-[10px] transition-transform duration-200 ${
                                activeDropdown === item.id ? "rotate-180 text-[#B08946]" : ""
                              }`}
                            />
                          )}
                        </NavLink>
                      )}

                      {/* Mega Dropdown for "All Categories" */}
                      {item.id === "all" && activeDropdown === "all" && (
                        <div
                          className="absolute top-full left-0 z-50 overflow-hidden rounded-2xl border border-[#E4DDCE] bg-white shadow-2xl border-t-[3px] border-t-[#B08946]"
                          style={{ width: "640px" }}
                        >
                          <div className="grid grid-cols-5 gap-4 p-5">
                            {Object.entries(categoryItems.all).map(([category, items]) => (
                              <div key={category}>
                                <div className="mb-2 pb-1.5 border-b border-[#E4DDCE] font-bold text-[#16241F] capitalize text-xs tracking-wide">
                                  {category}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  {items.map((subItem) => (
                                    <Link
                                      key={subItem}
                                      to={getCategoryLink(category, subItem)}
                                      onClick={() => setActiveDropdown(null)}
                                      className="w-fit text-[12px] font-medium text-[#16241F]/60 transition-all hover:text-[#B08946] hover:translate-x-1"
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

                      {/* Dropdown for "Products" */}
                      {item.id === "products" && activeDropdown === "products" && (
                        <div className="absolute top-full left-0 z-50 min-w-[210px] overflow-hidden rounded-2xl border border-[#E4DDCE] bg-white py-2 shadow-2xl border-t-[3px] border-t-[#B08946]">
                          {productCategories.map((cat) => (
                            <Link
                              key={cat.path}
                              to={cat.path}
                              onClick={() => setActiveDropdown(null)}
                              className="block px-5 py-2 text-sm font-medium text-[#16241F]/75 transition-all hover:bg-[#FAF6EF] hover:text-[#B08946] hover:pl-6"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Dropdown for Women / Men / Fishing */}
                      {item.id !== "all" &&
                        item.id !== "products" &&
                        item.hasDropdown &&
                        activeDropdown === item.id && (
                          <div className="absolute top-full left-0 z-50 min-w-[190px] overflow-hidden rounded-2xl border border-[#E4DDCE] bg-white py-2 shadow-2xl border-t-[3px] border-t-[#B08946]">
                            {item.items?.map((subItem) => (
                              <Link
                                key={subItem}
                                to={getCategoryLink(item.id, subItem)}
                                onClick={() => setActiveDropdown(null)}
                                className="block px-5 py-2 text-sm font-medium text-[#16241F]/75 transition-all hover:bg-[#FAF6EF] hover:text-[#B08946] hover:pl-6"
                              >
                                {subItem}
                              </Link>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ================= MOBILE NAVBAR ================= */}
            <div className="md:hidden w-full">
              <nav className="w-full bg-[#16241F] border-b border-[#B08946]/40 transition-all duration-300">
                <div className={`${CONTAINER} h-14 flex items-center justify-between px-3`}>
                  <Link to="/" className="shrink-0">
                    <span className="flex items-center bg-[#FAF6EF] rounded-lg px-2 py-0.5 ring-1 ring-[#B08946]/60">
                      <img src={logo} alt="logo" className="h-8 transition-all duration-300" />
                    </span>
                  </Link>

                  <div className="flex items-center gap-1.5 text-[#FAF6EF]">
                    <button
                      onClick={handleSearchOpen}
                      aria-label="Search"
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <FontAwesomeIcon icon={faSearch} className={ICON_ACTION} />
                    </button>

                    <Link
                      to="/userDashboard/wishlist"
                      className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                      aria-label="Wishlist"
                    >
                      <FontAwesomeIcon icon={faHeart} className={ICON_ACTION} />
                      <CountBadge count={wishlist.length} color="#EF4444" />
                    </Link>

                    <Link
                      to="/userDashboard/cart"
                      className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                      aria-label="Cart"
                    >
                      <FontAwesomeIcon icon={faCartShopping} className={ICON_ACTION} />
                      <CountBadge count={cart.length} color="#B08946" textColor="#16241F" />
                    </Link>

                    <div className="flex items-center relative" ref={mobileMenuRef}>
                      <div
                        onClick={() => handleUserIconClick(true)}
                        className="cursor-pointer p-0.5"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded={mobileUserMenuOpen}
                        aria-label="User menu"
                      >
                        <Avatar />
                      </div>

                      {accessToken && mobileUserMenuOpen && (
                        <UserMenu
                          className="right-0 top-full mt-2"
                          onClose={() => setMobileUserMenuOpen(false)}
                        />
                      )}
                    </div>

                    <button
                      onClick={onMenuClick}
                      aria-label="Open menu"
                      className="w-9 h-9 rounded-full flex items-center justify-center bg-[#B08946] text-[#16241F] hover:bg-[#C49A52] transition-colors"
                    >
                      <FontAwesomeIcon icon={faBars} className="text-base" />
                    </button>
                  </div>
                </div>
              </nav>

              {/* Mobile Category Bar */}
              <div className={`bg-[#FAF6EF] w-full border-b-2 border-[#B08946] transition-all duration-300 ${collapsedClass}`}>
                <button
                  onClick={toggleMobileCategory}
                  className={`${CONTAINER} h-12 flex items-center justify-between px-4 text-[#16241F] text-base font-bold`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-[#16241F] text-[#B08946] flex items-center justify-center">
                      <FontAwesomeIcon icon={faTableCellsLarge} className="text-xs" />
                    </span>
                    {language === "BN" ? "সব ক্যাটাগরি" : "All Categories"}
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-[#B08946] transition-transform duration-200 ${
                      mobileCategoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileCategoryOpen && (
                  <div className="bg-white shadow-lg border-t border-[#E4DDCE] max-h-[70vh] overflow-y-auto">
                    <div className={`${CONTAINER} p-4`}>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                        {Object.entries(categoryItems.all).map(([category, items]) => (
                          <div key={category}>
                            <div className="mb-2 pb-1.5 border-b border-[#B08946]/40 font-bold text-[#16241F] capitalize text-sm tracking-wide">
                              {category}
                            </div>
                            <div className="flex flex-col gap-1.5">
                              {items.map((subItem) => (
                                <Link
                                  key={subItem}
                                  to={getCategoryLink(category, subItem)}
                                  onClick={() => setMobileCategoryOpen(false)}
                                  className="w-fit text-sm text-[#16241F]/65 transition-colors hover:text-[#B08946]"
                                >
                                  {subItem}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
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