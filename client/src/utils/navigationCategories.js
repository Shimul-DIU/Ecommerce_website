export const categoryItems = {
  all: {
    perfume: ["Men's Perfume", "Women's Perfume", "Attar", "Body Spray"],
    jewellery: ["Ring", "Necklace", "Earring", "Bracelet"],
    women: ["Dress", "Saree", "Bag", "Shoes"],
    men: ["T-Shirt", "Shirt", "Pant", "Shoes", "Watch"],
    fishing: [
      "Fishing Rods",
      "Fishing Reels",
      "Fishing Lines",
      "Fishing Hooks",
      "Fishing Lures",
      "Fishing Accessories",
    ],
  },
  perfume: ["Men's Perfume", "Women's Perfume", "Attar", "Body Spray"],
  jewellery: ["Ring", "Necklace", "Earring", "Bracelet"],
  women: ["Dress", "Saree", "Bag", "Shoes"],
  men: ["T-Shirt", "Shirt", "Pant", "Shoes"],
  fishing: [
    "Fishing Rods",
    "Fishing Reels",
    "Fishing Lines",
    "Fishing Hooks",
    "Fishing Lures",
    "Fishing Accessories",
  ],
};

export const getProductCategories = (language) => [
  {
    name: language === "BN" ? "পারফিউম (Perfume)" : "Perfume",
    path: "/products?category=perfume",
  },
  {
    name: language === "BN" ? "জুয়েলারি (Jewellery)" : "Jewellery",
    path: "/products?category=jewellery",
  },
  {
    name: language === "BN" ? "নারী (Women)" : "Women",
    path: "/products?category=women",
  },
  {
    name: language === "BN" ? "পুরুষ (Men)" : "Men",
    path: "/products?category=men",
  },
  {
    name: language === "BN" ? "মাছ ধরা (Fishing)" : "Fishing",
    path: "/products?category=fishing",
  },
];

export const getCategoryLink = (category, subItem) => {
  const subcategory = subItem
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (["men", "women", "fishing"].includes(category)) {
    const filterCategory =
      category === "men" && subcategory === "t-shirt"
        ? "men-tshirt"
        : `${category}-${subcategory.replace(/^fishing-/, "")}`;
    return `/${category}?category=${encodeURIComponent(filterCategory)}`;
  }

  return `/products?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`;
};
