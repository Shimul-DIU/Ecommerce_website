import mongoose from "mongoose";
import Product, { NO_SUBCATEGORY } from "../model/products.js";
import resolveProductPricing from "./productPricing.js";

// ============================================================
// ADD PRODUCT (admin)
// ============================================================
export const productController = async (req, res) => {
  try {
    const {
      name,
      category,
      subCategory,
      status,
      price,
      stock,
      description,
      oldPrice,
      discountPercent,
      dealEndsAt,
      homepageSection,
    } = req.body || {};

    const isDeal = category === "deal";

    // ---------- Required fields ----------
    const fields = { name, category, status, price, stock };

    // sub category শুধু সেই category-তে লাগবে যেখানে আছে
    if (!NO_SUBCATEGORY.includes(category)) {
      fields.subCategory = subCategory;
    }

    // deal হলে এই দুটোও লাগবে
    if (isDeal) {
      fields.oldPrice = oldPrice;
      fields.dealEndsAt = dealEndsAt;
    }

    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined || value === null || value === "") {
        return res.status(400).json({
          success: false,
          error: { [key]: `${key} is required` },
        });
      }
    }

    const pricing = resolveProductPricing({
      category,
      price,
      oldPrice,
      discountPercent,
    });
    if (pricing.error) {
      return res.status(400).json({
        success: false,
        error: pricing.error,
      });
    }

    // ---------- Deal validation ----------
    if (isDeal) {
      const endDate = new Date(dealEndsAt);

      if (isNaN(endDate.getTime()) || endDate <= new Date()) {
        return res.status(400).json({
          success: false,
          error: { dealEndsAt: "Deal end time must be in the future" },
        });
      }
    }

    // ---------- Image ----------
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { image: "Image is required" },
      });
    }

    // Windows-এ local upload হলে backslash থাকে, তাই ঠিক করে নিচ্ছি
    // (Cloudinary URL হলে কোনো পরিবর্তন হবে না)
    const image = req.file.path.replace(/\\/g, "/");

    const newProduct = new Product({
      name,
      category,
      subCategory: subCategory || "",
      status,
      ...pricing,
      stock,
      description,
      homepageSection: homepageSection || "none",
      image,
      dealEndsAt: isDeal ? new Date(dealEndsAt) : null,
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.fromEntries(
        Object.entries(error.errors).map(([key, value]) => [key, value.message])
      );

      return res.status(400).json({
        success: false,
        error: validationErrors,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal Server Error",
    });
  }
};

export const getAdminProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Get admin product error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const body = req.body || {};
    const category = body.category ?? product.category;
    const name = body.name ?? product.name;
    const subCategory = body.subCategory ?? product.subCategory;
    const status = body.status ?? product.status;
    const price =
      body.price ??
      (category === "deal"
        ? product.price
        : product.originalPrice ?? product.price);
    const discountPercent =
      body.discountPercent ?? product.discountPercent ?? 0;
    const oldPrice =
      category === "deal"
        ? body.oldPrice ?? product.oldPrice
        : null;
    const stock = body.stock ?? product.stock;
    const description = body.description ?? product.description;
    const dealEndsAt =
      category === "deal" ? body.dealEndsAt ?? product.dealEndsAt : null;

    if (!String(name).trim() || !String(category).trim() || !String(status).trim()) {
      return res.status(400).json({
        success: false,
        error: { name: "Name, category, and status are required" },
      });
    }

    if (!NO_SUBCATEGORY.includes(category) && !String(subCategory || "").trim()) {
      return res.status(400).json({
        success: false,
        error: { subCategory: "Sub category is required" },
      });
    }

    const pricing = resolveProductPricing({
      category,
      price,
      oldPrice,
      discountPercent,
    });
    if (pricing.error) {
      return res.status(400).json({ success: false, error: pricing.error });
    }

    let parsedDealEnd = null;
    if (category === "deal") {
      parsedDealEnd = new Date(dealEndsAt);
      if (isNaN(parsedDealEnd.getTime())) {
        return res.status(400).json({
          success: false,
          error: { dealEndsAt: "A valid deal end time is required" },
        });
      }
    }

    product.set({
      name: String(name).trim(),
      category,
      subCategory: subCategory || "",
      status,
      ...pricing,
      stock,
      description,
      homepageSection: body.homepageSection ?? product.homepageSection,
      dealEndsAt: parsedDealEnd,
      ...(req.file
        ? { image: req.file.path.replace(/\\/g, "/") }
        : {}),
    });

    await product.save();
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.fromEntries(
        Object.entries(error.errors).map(([key, value]) => [key, value.message])
      );
      return res.status(400).json({ success: false, error: validationErrors });
    }

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to update product",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      productId: product._id,
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};

// ============================================================
// ALL PRODUCTS (admin list)
// ============================================================
export const DisplayProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

// ============================================================
// DEAL OF THE DAY (public)
// ============================================================
export const getDeals = async (req, res) => {
  try {
    const deals = await Product.find({
      category: "deal",
      status: "Active",
      dealEndsAt: { $gt: new Date() },
    }).sort({ dealEndsAt: 1 });

    res.status(200).json({
      success: true,
      data: deals,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};