import assert from "node:assert/strict";
import test from "node:test";
import matchesProductCategory from "./matchesProductCategory.js";

test("matches a new-arrival product under its selected navigation category", () => {
  assert.equal(
    matchesProductCategory(
      {
        category: "new-arrival",
        subcategoryCategory: "women",
        subCategory: "Dress",
      },
      "women"
    ),
    true
  );
});

test("does not match a new-arrival product under a different category", () => {
  assert.equal(
    matchesProductCategory(
      { category: "new-arrival", subcategoryCategory: "women" },
      "men"
    ),
    false
  );
});

test("infers the parent category of legacy new-arrival products from subcategory", () => {
  assert.equal(
    matchesProductCategory(
      { category: "new-arrival", subCategory: "Dress" },
      "women"
    ),
    true
  );
  assert.equal(
    matchesProductCategory(
      { category: "new-arrival", subCategory: "Dress" },
      "men"
    ),
    false
  );
});

test("uses product name hints to resolve legacy duplicate subcategories", () => {
  assert.equal(
    matchesProductCategory(
      {
        category: "new-arrival",
        subCategory: "Shoes",
        name: "Men's Running Shoes",
      },
      "men"
    ),
    true
  );
  assert.equal(
    matchesProductCategory(
      {
        category: "new-arrival",
        subCategory: "Shoes",
        name: "Men's Running Shoes",
      },
      "women"
    ),
    false
  );
});

test("continues matching regular products by their own category", () => {
  assert.equal(
    matchesProductCategory({ category: "men", subCategory: "T-Shirt" }, "men"),
    true
  );
});
