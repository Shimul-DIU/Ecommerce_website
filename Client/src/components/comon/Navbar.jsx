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
  faRightToBracket,
  faUser,
  faMicrophone,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";

import { authContext } from "../../context/AuthContext";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    isSearchOpen ? (
      <nav className="flex items-center gap-2 px-3  py-3 min-h-14 border" style={{height:  "73.333334px"}}
       >
        <button onClick={() => setIsSearchOpen(false)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <div className="flex items-center bg-gray-200 w-full border-2 border-black rounded-full px-3">
          <input
            type="search"
            placeholder="Search Products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full  pl-2 outline-none"
          />
          <button >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        <button>
          <FontAwesomeIcon icon={faMicrophone} />
        </button>
      </nav>
    ) : (
      <nav className="sticky top-0 bg-white border flex justify-between items-center px-3 py-3">
        <img src={logo} alt="logo" className="h-12" />

        <button onClick={() => setIsSearchOpen(true)}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </nav>
    )
  );
};


export default Navbar;