import { useState } from "react";
import logo from "../../assets/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faSearch,
  faUser,
  faMicrophone,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearchOpen = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setQuery("");
  };

  return isSearchOpen ? (
    <nav
      className="sticky top-0 z-50 flex items-center gap-2 px-3 py-3 bg-white border-b"
      style={{ height: "73.333334px" }}
    >
      <button onClick={handleSearchClose}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <div className="flex items-center w-full bg-gray-100 border rounded-full px-3">
        <input
          type="search"
          placeholder="Search Products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full py-2 pl-2 bg-transparent outline-none"
        />

        <button>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      <button>
        <FontAwesomeIcon icon={faMicrophone} />
      </button>
    </nav>
  ) : (
    <nav className="sticky top-0 z-50 bg-white border-b flex justify-between items-center px-3 py-3">
      <img src={logo} alt="logo" className="h-12" />

      <div className="flex items-center gap-4">
        <button onClick={handleSearchOpen}>
          <FontAwesomeIcon icon={faSearch} />
        </button>

        <button>
          <FontAwesomeIcon icon={faUser} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;