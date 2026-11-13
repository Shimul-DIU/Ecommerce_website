import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { LanguageContext } from "../../context/LanguageContext";
import { useTranslation } from "../../utils/translations";
import {
  categoryItems,
  getCategoryLink,
  getProductCategories,
} from "../../utils/navigationCategories";

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { language } = useContext(LanguageContext);
  const [openDropdown, setOpenDropdown] = useState(null);
  const productCategories = getProductCategories(language);
  const navGroups = [
    {
      id: "products",
      label: "Products",
      path: "/products",
      items: productCategories.map(({ name, path }) => ({ label: name, path })),
    },
    ...["women", "men", "fishing"].map((category) => ({
      id: category,
      label: category[0].toUpperCase() + category.slice(1),
      path: `/${category}`,
      items: categoryItems[category].map((subItem) => ({
        label: subItem,
        path: getCategoryLink(category, subItem),
      })),
    })),
  ];

  // Main Link Style (Slightly reduced padding)
  const linkStyle = ({ isActive }) =>
    `block px-4 py-2.5 text-base font-semibold rounded-lg transition-all duration-200 ${isActive
      ? "bg-blue-600 text-white shadow-sm"
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    }`;

  // Sub-link Style (Slightly reduced padding)
  const subLinkStyle = ({ isActive }) =>
    `block px-3.5 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${isActive
      ? "bg-blue-100 text-blue-700 font-bold"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
        className={`fixed left-0 w-72 bg-white shadow-2xl z-50 flex flex-col transform transition-all duration-300 ease-in-out border-r border-gray-100 top-17 h-[calc(100vh-68px)] ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h2 className="text-base font-bold text-gray-800 tracking-wide">
            {t("Categories")}
          </h2>

          <button
            type="button"
            aria-label={t("Close")}
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="text-lg" />
          </button>
        </div>

        {/* Menu List */}
        <ul className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
          {/* All Categories */}
          <li>
            <NavLink to="/categories" onClick={onClose} className={linkStyle}>
              {t("All Categories")}
            </NavLink>
          </li>

          <li>
            <NavLink to="/" onClick={onClose} className={linkStyle}>
              {t("Home")}
            </NavLink>
          </li>

          {navGroups.map((item) => {
            const isOpen = openDropdown === item.id;

            return (
              <li key={item.id}>
                <div className="flex items-center gap-1">
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => `${linkStyle({ isActive })} flex-1`}
                  >
                    {t(item.label)}
                  </NavLink>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdown(isOpen ? null : item.id)
                    }
                    aria-label={`${t(item.label)} categories`}
                    aria-expanded={isOpen}
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`text-xs transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>
                </div>
                {isOpen && (
                  <ul className="ml-3 mt-1 pl-2.5 border-l-2 border-gray-200 space-y-1">
                    {item.items.map((subItem) => (
                      <li key={subItem.path}>
                        <NavLink
                          to={subItem.path}
                          onClick={onClose}
                          className={subLinkStyle}
                        >
                          {t(subItem.label)}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}

          <li>
            <NavLink to="/offers" onClick={onClose} className={linkStyle}>
              {t("Offers")}
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;