import mongoose from "mongoose";

// যেসব category-তে sub category নেই
export const NO_SUBCATEGORY = ["deal", "new-arrival"];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    subCategory: {
      type: String,
      trim: true,
      default: "",
      required: [
        function () {
          return !NO_SUBCATEGORY.includes(this.category);
        },
        "Sub category is required",
      ],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },

    // শুধু deal-এর জন্য (আগের দাম)
    oldPrice: {
      type: Number,
      min: 0,
      default: null,
    },

    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: 0,
      default: 0,
    },

    // কতগুলো বিক্রি হয়েছে (deal progress bar-এর জন্য)
    sold: {
      type: Number,
      min: 0,
      default: 0,
    },

    // শুধু deal-এর জন্য (শেষ হওয়ার সময়)
    dealEndsAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      required: [true, "Product image is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;