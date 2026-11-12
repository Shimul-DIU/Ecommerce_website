// controllers/orderController.js
import mongoose from "mongoose";


import Order from "../model/order/order.js";
import Product from "../model/products.js";

const normalizeBangladeshPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("00880")) return `0${digits.slice(5)}`;
  if (digits.startsWith("880")) return `0${digits.slice(3)}`;
  return digits;
};

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      productId,
      quantity,
      customer,
      payment,
    } = req.body || {};

    const requestedItems =
      Array.isArray(items) && items.length > 0
        ? items
        : productId
          ? [{ productId, quantity }]
          : [];

    if (requestedItems.length === 0) {
      return res.status(400).json({ message: "সঠিক প্রোডাক্ট আইডি দিন।" });
    }

    const quantitiesByProduct = new Map();
    for (const item of requestedItems) {
      const id = String(item?.productId || "");
      const itemQuantity = Number(item?.quantity);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "সঠিক প্রোডাক্ট আইডি দিন।" });
      }
      if (!Number.isInteger(itemQuantity) || itemQuantity < 1) {
        return res.status(400).json({ message: "পণ্যের পরিমাণ সঠিক নয়।" });
      }
      quantitiesByProduct.set(
        id,
        (quantitiesByProduct.get(id) || 0) + itemQuantity
      );
    }

    if (!customer?.name || !customer?.phone || !customer?.address) {
      return res.status(400).json({ message: "কাস্টমারের তথ্য অসম্পূর্ণ।" });
    }
    if (!payment?.method || !["bkash", "nagad", "cod"].includes(payment.method)) {
      return res.status(400).json({ message: "সঠিক পেমেন্ট মেথড দিন।" });
    }

    const customerPhone = normalizeBangladeshPhone(customer.phone);
    if (!/^01\d{9}$/.test(customerPhone)) {
      return res.status(400).json({
        message: "সঠিক ১১ সংখ্যার ফোন নম্বর দিন (+880 ছাড়া)।",
      });
    }

    const paymentMobileNumber = payment.mobileNumber
      ? normalizeBangladeshPhone(payment.mobileNumber)
      : "";
    if (
      (payment.method === "bkash" || payment.method === "nagad") &&
      (!/^01\d{9}$/.test(paymentMobileNumber) || !payment.transactionId)
    ) {
      return res
        .status(400)
        .json({ message: "সঠিক ১১ সংখ্যার পেমেন্ট নম্বর ও Transaction ID দিন।" });
    }

    const productIds = [...quantitiesByProduct.keys()];
    const products = await Product.find({ _id: { $in: productIds } });
    const productsById = new Map(
      products.map((product) => [String(product._id), product])
    );
    if (productsById.size !== quantitiesByProduct.size) {
      return res.status(404).json({ message: "প্রোডাক্টটি খুঁজে পাওয়া যায়নি।" });
    }

    const orderItems = productIds.map((id) => {
      const product = productsById.get(id);
      return {
        product,
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: quantitiesByProduct.get(id),
      };
    });

    for (const item of orderItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `শুধুমাত্র ${item.product.stock} টি ${item.name} স্টকে আছে।`,
        });
      }
    }

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryCharge = subtotal >= 2000 ? 0 : 60;
    const total = subtotal + deliveryCharge;
    const firstItem = orderItems[0];

    const order = await Order.create({
      items: orderItems.map(({ productId, name, image, price, quantity }) => ({
        productId,
        name,
        image,
        price,
        quantity,
      })),
      productSnapshot: {
        productId: firstItem.productId,
        name: firstItem.name,
        image: firstItem.image,
        price: firstItem.price,
      },
      quantity: firstItem.quantity,
      subtotal,
      deliveryCharge,
      total,
      payment: {
        method: payment.method,
        mobileNumber: paymentMobileNumber || null,
        transactionId: payment.transactionId || null,
      },
      customer: {
        name: customer.name.trim(),
        phone: customerPhone,
        address: customer.address.trim(),
      },
      user: req.user?._id || null,
    });

    await Promise.all(
      orderItems.map(async (item) => {
        item.product.stock -= item.quantity;
        item.product.sold = (item.product.sold || 0) + item.quantity;
        await item.product.save();
      })
    );

    return res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({ message: "সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।" });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Failed to fetch admin orders:", error);
    return res.status(500).json({ message: "Failed to fetch orders." });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body || {};
    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { returnDocument: "after", runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Failed to update order status:", error);
    return res.status(500).json({ message: "Failed to update order status." });
  }
};