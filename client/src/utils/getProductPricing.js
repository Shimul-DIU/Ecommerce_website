const getProductPricing = (product = {}) => {
  const price = Number(product.price ?? 0);
  const rawOriginalPrice = product.originalPrice ?? product.oldPrice;
  const storedOriginalPrice =
    rawOriginalPrice === undefined || rawOriginalPrice === null
      ? price
      : Number(rawOriginalPrice);
  const originalPrice =
    Number.isFinite(storedOriginalPrice) && storedOriginalPrice > price
      ? storedOriginalPrice
      : price;

  const rawDiscount =
    product.discountPercent ?? product.discount;
  const storedDiscount =
    rawDiscount === undefined || rawDiscount === null || rawDiscount === ""
      ? null
      : Number(rawDiscount);
  const discountPercent =
    storedDiscount !== null &&
    Number.isFinite(storedDiscount) &&
    storedDiscount > 0
      ? storedDiscount
      : originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

  return {
    price,
    originalPrice,
    discountPercent: Math.max(0, discountPercent),
    savingsAmount: Math.max(0, originalPrice - price),
  };
};

export default getProductPricing;
