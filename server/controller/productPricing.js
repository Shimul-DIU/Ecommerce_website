const resolveProductPricing = ({
  category,
  price,
  oldPrice,
  discountPercent,
}) => {
  const regularPrice = Number(price);
  if (!Number.isFinite(regularPrice) || regularPrice < 0) {
    return { error: { price: "Price must be a non-negative number" } };
  }

  if (category === "deal") {
    const dealOriginalPrice = Number(oldPrice);
    if (!Number.isFinite(dealOriginalPrice) || dealOriginalPrice <= regularPrice) {
      return { error: { oldPrice: "Old price must be greater than deal price" } };
    }

    return {
      price: regularPrice,
      originalPrice: dealOriginalPrice,
      discountPercent: Math.round(
        ((dealOriginalPrice - regularPrice) / dealOriginalPrice) * 100
      ),
      oldPrice: dealOriginalPrice,
    };
  }

  const discount =
    discountPercent === undefined || discountPercent === ""
      ? 0
      : Number(discountPercent);
  if (!Number.isInteger(discount) || discount < 0 || discount > 99) {
    return {
      error: {
        discountPercent: "Discount must be a whole number from 0 to 99",
      },
    };
  }
  if (discount > 0 && regularPrice === 0) {
    return {
      error: {
        price: "Price must be greater than zero when a discount is set",
      },
    };
  }

  return {
    price: Math.round((regularPrice * (100 - discount)) / 100),
    originalPrice: discount > 0 ? regularPrice : null,
    discountPercent: discount,
    oldPrice: null,
  };
};

export default resolveProductPricing;
