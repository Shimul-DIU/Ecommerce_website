import assert from "node:assert/strict";
import test from "node:test";
import resolveProductPricing from "./productPricing.js";

test("computes a discounted sale price from the regular price", () => {
  assert.deepEqual(
    resolveProductPricing({
      category: "men",
      price: "1000",
      discountPercent: "20",
    }),
    {
      price: 800,
      originalPrice: 1000,
      discountPercent: 20,
      oldPrice: null,
    }
  );
});

test("keeps the entered price when the discount is zero", () => {
  assert.deepEqual(
    resolveProductPricing({
      category: "men",
      price: "1000",
      discountPercent: "0",
    }),
    {
      price: 1000,
      originalPrice: null,
      discountPercent: 0,
      oldPrice: null,
    }
  );
});

test("continues deriving deal discounts from the old price", () => {
  assert.deepEqual(
    resolveProductPricing({
      category: "deal",
      price: "900",
      oldPrice: "1200",
      discountPercent: "0",
    }),
    {
      price: 900,
      originalPrice: 1200,
      discountPercent: 25,
      oldPrice: 1200,
    }
  );
});

test("rejects discounts outside the supported range", () => {
  assert.deepEqual(
    resolveProductPricing({
      category: "men",
      price: "1000",
      discountPercent: "100",
    }),
    {
      error: {
        discountPercent: "Discount must be a whole number from 0 to 99",
      },
    }
  );
});
