const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const matchesProductSubcategory = (product, subcategory) => {
  const selectedSubcategory = normalize(subcategory);
  if (!selectedSubcategory) return true;

  return (
    normalize(product?.subCategory) === selectedSubcategory ||
    normalize(product?.name).includes(selectedSubcategory)
  );
};

export default matchesProductSubcategory;
