import assert from "node:assert/strict";
import test from "node:test";
import getProductPricing from "./getProductPricing.js";

test("uses the stored price and discount for a discounted product", () => {
  assert.deepEqual(
    getProductPricing({
      price: 800,
      originalPrice: 1000,
      discountPercent: 20,
    }),
    {
      price: 800,
      originalPrice: 1000,
      discountPercent: 20,
      savingsAmount: 200,
    }
  );
});

test("does not invent a discount when the product has no discount data", () => {
  assert.deepEqual(getProductPricing({ price: 1000 }), {
    price: 1000,
    originalPrice: 1000,
    discountPercent: 0,
    savingsAmount: 0,
  });
});

test("derives legacy deal discounts from the old price", () => {
  assert.deepEqual(
    getProductPricing({ price: 900, oldPrice: 1200 }),
    {
      price: 900,
      originalPrice: 1200,
      discountPercent: 25,
      savingsAmount: 300,
    }
  );
});
