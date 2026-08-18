import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faPlus,
  faMinus,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useScroll } from "../../hooks/useScroll";

const Sidebar = ({ isOpen, onClose }) => {
  const isScrolled = useScroll();
  const [menOpen, setMenOpen] = useState(false);
  const [womenOpen, setWomenOpen] = useState(false);
  const [jewelryOpen, setJewelryOpen] = useState(false);
  const [perfumeOpen, setPerfumeOpen] = useState(false);

  // Active & Normal Link Design Styles
  const linkStyle = ({ isActive }) =>
    `block px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
      ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    }`;

  const subLinkStyle = ({ isActive }) =>
    `block px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${isActive
      ? "text-blue-600 font-semibold bg-blue-50/60"
      : "text-gray-600 hover:bg-gray-200/60 hover:text-gray-900"
    }`;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 w-72 bg-white shadow-2xl z-50 flex flex-col transform transition-all duration-300 ease-in-out border-r border-gray-100 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } top-[68px] h-[calc(100vh-68px)]"
          `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
          <h2 className="text-base font-bold text-gray-800 tracking-wide">
            Categories
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="text-lg" />
          </button>
        </div>

        {/* Menu (Scrollable List) */}
        <ul className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
          {/* Home */}
          <li>
            <NavLink to="/" onClick={onClose} className={linkStyle}>
              Home
            </NavLink>
          </li>

          {/* Products */}
          <li>
            <NavLink to="/products" onClick={onClose} className={linkStyle}>
              Products
            </NavLink>
          </li>

          {/* Men's Submenu */}
          <li>
            <button
              onClick={() => setMenOpen(!menOpen)}
              className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>Men's</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-xs text-gray-400 transition-transform duration-200 ${menOpen ? "rotate-180 text-blue-600" : ""
                  }`}
              />
            </button>

            {menOpen && (
              <ul className="ml-3 mt-1 pl-3 border-l-2 border-gray-100 space-y-1">
                <li>
                  <NavLink to="/men/shirt" onClick={onClose} className={subLinkStyle}>
                    Shirt
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/men/shorts-jeans" onClick={onClose} className={subLinkStyle}>
                    Shorts & Jeans
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/men/safety-shoes" onClick={onClose} className={subLinkStyle}>
                    Safety Shoes
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/men/wallet" onClick={onClose} className={subLinkStyle}>
                    Wallet
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Women's Submenu */}
          <li>
            <button
              onClick={() => setWomenOpen(!womenOpen)}
              className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>Women's</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-xs text-gray-400 transition-transform duration-200 ${womenOpen ? "rotate-180 text-blue-600" : ""
                  }`}
              />
            </button>

            {womenOpen && (
              <ul className="ml-3 mt-1 pl-3 border-l-2 border-gray-100 space-y-1">
                <li>
                  <NavLink to="/women/dress-frock" onClick={onClose} className={subLinkStyle}>
                    Dress & Frock
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/women/earrings" onClick={onClose} className={subLinkStyle}>
                    Earrings
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/women/necklace" onClick={onClose} className={subLinkStyle}>
                    Necklace
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/women/makeup-kit" onClick={onClose} className={subLinkStyle}>
                    Makeup Kit
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Jewellery Submenu */}
          <li>
            <button
              onClick={() => setJewelryOpen(!jewelryOpen)}
              className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>Jewellery</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-xs text-gray-400 transition-transform duration-200 ${jewelryOpen ? "rotate-180 text-blue-600" : ""
                  }`}
              />
            </button>

            {jewelryOpen && (
              <ul className="ml-3 mt-1 pl-3 border-l-2 border-gray-100 space-y-1">
                <li>
                  <NavLink to="/jewellery/earrings" onClick={onClose} className={subLinkStyle}>
                    Earrings
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/jewellery/couple-rings" onClick={onClose} className={subLinkStyle}>
                    Couple Rings
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/jewellery/necklace" onClick={onClose} className={subLinkStyle}>
                    Necklace
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/jewellery/bracelets" onClick={onClose} className={subLinkStyle}>
                    Bracelets
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Perfume Submenu */}
          <li>
            <button
              onClick={() => setPerfumeOpen(!perfumeOpen)}
              className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>Perfume</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-xs text-gray-400 transition-transform duration-200 ${perfumeOpen ? "rotate-180 text-blue-600" : ""
                  }`}
              />
            </button>

            {perfumeOpen && (
              <ul className="ml-3 mt-1 pl-3 border-l-2 border-gray-100 space-y-1">
                <li>
                  <NavLink to="/perfume/clothes-perfume" onClick={onClose} className={subLinkStyle}>
                    Clothes Perfume
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/perfume/deodorant" onClick={onClose} className={subLinkStyle}>
                    Deodorant
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/perfume/flower-fragrance" onClick={onClose} className={subLinkStyle}>
                    Flower Fragrance
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/perfume/air-freshener" onClick={onClose} className={subLinkStyle}>
                    Air Freshener
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Profile */}
          <li>
            <NavLink to="/profile" onClick={onClose} className={linkStyle}>
              Profile
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;