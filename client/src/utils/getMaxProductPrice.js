const DEFAULT_MAX_PRICE = 3000;

const getMaxProductPrice = (products = []) =>
  Math.max(
    DEFAULT_MAX_PRICE,
    ...products.map((product) => Number(product.price) || 0)
  );

export default getMaxProductPrice;
