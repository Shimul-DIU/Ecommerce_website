const CATEGORY_ALIASES = {
  "men-fashion": "men",
  "women-fashion": "women",
};

const normalizeProductCategory = (category) => {
  const normalized = String(category || "")
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return CATEGORY_ALIASES[normalized] || normalized;
};

export default normalizeProductCategory;
