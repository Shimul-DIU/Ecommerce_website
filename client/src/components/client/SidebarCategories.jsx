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

// id   = product.category (AddProduct er category value)
// slug = product.subCategory (AddProduct er subcategory, normalize kore match hoy)
const categoriesData = [
  {
    id: "perfume",
    name: "Perfume & Fragrance",
    icon: faCrown,
    items: [
      { name: "Men's Perfume", count: "12", slug: "mens-perfume" },
      { name: "Women's Perfume", count: "18", slug: "womens-perfume" },
      { name: "Attar", count: "08", slug: "attar" },
      { name: "Body Spray", count: "10", slug: "body-spray" },
    ],
  },
  {
    id: "jewellery",
    name: "Jewellery",
    icon: faGem,
    items: [
      { name: "Rings", count: "24", slug: "ring" },
      { name: "Necklaces", count: "16", slug: "necklace" },
      { name: "Earrings", count: "30", slug: "earring" },
      { name: "Bracelets", count: "12", slug: "bracelet" },
    ],
  },
  {
    id: "women",
    name: "Women's Fashion",
    icon: faFemale,
    items: [
      { name: "Dresses", count: "45", slug: "dress" },
      { name: "Sarees", count: "22", slug: "saree" },
      { name: "Bags", count: "14", slug: "bag" },
      { name: "Shoes", count: "10", slug: "shoes" },
    ],
  },
  {
    id: "men",
    name: "Men's Fashion",
    icon: faMale,
    items: [
      { name: "T-Shirts", count: "50", slug: "t-shirt" },
      { name: "Shirts", count: "35", slug: "shirt" },
      { name: "Pants", count: "20", slug: "pant" },
      { name: "Shoes", count: "10", slug: "shoes" },
      { name: "Watches", count: "10", slug: "watch" },
    ],
  },
  {
    id: "bags",
    name: "Bags & Luggage",
    icon: faBagShopping,
    items: [
      { name: "Backpacks", count: "20", slug: "backpack" },
      { name: "Handbags", count: "15", slug: "handbag" },
    ],
  },
  {
    id: "glasses",
    name: "Glasses & Eyewear",
    icon: faGlasses,
    items: [{ name: "Sunglasses", count: "32", slug: "sunglasses" }],
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
    <aside className="hidden lg:block w-full bg-white rounded-xl border border-slate-200/80 px-3.5 shadow-sm static top-44 z-10">
      {/* Header */}
      <h2 className="text-xl md:text-2xl lg:text-2xl font-medium pb-2.5 mb-1 border-b border-slate-100">
        Category
      </h2>

      {/* Accordion List */}
      <div className="divide-y divide-slate-100">
        {categoriesData.map((category) => {
          const isOpen = !!openCategories[category.id];

          return (
            <div key={category.id} className="py-2.5">
              <div
                onClick={() => toggleCategory(category.id)}
                className="flex items-center justify-between cursor-pointer group select-none py-1"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shrink-0">
                    <FontAwesomeIcon
                      icon={category.icon}
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <span className="text-base sm:text-lg font-semibold group-hover:text-blue-600 transition-colors truncate">
                    {category.name}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="Toggle category"
                  className="group-hover:text-blue-600 p-1 transition-colors shrink-0"
                >
                  <FontAwesomeIcon
                    icon={isOpen ? faMinus : faPlus}
                    className="text-base sm:text-lg"
                  />
                </button>
              </div>

              {isOpen && (
                <div className="pt-2 pb-1 pl-9 pr-1 space-y-2">
                  {/* Puro category dekhar jonno */}
                  <Link
                    to={`/products?category=${encodeURIComponent(category.id)}`}
                    className="block text-sm font-semibold text-blue-600 hover:underline py-1"
                  >
                    View all
                  </Link>

                  {category.items.map((subItem) => (
                    <Link
                      key={subItem.slug}
                      to={`/products?category=${encodeURIComponent(
                        category.id
                      )}&subcategory=${encodeURIComponent(subItem.slug)}`}
                      className="flex items-center justify-between text-base md:text-lg text-slate-500 hover:text-blue-600 transition-colors py-1 group/item"
                    >
                      <span className="truncate group-hover/item:translate-x-0.5 transition-transform">
                        {subItem.name}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-400 group-hover/item:text-blue-600 shrink-0 ml-1.5">
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