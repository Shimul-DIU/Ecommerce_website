import { useMemo, useState } from "react";
import getMaxProductPrice from "../utils/getMaxProductPrice.js";

const MIN_PRICE = 0;
const SLIDER_STEPS = 300;

const useProductPriceRange = (products) => {
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(null);

  const maxAvailablePrice = useMemo(
    () => getMaxProductPrice(products),
    [products]
  );
  const maxPrice = selectedMaxPrice ?? maxAvailablePrice;
  const priceStep = Math.max(
    1,
    Math.ceil((maxAvailablePrice - MIN_PRICE) / SLIDER_STEPS)
  );
  const priceRange = maxAvailablePrice - MIN_PRICE;
  const minPercent =
    priceRange > 0 ? ((minPrice - MIN_PRICE) / priceRange) * 100 : 0;
  const maxPercent =
    priceRange > 0 ? ((maxPrice - MIN_PRICE) / priceRange) * 100 : 100;

  const resetPriceRange = () => {
    setMinPrice(MIN_PRICE);
    setSelectedMaxPrice(null);
  };

  return {
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice: setSelectedMaxPrice,
    maxAvailablePrice,
    priceStep,
    minPercent,
    maxPercent,
    resetPriceRange,
  };
};

export default useProductPriceRange;
