import { useContext, useState } from "react";
import logo from "../../assets/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";

import {
  faCartShopping,
  faBars,
  faXmark,
  faMoon,
  faSun,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { authContext } from "../../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [cartCount] = useState(3);

  const { token } = useContext(authContext);

  const linkClass =
    "hover:text-blue-600 transition text-sm font-medium";

  const mobileLink =
    "px-4 py-3 rounded-lg hover:bg-blue-50 transition";

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">

      {/* ───── TOP BAR ───── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} className="h-12 md:h-14" />
        </Link>


        <div className="md:flex flex-1 max-w-md mx-6">
          <input
            className="w-full px-4 py-2 border rounded-l-full bg-gray-100"
            placeholder="Search products..."
          />
          <button className="bg-blue-600 text-white px-5 rounded-r-full">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-4 text-lg">

          <button onClick={() => setDarkMode(!darkMode)}>
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>

          <Link to="/cart" className="relative">
            <FontAwesomeIcon icon={faCartShopping} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {token ? (
            <NavLink to="/profile">
              <FontAwesomeIcon icon={faUser} />
            </NavLink>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}

          {/* mobile menu button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
          </button>
        </div>
      </div>

      {/* ───── DESKTOP NAV ITEMS (NOW BELOW TOP BAR) ───── */}
      <div className="hidden md:flex items-center gap-6 px-6 pb-3 border-t text-sm">

        <NavLink className={linkClass} to="/">Home</NavLink>
        <NavLink className={linkClass} to="/categories">Categories</NavLink>
        <NavLink className={linkClass} to="/products">Products</NavLink>

        <NavLink className={linkClass} to="/admin/login">
          Admin
        </NavLink>

      </div>

      {/* ───── MOBILE MENU ───── */}
      {menuOpen && (
        <>
          {/* overlay */}
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* sidebar */}
          <div className="fixed top-0 left-0 w-72 h-screen bg-white z-50 shadow-xl flex flex-col">

            <div className="flex justify-between items-center p-4 border-b">
              <img src={logo} className="h-10" />
              <button onClick={() => setMenuOpen(false)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="flex flex-col p-4 gap-2 text-sm">

              <Link onClick={() => setMenuOpen(false)} className={mobileLink} to="/">
                Home
              </Link>

              <Link onClick={() => setMenuOpen(false)} className={mobileLink} to="/categories">
                Categories
              </Link>

              <Link onClick={() => setMenuOpen(false)} className={mobileLink} to="/products">
                Products
              </Link>

              <Link onClick={() => setMenuOpen(false)} className={mobileLink} to="/admin/login">
                Admin
              </Link>

            </div>
          </div>
        </>
      )}

    </header>
  );
};

export default Navbar;