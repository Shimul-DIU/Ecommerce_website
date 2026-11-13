import assert from "node:assert/strict";
import test from "node:test";
import matchesProductSubcategory from "./matchesProductSubcategory.js";

test("matches category labels and product values despite punctuation", () => {
  assert.equal(
    matchesProductSubcategory(
      { subCategory: "T-Shirt", name: "Classic shirt" },
      "tshirt"
    ),
    true
  );
});

test("matches a product name when its subcategory differs", () => {
  assert.equal(
    matchesProductSubcategory(
      { subCategory: "Pants", name: "Slim Fit Jeans" },
      "jeans"
    ),
    true
  );
});

test("does not match an unrelated subcategory", () => {
  assert.equal(
    matchesProductSubcategory({ subCategory: "Dress", name: "Summer Dress" }, "shoes"),
    false
  );
});
