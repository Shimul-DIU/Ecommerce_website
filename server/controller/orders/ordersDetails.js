import Order from "../../model/order/order.js";

const ordersDetails = async (req, res) => {
  try {

    const orders = await Order.find({
      user: req.user._id,
    });

    if (orders.length === 0) {
      return res.status(404).json({
        message: "No orders found",
      });
    }

    res.status(200).json({
      orders,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export default ordersDetails;