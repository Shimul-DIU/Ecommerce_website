import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Truck, Heart, Star, User, Phone, MapPin, CreditCard, ArrowRight } from "lucide-react";
import StatCard from "./StatCard";
import OrderCard from "./OrderCard";
import axiosInstance from "../../../utils/axiosInstance";

const statusStyles = {
  "Pending": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Processing": "bg-blue-50 text-blue-700 border-blue-200",
  "In Transit": "bg-amber-50 text-amber-700 border-amber-200",
  "Delivered": "bg-green-50 text-green-700 border-green-200",
  "Cancelled": "bg-red-50 text-red-700 border-red-200",
};


export default function Overview() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get('/api/orders/order-details', {
          headers: { Authorization: token },
        });
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, []);

  const inTransitCount = orders.filter((o) => o.status === "In Transit").length;

  const recentOrders = orders.slice(0, 2);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading...</p>;
  }

  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-2  md:gap-4 lg:grid-cols-4">
        <Link to="/userDashboard/user-orders">
          <StatCard
            label="Total Orders"
            value={orders.length}
            Icon={Package}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />
        </Link>

        <StatCard
          label="In Transit"
          value={inTransitCount}
          Icon={Truck}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          label="Wishlist Items"
          value={wishlistCount}
          Icon={Heart}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
        />
        <StatCard
          label="Reward Points"
          value={rewardPoints.toLocaleString()}
          Icon={Star}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
      </div>

      {/* Header row: title + "See all orders" link */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
        <Link
          to="/userDashboard/user-orders"
          className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          See all orders
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {recentOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No orders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recentOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Header strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-slate-50 border-b border-slate-100">
                {order.status && (
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${statusStyles[order.status] || "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                  >
                    {order.status}
                  </span>
                )}
              </div>

              <div className="p-5 flex flex-col gap-4">
                {/* Product */}
                <div className="flex gap-4 min-w-0">
                  <img
                    src={order.productSnapshot?.image || "/placeholder-image.jpg"}
                    alt={order.productSnapshot?.name || "Product"}
                    className="w-20 h-20 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex flex-col justify-center">
                    <p className="font-semibold text-slate-900 truncate">
                      {order.productSnapshot?.name || "Unknown Product"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ID: {order.productSnapshot?.productId || "N/A"}
                    </p>
                    <p className="text-sm text-slate-600 mt-2">
                      ৳{order.productSnapshot?.price?.toLocaleString() || 0} ×{" "}
                      {order.quantity || 1}
                    </p>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="border-t border-slate-100 pt-3 space-y-1.5">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>৳{order.subtotal?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Delivery</span>
                    <span>৳{order.deliveryCharge?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-100">
                    <span className="text-sm font-semibold text-slate-900">Total</span>
                    <span className="text-base font-bold text-slate-900">
                      ৳{order.total?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </div>



            </div>
          ))}
        </div>
      )}
    </>
  );
}