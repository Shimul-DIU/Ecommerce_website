// models/orderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    productSnapshot: {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      image: { type: String },
      price: { type: Number, required: true }, 
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryCharge: {
      type: Number,
      required: true,
      default: 60,
    },
    total: {
      type: Number,
      required: true,
    },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
    },
    payment: {
      method: {
        type: String,
        required: true,
        enum: ["bkash", "nagad", "cod"],
      },
      mobileNumber: { type: String, default: null },
      transactionId: { type: String, default: null },
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;