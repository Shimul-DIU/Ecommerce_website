const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const normalizeWords = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const containsWordSequence = (words, sequence) =>
  words.some((_, index) =>
    sequence.every((word, offset) => words[index + offset] === word)
  );

const matchesProductSubcategory = (product, subcategory) => {
  const selectedSubcategory = normalize(subcategory);
  if (!selectedSubcategory) return true;

  if (normalize(product?.subCategory) === selectedSubcategory) return true;

  const selectedWords = normalizeWords(subcategory);
  const productNameWords = normalizeWords(product?.name);
  return containsWordSequence(productNameWords, selectedWords);
};

export default matchesProductSubcategory;
