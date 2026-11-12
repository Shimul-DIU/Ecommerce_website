import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  Heart,
  ArrowRight,
  CalendarDays,
  ShoppingBag,
} from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";
import formatOrderDate from "../../../utils/formatOrderDate";
import getOrderItems from "../../../utils/getOrderItems";
import { useTranslation } from "../../../utils/translations";
import { CountContext } from "../../../context/CountContext";

/* ---------------- Status styles ---------------- */
const statusStyles = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-amber-50 text-amber-700 border-amber-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
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
  const { t } = useTranslation();
  const { wishlist } = useContext(CountContext);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get("/api/orders/order-details", {
          signal: controller.signal,
        });
        if (active) {
          setOrders(res.data.orders || []);
          setOrdersLoaded(true);
          setOrderError("");
        }
      } catch (error) {
        if (active && !controller.signal.aborted) {
          console.error("Error fetching orders:", error);
          setOrderError(
            error.response?.data?.message || "Could not load your orders."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchOrder();
    const refreshVisibleOrders = () => {
      if (document.visibilityState === "visible") fetchOrder();
    };
    const intervalId = window.setInterval(refreshVisibleOrders, 30000);
    window.addEventListener("focus", fetchOrder);

    return () => {
      active = false;
      controller.abort();
      window.clearInterval(intervalId);
      window.removeEventListener("focus", fetchOrder);
    };
  }, []);

  const inTransitCount = orders.filter(
    (o) => String(o.status).toLowerCase() === "shipped"
  ).length;
  const deliveredCount = orders.filter(
    (o) => String(o.status).toLowerCase() === "delivered"
  ).length;
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
            {t("Overview")}
          </p>
          <h1 className="text-2xl font-bold text-[#16241F]">{t("My Dashboard")}</h1>
        </div>
      </div>

      {orderError && ordersLoaded && (
        <p role="alert" className="text-sm text-rose-600">{t(orderError)}</p>
      )}

      {/* ============ STAT CARDS ============ */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <Link to="/userDashboard/user-orders" className="block">
          <StatCard
            label={t("Total Orders")}
            value={ordersLoaded ? orders.length : "—"}
            Icon={Package}
          />
        </Link>

        <StatCard
          label={t("In Transit")}
          value={ordersLoaded ? inTransitCount : "—"}
          Icon={Truck}
        />

        <StatCard
          label={t("Wishlist Items")}
          value={wishlist.length}
          Icon={Heart}
        />

        <StatCard
          label={t("Delivered")}
          value={ordersLoaded ? deliveredCount : "—"}
          Icon={Package}
        />
      </div>

      {/* ============ RECENT ORDERS ============ */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-[#B08946]" />
            <div>
              <h2 className="text-lg font-bold text-[#16241F]">
                {t("Recent Orders")}
              </h2>
              <p className="text-xs text-[#16241F]/50">
                {t("Your latest purchases")}
              </p>
            </div>
          </div>

          <Link
            to="/userDashboard/user-orders"
            className="group flex items-center gap-1.5 text-sm font-semibold text-[#B08946] transition hover:text-[#16241F]"
          >
            {t("See all orders")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {!ordersLoaded ? (
          <p role="alert" className="rounded-lg border border-rose-200 bg-white p-4 text-sm text-rose-600">
            {t(orderError || "Could not load your orders.")}
          </p>
        ) : recentOrders.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-[#E4DDCE] bg-white px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF6EF] text-[#B08946]">
              <Package className="h-8 w-8" />
            </div>

            <p className="font-semibold text-[#16241F]">{t("No orders found")}</p>
            <p className="mt-1 text-sm text-[#16241F]/50">
              {t("You haven't placed any order yet.")}
            </p>

            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#16241F] px-5 py-2.5 text-sm font-semibold text-[#FAF6EF] shadow-md transition hover:bg-[#B08946] hover:text-[#16241F]"
            >
              <ShoppingBag className="h-4 w-4" />
              {t("Browse Products")}
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
                      {t("Order")}
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
                      {formatOrderDate(order.createdAt)}
                    </p>
                  )}

                  {/* Product */}
                  <div className="space-y-3">
                    {getOrderItems(order).map((item, index) => (
                      <div
                        key={item.productId || item._id || `${item.name}-${index}`}
                        className="flex min-w-0 gap-4"
                      >
                        <img
                          src={item.image || "/placeholder-image.jpg"}
                          alt={item.name || t("Product")}
                          className="h-20 w-20 shrink-0 rounded-xl border border-[#E4DDCE] object-cover"
                        />
                        <div className="flex min-w-0 flex-col justify-center">
                          <p className="truncate font-semibold text-[#16241F]">
                            {item.name || t("Product")}
                          </p>
                          {item.productId && (
                            <p className="mt-0.5 truncate text-xs text-[#16241F]/40">
                              {t("ID")}: {item.productId}
                            </p>
                          )}
                          <p className="mt-2 text-sm font-medium text-[#16241F]/70">
                            ৳{Number(item.price || 0).toLocaleString()}{" "}
                            <span className="text-[#B08946]">×</span>{" "}
                            {item.quantity || 1}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price breakdown */}
                  <div className="space-y-1.5 border-t border-dashed border-[#E4DDCE] pt-3">
                    <div className="flex justify-between text-sm text-[#16241F]/60">
                      <span>{t("Subtotal")}</span>
                      <span>৳{order.subtotal?.toLocaleString() || 0}</span>
                    </div>

                    <div className="flex justify-between text-sm text-[#16241F]/60">
                      <span>{t("Delivery")}</span>
                      <span>
                        ৳{order.deliveryCharge?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total footer */}
                <div className="flex items-center justify-between bg-[#16241F] px-5 py-3.5 text-[#FAF6EF]">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#FAF6EF]/70">
                    {t("Total")}
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