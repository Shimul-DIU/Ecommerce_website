import React from "react";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex border-2 border-b-blue-700 flex-col md:flex-row items-center justify-between px-4 py-3 shadow-md bg-white gap-3">

      {/* Logo */}
      <div className="flex items-center ">
        <img src={logo} alt="icon"  style={{width:'70px',height:'70px'}} />
      </div>

      {/* Search */}
      <div className="flex w-full md:w-1/3">
        <input
          type="search"
          placeholder="Search products..."
          className="w-full border border-gray-300 px-3 py-2 rounded-l-md focus:outline-none focus:border-blue-500"
        />
        <button className="bg-blue-600 text-white px-4 rounded-r-md">
          Search
        </button>
      </div>

      {/* Links */}
      <div className="flex flex-wrap justify-center gap-4 text-gray-700 font-medium">
        <Link className="hover:text-blue-600" to="/">Home</Link>
        <Link className="hover:text-blue-600" to="/categories">Categories</Link>
        <Link className="hover:text-blue-600" to="/products">Products</Link>
        <Link className="hover:text-blue-600" to="/login">Login</Link>
        <Link className="hover:text-blue-600" to="/register">Register</Link>
      </div>

    </nav>
  );
};

export default Navbar;