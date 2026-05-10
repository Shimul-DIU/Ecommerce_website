import React, { useState } from "react";
import logo from "../../assets/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faBars,
  faXmark,
  faMoon,
  faSun,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [cartCount] = useState(3);

  return (
    <header className="w-full sticky top-0 z-50 shadow-md  text-gray-800">

      {/* ── DESKTOP VIEW ── */}
      <nav className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-6 py-3 gap-6 ">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
        </Link>

        {/* Search Bar */}
        <div className="flex flex-1 max-w-md">
          <input
            type="search"
            placeholder="Search products..."
            className="w-full border px-4 py-2 rounded-l-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-100 border-gray-300 placeholder:italic"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-r-full transition text-sm">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        {/* Nav Links */}
        <ul className="flex items-center gap-6 text-sm font-medium">
          <li><Link to="/" className="hover:text-blue-600 transition-colors duration-200">Home</Link></li>
          <li><Link to="/categories" className="hover:text-blue-600 transition-colors duration-200">Categories</Link></li>
          <li><Link to="/products" className="hover:text-blue-600 transition-colors duration-200">Products</Link></li>
          <li><Link to="/login" className="hover:text-blue-600 transition-colors duration-200">Login</Link></li>
          <li><Link to="/register" className="hover:text-blue-600 transition-colors duration-200">Register</Link></li>
        </ul>

        {/* Action Icons */}
        <div className="flex items-center gap-4 text-lg">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="hover:text-blue-500 transition"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>

          <Link to="/cart" className="relative hover:text-blue-500 transition">
            <FontAwesomeIcon icon={faCartShopping} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* ── MOBILE VIEW ── */}
      <nav className="md:hidden">

        {/* Top Row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          </Link>

          <div className="flex items-center gap-4 text-lg">
            <button onClick={() => setDarkMode(!darkMode)} className="hover:text-blue-500 transition">
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>

            <Link to="/cart" className="relative hover:text-blue-500 transition">
              <FontAwesomeIcon icon={faCartShopping} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hover:text-blue-500 transition"
            >
              <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex px-4 py-2 border-b border-gray-200 bg-gray-50">
          <input
            type="search"
            placeholder="Search products..."
            className="w-full border px-3 py-2 rounded-l-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white border-gray-300 placeholder:italic"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-full transition text-sm">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        {/* Collapsible Menu */}
        {menuOpen && (
          <div className="flex flex-col px-4 py-3 gap-3 text-sm font-medium border-b border-gray-200 bg-white">
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 transition-colors duration-200 py-1 border-b border-dashed border-gray-200">Home</Link>
            <Link to="/categories" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 transition-colors duration-200 py-1 border-b border-dashed border-gray-200">Categories</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 transition-colors duration-200 py-1 border-b border-dashed border-gray-200">Products</Link>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 transition-colors duration-200 py-1 border-b border-dashed border-gray-200">Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 transition-colors duration-200 py-1">Register</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;