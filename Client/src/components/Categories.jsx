import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const categories = {
  perfume: ["Men's Perfume", "Women's Perfume"],
  jewellery: ["Ring", "Necklace", "Earring"],
  women: ["Dress", "Saree", "Bag", "Shoes"],
  men: ["T-Shirt", "Shirt", "Pant", "Shoes", "Watch"],
};

const categoryLabels = {
  perfume: "Perfume",
  jewellery: "Jewellery",
  women: "Women",
  men: "Men",
};

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const Categories = () => {
  const [openCategory, setOpenCategory] = useState(Object.keys(categories)[0]);

  const toggleCategory = (key) => {
    setOpenCategory((prev) => (prev === key ? null : key));
  };

  return (
    <aside className="w-full max-w-xs bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
        Categories
      </h2>

      <ul className="space-y-1">
        {Object.keys(categories).map((key) => {
          const isOpen = openCategory === key;

          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => toggleCategory(key)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left font-semibold text-gray-800 hover:bg-gray-50 transition-colors duration-150"
              >
                <span>{categoryLabels[key]}</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-xs text-gray-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[#CF15D4]" : ""
                  }`}
                />
              </button>

              <ul
                className={`overflow-hidden transition-all duration-200 ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {categories[key].map((item) => (
                  <li key={item}>
                    <NavLink
                      to={`/category/${key}/${slugify(item)}`}
                      className={({ isActive }) =>
                        `block pl-6 pr-3 py-2 text-sm rounded-lg transition-colors duration-150 ${
                          isActive
                            ? "text-[#CF15D4] font-semibold bg-[#CF15D4]/5"
                            : "text-gray-600 hover:text-[#CF15D4] hover:bg-gray-50"
                        }`
                      }
                    >
                      {item}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Categories;
