// controllers/orderController.js
import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

export const createOrder = async (req, res) => {
  try {
    const { productId, quantity, customer, payment } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "সঠিক প্রোডাক্ট আইডি দিন।" });
    }
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "পণ্যের পরিমাণ সঠিক নয়।" });
    }
    if (!customer?.name || !customer?.phone || !customer?.address) {
      return res.status(400).json({ message: "কাস্টমারের তথ্য অসম্পূর্ণ।" });
    }
    if (!payment?.method || !["bkash", "nagad", "cod"].includes(payment.method)) {
      return res.status(400).json({ message: "সঠিক পেমেন্ট মেথড দিন।" });
    }
    if (
      (payment.method === "bkash" || payment.method === "nagad") &&
      (!payment.mobileNumber || !payment.transactionId)
    ) {
      return res
        .status(400)
        .json({ message: "মোবাইল নাম্বার ও Transaction ID দিতে হবে।" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "প্রোডাক্টটি খুঁজে পাওয়া যায়নি।" });
    }

    if (product.stock < quantity) {
      return res
        .status(400)
        .json({ message: `শুধুমাত্র ${product.stock} টি স্টকে আছে।` });
    }

    const deliveryCharge = 60;
    const subtotal = product.price * quantity;
    const total = subtotal + deliveryCharge;

    const order = await Order.create({
      productSnapshot: {
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
      },
      quantity,
      subtotal,
      deliveryCharge,
      total,
      customer: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
      },
      payment: {
        method: payment.method,
        mobileNumber: payment.mobileNumber || null,
        transactionId: payment.transactionId || null,
      },
      user: req.user?._id || null,
    });

    product.stock -= quantity;
    await product.save();

    return res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({ message: "সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।" });
  }
};