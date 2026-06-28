import { useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBars,
  faCartShopping,
  faHouse,
  faMicrophone,
  faSearch,
  faUser,
  faChevronDown,
  faBagShopping,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ onMenuClick }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const closeTimer = useRef(null);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    {
      name: "Categories",
      path: "/categories",
      dropdown: true,
    },
    { name: "Offers", path: "/offers" },
    { name: "Contact", path: "/contact" },
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
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* ================= MOBILE SEARCH ================= */}
      {searchOpen ? (
        <nav className="md:hidden sticky top-0 z-50 bg-blue-600 px-3 py-3 flex items-center gap-2">
          <button onClick={handleSearchClose}>
            <FontAwesomeIcon icon={faArrowLeft} className="text-white text-lg" />
          </button>
          <div className="flex-1 flex items-center bg-white rounded-full px-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Products..."
              className="flex-1 py-2 outline-none bg-transparent"
            />
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <button>
            <FontAwesomeIcon icon={faMicrophone} className="text-white text-lg" />
          </button>
        </nav>
      ) : (
        <>
          {/* ================= DESKTOP NAVBAR ================= */}
          <nav className="hidden md:flex sticky top-0 z-50 bg-white shadow-md h-16 items-center px-8 gap-6">

            {/* Left — Logo (always visible) */}
            <Link to="/" className="shrink-0">
              <img src={logo} alt="logo" className="h-11" />
            </Link>

            {/* Center — Search Bar */}
            <div className="flex-1 flex justify-center">
              <div
                className={`flex items-center border rounded-full px-4 w-80 transition-all duration-200 ${
                  searchFocused
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : "hover:ring-2 hover:ring-blue-300 hover:border-blue-300"
                }`}
              >
                <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search Products..."
                  className="flex-1 py-2 outline-none bg-transparent"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </div>

            {/* Right — Nav Items + Icons */}
            <div className="flex items-center gap-6 font-medium shrink-0">
              {navItems.map((item) => (
                <div
                  key={item.path}
                  className="relative"
                  onMouseEnter={item.dropdown ? handleMouseEnter : undefined}
                  onMouseLeave={item.dropdown ? handleMouseLeave : undefined}
                >
                  {item.dropdown ? (
                    <>
                      <button className="flex items-center gap-1 hover:text-blue-600 transition">
                        {item.name}
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`text-xs transition-transform duration-200 ${
                            isCategoryOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {isCategoryOpen && (
                        <div
                          className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 border z-50"
                          style={{ minWidth: "320px" }}
                        >
                          <div className="flex flex-wrap">
                            {Object.entries(categoryItems).map(([category, items]) => (
                              <div
                                key={category}
                                className="px-4 py-2 flex-1"
                                style={{ minWidth: "120px" }}
                              >
                                <div className="font-semibold text-gray-700 capitalize text-sm mb-1">
                                  {category}
                                </div>
                                {items.map((subItem) => (
                                  <Link
                                    key={subItem}
                                    to={`/${category}/${subItem.toLowerCase().replace(/ /g, "-")}`}
                                    onClick={() => setIsCategoryOpen(false)}
                                    className="block text-sm text-gray-600 hover:text-blue-600 py-0.5 pl-2"
                                  >
                                    {subItem}
                                  </Link>
                                ))}
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
                        isActive
                          ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                          : "hover:text-blue-600 transition"
                      }
                    >
                      {item.name}
                    </NavLink>
                  )}
                </div>
              ))}

              {/* Cart & Profile */}
              <Link
                to="/cart"
                onClick={() => setIsCategoryOpen(false)}
                className="text-xl hover:text-blue-600 transition"
              >
                <FontAwesomeIcon icon={faCartShopping} />
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsCategoryOpen(false)}
                className="text-xl hover:text-blue-600 transition"
              >
                <FontAwesomeIcon icon={faUser} />
              </Link>
            </div>
          </nav>

          {/* ================= MOBILE NAVBAR ================= */}
          <nav className="md:hidden sticky top-0 z-50 bg-white shadow-md flex items-center justify-between px-3 py-3">
            <button onClick={onMenuClick}>
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>
            <Link to="/">
              <img src={logo} alt="logo" className="h-10" />
            </Link>
            <div className="flex items-center gap-5">
              <button onClick={handleSearchOpen}>
                <FontAwesomeIcon icon={faSearch} className="text-lg" />
              </button>
              <Link to="/profile">
                <FontAwesomeIcon icon={faUser} className="text-lg" />
              </Link>
            </div>
          </nav>
        </>
      )}

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <footer className="md:hidden fixed bottom-0 left-0 z-50 w-full bg-white border-t shadow-lg flex justify-around py-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-blue-600" : "text-gray-600"
            }`
          }
        >
          <FontAwesomeIcon icon={faHouse} />
          <span className="mt-1">Home</span>
        </NavLink>

        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-blue-600" : "text-gray-600"
            }`
          }
        >
          <FontAwesomeIcon icon={faBagShopping} />
          <span className="mt-1">Shop</span>
        </NavLink>

        <NavLink
          to="/offers"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-blue-600" : "text-gray-600"
            }`
          }
        >
          <FontAwesomeIcon icon={faTag} />
          <span className="mt-1">Offers</span>
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-blue-600" : "text-gray-600"
            }`
          }
        >
          <FontAwesomeIcon icon={faCartShopping} />
          <span className="mt-1">Cart</span>
        </NavLink>
      </footer>
    </>
  );
};

export default Navbar;