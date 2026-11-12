import Order from "../model/order/order.js";
import Product from "../model/products.js";
import Users from "../model/userModel.js";

const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export const getAdminDashboardSummary = async (_req, res) => {
  try {
    const [
      productCount,
      customerCount,
      orderCount,
      orderStatusCounts,
      revenueResult,
      recentOrders,
    ] = await Promise.all([
      Product.countDocuments(),
      Users.countDocuments({ role: "user" }),
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: { $toLower: "$status" },
            count: { $sum: 1 },
          },
        },
      ]),
      Order.aggregate([
        { $match: { status: "delivered" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("_id customer total status createdAt")
        .lean(),
    ]);

    const statusCounts = Object.fromEntries(
      ORDER_STATUSES.map((status) => [
        status,
        orderStatusCounts.find((item) => item._id === status)?.count || 0,
      ])
    );

    return res.status(200).json({
      success: true,
      summary: {
        revenue: revenueResult[0]?.total || 0,
        orders: orderCount,
        customers: customerCount,
        products: productCount,
      },
      statusCounts,
      recentOrders,
    });
  } catch (error) {
    console.error("Admin dashboard summary error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};
