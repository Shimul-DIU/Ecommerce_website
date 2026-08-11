import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faCrown,
  faGem,
  faFemale,
  faMale,
  faBagShopping,
  faGlasses,
} from "@fortawesome/free-solid-svg-icons";

const categoriesData = [
  {
    id: "perfume",
    name: "Perfume & Fragrance",
    icon: faCrown,
    items: [
      { name: "Men's Perfume", count: "12", path: "/category/mens-perfume" },
      { name: "Women's Perfume", count: "18", path: "/category/womens-perfume" },
      { name: "Attar & Oils", count: "08", path: "/category/attar" },
    ],
  },
  {
    id: "jewellery",
    name: "Jewellery",
    icon: faGem,
    items: [
      { name: "Rings", count: "24", path: "/category/rings" },
      { name: "Necklaces", count: "16", path: "/category/necklaces" },
      { name: "Earrings", count: "30", path: "/category/earrings" },
    ],
  },
  {
    id: "women",
    name: "Women's Fashion",
    icon: faFemale,
    items: [
      { name: "Dresses", count: "45", path: "/category/dresses" },
      { name: "Sarees", count: "22", path: "/category/sarees" },
      { name: "Bags", count: "14", path: "/category/bags" },
    ],
  },
  {
    id: "men",
    name: "Men's Fashion",
    icon: faMale,
    items: [
      { name: "T-Shirts", count: "50", path: "/category/t-shirts" },
      { name: "Shirts", count: "35", path: "/category/shirts" },
    ],
  },
  {
    id: "bags",
    name: "Bags & Luggage",
    icon: faBagShopping,
    items: [
      { name: "Backpacks", count: "20", path: "/category/backpacks" },
      { name: "Handbags", count: "15", path: "/category/handbags" },
    ],
  },
  {
    id: "glasses",
    name: "Glasses & Eyewear",
    icon: faGlasses,
    items: [
      { name: "Sunglasses", count: "32", path: "/category/sunglasses" },
    ],
  },
];

const SidebarCategories = () => {
  const [openCategories, setOpenCategories] = useState({});

  const toggleCategory = (id) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (

    <aside className="hidden lg:block  w-full  bg-white rounded-xl border border-slate-200/80 px-3.5   shadow-sm static top-44 z-10">
      {/* Header */}
      <h2 className="text-lg md:text-xl lg:text-2xl font-medium   pb-2.5 mb-1 border-b border-slate-100">
        Category
      </h2>
      {/* Accordion List */}
      <div className="divide-y divide-slate-100">
        {categoriesData.map((category) => {
          const isOpen = !!openCategories[category.id];

          return (
            <div key={category.id} className="py-2">
              <div
                onClick={() => toggleCategory(category.id)}
                className="flex items-center justify-between cursor-pointer group select-none py-0.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center  group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shrink-0">
                    <FontAwesomeIcon icon={category.icon} className="text-xs sm:text-sm" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold  group-hover:text-blue-600 transition-colors truncate">
                    {category.name}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="Toggle category"
                  className=" group-hover:text-blue-600 p-0.5 transition-colors shrink-0"
                >
                  <FontAwesomeIcon
                    icon={isOpen ? faMinus : faPlus}
                    className="text-sm sm:text-base"
                  />
                </button>
              </div>

              {isOpen && (
                <div className="pt-1.5 pb-1 pl-8 pr-1 space-y-1.5">
                  {category.items.map((subItem, index) => (
                    <Link
                      key={index}
                      to={subItem.path}
                      className="flex items-center justify-between  text-sm md:text-base text-slate-500 hover:text-blue-600 transition-colors py-0.5 group/item"
                    >
                      <span className="truncate group-hover/item:translate-x-0.5 transition-transform">
                        {subItem.name}
                      </span>
                      <span className="text-[10px] text-slate-400 group-hover/item:text-blue-600 shrink-0 ml-1">
                        ({subItem.count})
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default SidebarCategories;