import PRODUCT_SUBCATEGORIES from "./productSubcategories.js";
import normalizeProductCategory from "./normalizeProductCategory.js";

const normalize = normalizeProductCategory;

const matchesProductCategory = (product, category) => {
  const productCategory = normalize(product?.category);
  const selectedCategory = normalize(category);

  if (productCategory === selectedCategory) return true;
  if (productCategory !== "new-arrival") return false;

  const savedParentCategory = normalize(product?.subcategoryCategory);
  if (savedParentCategory) return savedParentCategory === selectedCategory;

  const subcategory = normalize(product?.subCategory);
  const possibleParents = Object.entries(PRODUCT_SUBCATEGORIES)
    .filter(([, subcategories]) =>
      subcategories.some((item) => normalize(item) === subcategory)
    )
    .map(([parent]) => parent);

  if (possibleParents.length <= 1) {
    return possibleParents[0] === selectedCategory;
  }

  const name = String(product?.name || "").toLowerCase();
  const hasMasculineHint = /\b(men|boy|male)\b/.test(name);
  const hasFeminineHint = /\b(women|woman|female|girl|ladies)\b/.test(name);

  if (hasMasculineHint !== hasFeminineHint) {
    const hintedParent = hasMasculineHint ? "men" : "women";
    return possibleParents.includes(hintedParent) && hintedParent === selectedCategory;
  }

  return possibleParents.includes(selectedCategory);
};

export default matchesProductCategory;
