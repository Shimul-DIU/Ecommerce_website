import assert from "node:assert/strict";
import test from "node:test";
import getMaxProductPrice from "./getMaxProductPrice.js";

test("expands the default price ceiling to include higher-priced products", () => {
  assert.equal(getMaxProductPrice([{ price: 3200 }]), 3200);
  assert.equal(getMaxProductPrice([{ price: "50064" }]), 50064);
});

test("keeps the existing default ceiling when all products cost less", () => {
  assert.equal(getMaxProductPrice([{ price: 2500 }, { price: 800 }]), 3000);
});
