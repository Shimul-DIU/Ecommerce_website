import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faBell,
  faCog,
  faUser,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminNavbar({ toggleSidebar }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  return (
    <nav className="w-full h-16 bg-white border-b flex items-center justify-between px-4 md:px-6 shadow-sm sticky top-0 z-50">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">

        {/* Mobile Menu */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 md:hidden"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        
      </div>

      {/* CENTER SEARCH (DESKTOP) */}
      <div className="hidden md:flex items-center w-1/3 bg-gray-100 px-3 py-2 rounded-lg">
        <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search products, orders..."
          className="bg-transparent outline-none ml-2 w-full text-sm"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* Mobile Search */}
        <button
          onClick={() => setMobileSearch(!mobileSearch)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-md"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-md">
          <FontAwesomeIcon icon={faBell} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="p-2 hover:bg-gray-100 rounded-md hidden sm:block">
          <FontAwesomeIcon icon={faCog} />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <FontAwesomeIcon icon={faChevronDown} />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg overflow-hidden">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                My Profile
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Settings
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE SEARCH */}
      {mobileSearch && (
        <div className="absolute top-16 left-0 w-full bg-white p-3 border-b md:hidden flex items-center gap-2">
          <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full border px-3 py-2 rounded-md outline-none text-sm"
          />
        </div>
      )}
    </nav>
  );
}