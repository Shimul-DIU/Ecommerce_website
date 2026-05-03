let products = require("../Model/productModel");
const getProducts = (req, res) => {


  const priceRange = req.query.filter_price;


  if (!priceRange) {
    return res.json(products);
  }


  if (!priceRange.includes("-")) {
    return res.status(400).json({ message: "Invalid price format" });
  }

  let [min, max] = priceRange.split("-").map(Number);

  // 👉 NaN check
  if (isNaN(min) || isNaN(max)) {
    return res.status(400).json({ message: "Price must be number" });
  }


  if (min > max) {
    [min, max] = [max, min];
  }


  const filtered = products.filter(
    (p) => p.price >= min && p.price <= max
  );

  res.json(filtered);
};

module.exports = { getProducts };