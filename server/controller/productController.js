import Product from "../model/products.js";
export const productController = async (req, res) => {
  try {
    const { name, category, status, price, stock, description } = req.body;
    const fields = { name, category, status, price, stock, description };

    for (const [key, value] of Object.entries(fields)) {
      if (!value) {
        return res.status(400).json({
          success: false,
          error: { [key]: `${key} is required` },
        });
      }
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { image: "Image is required" },
      });
    }

    const image = req.file.path;
    const newProduct = new Product({
      name,
      category,
      status,
      price,
      stock,
      description,
      image,
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const DisplayProducts = async (req, res) => {
  try {
    const products = await Product.find();
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

