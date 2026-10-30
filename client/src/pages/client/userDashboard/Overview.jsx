import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  Heart,
  Star,
  ArrowRight,
  CalendarDays,
  ShoppingBag,
} from "lucide-react";
import AddProductSection from "./AddProductSection";
import axiosInstance from "../../../utils/axiosInstance";

/* ---------------- Status styles ---------------- */
const statusStyles = {
  Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Processing: "bg-blue-50 text-blue-700 border-blue-200",
  "In Transit": "bg-amber-50 text-amber-700 border-amber-200",
  Delivered: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const fallbackStatus = "bg-slate-100 text-slate-600 border-slate-200";

/* ---------------- Stat Card ---------------- */
const StatCard = ({ label, value, Icon }) => (
  <div className="group relative h-full overflow-hidden rounded-2xl border border-[#E4DDCE] bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-5">
    {/* decorative circle */}
    <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#B08946]/10 transition group-hover:scale-125 sm:h-24 sm:w-24" />

    <div className="relative flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-[#16241F]/55 sm:text-xs">
          {label}
        </p>
        <h3 className="mt-1.5 text-2xl font-bold text-[#16241F] sm:mt-2 sm:text-3xl">
          {value}
        </h3>
      </div>

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#16241F] text-[#B08946] shadow-md sm:h-11 sm:w-11">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

/* ---------------- Skeleton ---------------- */
const OverviewSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="space-y-2">
      <div className="h-3 w-24 rounded bg-[#E4DDCE]/70" />
      <div className="h-8 w-48 rounded-md bg-[#E4DDCE]/70" />
    </div>

    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-28 rounded-2xl bg-[#E4DDCE]/50" />
      ))}
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {[1, 2].map((i) => (
        <div key={i} className="h-72 rounded-2xl bg-[#E4DDCE]/40" />
      ))}
    </div>
  </div>
);

/* ---------------- Component ---------------- */
export default function Overview() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/api/orders/order-details");
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
    return <OverviewSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* ============ HEADER ============ */}
      <div className="flex items-center gap-3">
        <span className="h-10 w-1 rounded-full bg-[#B08946]" />

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B08946]">
            Overview
          </p>
          <h1 className="text-2xl font-bold text-[#16241F]">My Dashboard</h1>
        </div>
      </div>

      {/* ============ STAT CARDS ============ */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <Link to="/userDashboard/user-orders" className="block">
          <StatCard label="Total Orders" value={orders.length} Icon={Package} />
        </Link>

        <StatCard label="In Transit" value={inTransitCount} Icon={Truck} />

        <StatCard
          label="Wishlist Items"
          value={wishlistCount}
          Icon={Heart}
        />

        <StatCard
          label="Reward Points"
          value={rewardPoints.toLocaleString()}
          Icon={Star}
        />
      </div>

      {/* ============ ADD PRODUCT ============ */}
      <AddProductSection
        onProductAdded={(product) => console.log("New product:", product)}
      />

      {/* ============ RECENT ORDERS ============ */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-[#B08946]" />
            <div>
              <h2 className="text-lg font-bold text-[#16241F]">
                Recent Orders
              </h2>
              <p className="text-xs text-[#16241F]/50">
                Your latest purchases
              </p>
            </div>
          </div>

          <Link
            to="/userDashboard/user-orders"
            className="group flex items-center gap-1.5 text-sm font-semibold text-[#B08946] transition hover:text-[#16241F]"
          >
            See all orders
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-[#E4DDCE] bg-white px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF6EF] text-[#B08946]">
              <Package className="h-8 w-8" />
            </div>

            <p className="font-semibold text-[#16241F]">No orders found</p>
            <p className="mt-1 text-sm text-[#16241F]/50">
              You haven't placed any order yet.
            </p>

            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#16241F] px-5 py-2.5 text-sm font-semibold text-[#FAF6EF] shadow-md transition hover:bg-[#B08946] hover:text-[#16241F]"
            >
              <ShoppingBag className="h-4 w-4" />
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="group overflow-hidden rounded-2xl border border-[#E4DDCE] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Header strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4DDCE]/70 bg-[#FAF6EF]/70 px-5 py-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#16241F]/45">
                      Order
                    </p>
                    <p className="truncate text-sm font-bold text-[#16241F]">
                      #{String(order._id).slice(-8).toUpperCase()}
                    </p>
                  </div>

                  {order.status && (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                        statusStyles[order.status] || fallbackStatus
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {order.status}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-4 p-5">
                  {/* Date */}
                  {order.createdAt && (
                    <p className="flex items-center gap-1.5 text-xs text-[#16241F]/50">
                      <CalendarDays className="h-3.5 w-3.5 text-[#B08946]" />
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}

                  {/* Product */}
                  <div className="flex min-w-0 gap-4">
                    <img
                      src={
                        order.productSnapshot?.image || "/placeholder-image.jpg"
                      }
                      alt={order.productSnapshot?.name || "Product"}
                      className="h-20 w-20 shrink-0 rounded-xl border border-[#E4DDCE] object-cover"
                    />

                    <div className="flex min-w-0 flex-col justify-center">
                      <p className="truncate font-semibold text-[#16241F]">
                        {order.productSnapshot?.name || "Unknown Product"}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[#16241F]/40">
                        ID: {order.productSnapshot?.productId || "N/A"}
                      </p>
                      <p className="mt-2 text-sm font-medium text-[#16241F]/70">
                        ৳{order.productSnapshot?.price?.toLocaleString() || 0}{" "}
                        <span className="text-[#B08946]">×</span>{" "}
                        {order.quantity || 1}
                      </p>
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="space-y-1.5 border-t border-dashed border-[#E4DDCE] pt-3">
                    <div className="flex justify-between text-sm text-[#16241F]/60">
                      <span>Subtotal</span>
                      <span>৳{order.subtotal?.toLocaleString() || 0}</span>
                    </div>

                    <div className="flex justify-between text-sm text-[#16241F]/60">
                      <span>Delivery</span>
                      <span>
                        ৳{order.deliveryCharge?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total footer */}
                <div className="flex items-center justify-between bg-[#16241F] px-5 py-3.5 text-[#FAF6EF]">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#FAF6EF]/70">
                    Total
                  </span>
                  <span className="text-lg font-bold text-[#B08946]">
                    ৳{order.total?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}