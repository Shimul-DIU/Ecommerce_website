import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faCartShopping,
  faUsers,
  faBox,
  faPlus,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const STATUS_STYLES = {
  delivered: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    bar: "bg-emerald-500",
  },
  pending: {
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    bar: "bg-amber-500",
  },
  processing: {
    badge: "bg-sky-50 text-sky-700 ring-sky-200",
    bar: "bg-sky-500",
  },
  shipped: {
    badge: "bg-violet-50 text-violet-700 ring-violet-200",
    bar: "bg-violet-500",
  },
  cancelled: {
    badge: "bg-red-50 text-red-700 ring-red-200",
    bar: "bg-red-500",
  },
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/dashboard/summary");
        if (active) {
          setDashboardData(response.data);
          setError("");
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError.response?.data?.message ||
              "Failed to load dashboard data"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboardData();
    return () => {
      active = false;
    };
  }, []);

  const summary = dashboardData?.summary;
  const orders = dashboardData?.recentOrders || [];
  const statusCounts = dashboardData?.statusCounts || {};
  const statusSummary = Object.keys(STATUS_STYLES).map((status) => {
    const count = statusCounts[status] || 0;
    return {
      status,
      count: dashboardData ? count : null,
      percent:
        summary?.orders > 0
          ? Math.round((count / summary.orders) * 100)
          : 0,
    };
  });
  const stats = [
    {
      id: "revenue",
      title: "Revenue",
      value: summary ? `৳${Number(summary.revenue || 0).toLocaleString()}` : "—",
      description: "From delivered orders",
      icon: faMoneyBillWave,
    },
    {
      id: "orders",
      title: "Orders",
      value: summary ? Number(summary.orders || 0).toLocaleString() : "—",
      description: "All-time orders",
      icon: faCartShopping,
    },
    {
      id: "customers",
      title: "Customers",
      value: summary ? Number(summary.customers || 0).toLocaleString() : "—",
      description: "Registered customers",
      icon: faUsers,
    },
    {
      id: "products",
      title: "Products",
      value: summary ? Number(summary.products || 0).toLocaleString() : "—",
      description: "Catalog products",
      icon: faBox,
    },
  ];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* ================= WELCOME BANNER ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-[#16241F] p-5 shadow-lg sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#B08946]/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 right-24 h-32 w-32 rounded-full bg-[#B08946]/10 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#B08946]">
              {today}
            </p>
            <h1 className="mt-1 text-xl font-extrabold text-[#FAF6EF] sm:text-2xl">
              Welcome back, Admin
            </h1>
            <p className="mt-1 text-sm text-[#FAF6EF]/60">
              Here is what is happening in your store today.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/admin/products"
              className="flex items-center gap-2 rounded-full bg-[#B08946] px-4 py-2 text-sm font-bold text-[#16241F] transition-colors hover:bg-[#C49A52]"
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
              Add Product
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center gap-2 rounded-full border border-[#FAF6EF]/20 bg-white/5 px-4 py-2 text-sm font-semibold text-[#FAF6EF] transition-colors hover:border-[#B08946] hover:text-[#B08946]"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl border border-[#E4DDCE] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B08946] hover:shadow-lg"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B08946] to-[#C49A52] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#16241F]/50">
                  {item.title}
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-[#16241F]">
                  {item.value}
                </h2>
              </div>

              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#16241F] text-[#B08946] shadow-md transition-colors duration-200 group-hover:bg-[#B08946] group-hover:text-[#16241F]">
                <FontAwesomeIcon icon={item.icon} className="text-lg" />
              </span>
            </div>

            <div className="mt-4 text-xs text-[#16241F]/40">
              {loading ? "Loading..." : item.description}
            </div>
          </div>
        ))}
      </div>

      {/* ================= ORDERS + STATUS ================= */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Orders */}
        <div className="overflow-hidden rounded-2xl border border-[#E4DDCE] bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-[#E4DDCE] px-5 py-4">
            <div>
              <h2 className="text-base font-extrabold text-[#16241F]">
                Recent Orders
              </h2>
              <p className="text-xs text-[#16241F]/50">Latest customer orders</p>
            </div>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#B08946] transition-colors hover:text-[#16241F]"
            >
              View all
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-sm">
              <thead>
                <tr className="bg-[#FAF6EF] text-left text-[11px] font-bold uppercase tracking-wider text-[#16241F]/55">
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const status = String(order.status || "").toLowerCase();
                  const statusStyle =
                    STATUS_STYLES[status] || STATUS_STYLES.pending;
                  const customerName = order.customer?.name || "Customer";

                  return (
                    <tr
                      key={order._id}
                      className="border-t border-[#E4DDCE]/70 transition-colors hover:bg-[#FAF6EF]/60"
                    >
                      <td className="px-5 py-3.5 font-bold text-[#16241F]">
                        #{String(order._id || "").slice(-8).toUpperCase()}
                      </td>

                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#16241F] text-xs font-bold text-[#B08946] ring-2 ring-[#B08946]/40">
                            {getInitials(customerName)}
                          </span>
                          <span className="font-semibold text-[#16241F]">
                            {customerName}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-3.5 font-bold text-[#16241F]">
                        ৳{Number(order.total || 0).toLocaleString()}
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyle.badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusStyle.bar}`}
                          />
                          {status
                            ? status[0].toUpperCase() + status.slice(1)
                            : "Unknown"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {!loading && error && !dashboardData && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-5 py-8 text-center text-sm text-red-600"
                    >
                      Unable to load orders.
                    </td>
                  </tr>
                )}
                {!loading && dashboardData && orders.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-5 py-8 text-center text-sm text-[#16241F]/50"
                    >
                      No orders yet.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-5 py-8 text-center text-sm text-[#16241F]/50"
                    >
                      Loading orders...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Status Overview */}
        <div className="rounded-2xl border border-[#E4DDCE] bg-white p-5 shadow-sm">
          <h2 className="text-base font-extrabold text-[#16241F]">
            Order Status
          </h2>
          <p className="text-xs text-[#16241F]/50">Based on all orders</p>

          <div className="mt-5 space-y-5">
            {statusSummary.map((s) => (
              <div key={s.status}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#16241F]">
                    {s.status[0].toUpperCase() + s.status.slice(1)}
                  </span>
                  <span className="text-xs font-bold text-[#16241F]/60">
                    {s.count === null
                      ? "—"
                      : `${s.count} orders · ${s.percent}%`}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#FAF6EF]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${STATUS_STYLES[s.status].bar}`}
                    style={{ width: `${s.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-[#16241F] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B08946]">
              Total Orders
            </p>
            <p className="mt-1 text-2xl font-extrabold text-[#FAF6EF]">
              {summary ? Number(summary.orders || 0).toLocaleString() : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}