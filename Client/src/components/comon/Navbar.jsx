import { useState } from "react";
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
} from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ onMenuClick }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    {
      name: "Categories",
      path: "/categories",
      dropdown: true
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

  const handleSearchOpen = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
          <nav className="hidden md:flex sticky top-0 z-50 bg-white shadow-md h-16 items-center justify-between px-8">
            <Link to="/">
              <img src={logo} alt="logo" className="h-11" />
            </Link>

            <div className="flex items-center gap-8 font-medium">
              {navItems.map((item) => (
                <div key={item.path} className="relative">
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className="flex items-center gap-1 hover:text-blue-600 transition"
                      >
                        {item.name}
                        <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                      </button>

                      {/* Dropdown Menu */}
                      {isCategoryOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border">
                          {Object.entries(categoryItems).map(([category, items]) => (
                            <div key={category} className="px-4 py-1 ">
                              <div className="font-semibold  text-gray-700 capitalize">
                                {category}
                              </div>
                              {items.map((item) => (
                                <Link
                                  key={item}
                                  to={`/${category}/${item.toLowerCase().replace(/ /g, '-')}`}
                                  className="block text-sm text-gray-600 hover:text-blue-600 py-1 pl-2"
                                >
                                  {item}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={item.path}
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
            </div>

            <div className="flex items-center gap-5">
              <div className="flex items-center border rounded-full px-4 w-80">
                <input
                  type="text"
                  placeholder="Search Products..."
                  className="flex-1 py-2 outline-none"
                />
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <Link to="/cart" className="text-xl hover:text-blue-600 transition">
                <FontAwesomeIcon icon={faCartShopping} />
              </Link>
              <Link to="/profile" className="text-xl hover:text-blue-600 transition">
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

        <button
          onClick={onMenuClick}
          className="flex flex-col items-center text-xs text-gray-600"
        >
          <FontAwesomeIcon icon={faBars} />
          <span className="mt-1">Menu</span>
        </button>

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

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-blue-600" : "text-gray-600"
            }`
          }
        >
          <FontAwesomeIcon icon={faUser} />
          <span className="mt-1">Profile</span>
        </NavLink>
      </footer>
    </>
  );
};

export default Navbar;