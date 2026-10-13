import Product, { NO_SUBCATEGORY } from "../model/products.js";

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
      dealEndsAt,
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

    // ---------- Deal validation ----------
    if (isDeal) {
      if (Number(oldPrice) <= Number(price)) {
        return res.status(400).json({
          success: false,
          error: { oldPrice: "Old price must be greater than deal price" },
        });
      }

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
      price,
      stock,
      description,
      image,
      oldPrice: isDeal ? oldPrice : null,
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