import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faCartShopping,
  faUsers,
  faBox,
  faArrowTrendUp,
  faArrowTrendDown,
  faPlus,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const STATUS_STYLES = {
  Delivered: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    bar: "bg-emerald-500",
  },
  Pending: {
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    bar: "bg-amber-500",
  },
  Processing: {
    badge: "bg-sky-50 text-sky-700 ring-sky-200",
    bar: "bg-sky-500",
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
  const stats = [
    {
      id: 1,
      title: "Revenue",
      value: "৳12,500",
      icon: faMoneyBillWave,
      change: "+12.5%",
      up: true,
    },
    {
      id: 2,
      title: "Orders",
      value: "320",
      icon: faCartShopping,
      change: "+8.2%",
      up: true,
    },
    {
      id: 3,
      title: "Customers",
      value: "1,240",
      icon: faUsers,
      change: "+3.1%",
      up: true,
    },
    {
      id: 4,
      title: "Products",
      value: "540",
      icon: faBox,
      change: "-1.4%",
      up: false,
    },
  ];

  const orders = [
    { id: 101, customer: "Shimul Mia", amount: "৳120", status: "Pending" },
    { id: 102, customer: "Rahim Uddin", amount: "৳80", status: "Delivered" },
    { id: 103, customer: "Karim Hossain", amount: "৳200", status: "Processing" },
  ];

  // অর্ডারের স্ট্যাটাস অনুযায়ী হিসাব
  const statusSummary = Object.keys(STATUS_STYLES).map((status) => {
    const count = orders.filter((o) => o.status === status).length;
    return {
      status,
      count,
      percent: orders.length ? Math.round((count / orders.length) * 100) : 0,
    };
  });

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

            <div className="mt-4 flex items-center gap-2 text-xs">
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-bold ${
                  item.up
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                <FontAwesomeIcon
                  icon={item.up ? faArrowTrendUp : faArrowTrendDown}
                  className="text-[10px]"
                />
                {item.change}
              </span>
              <span className="text-[#16241F]/40">vs last month</span>
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
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-[#E4DDCE]/70 transition-colors hover:bg-[#FAF6EF]/60"
                  >
                    <td className="px-5 py-3.5 font-bold text-[#16241F]">
                      #{order.id}
                    </td>

                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#16241F] text-xs font-bold text-[#B08946] ring-2 ring-[#B08946]/40">
                          {getInitials(order.customer)}
                        </span>
                        <span className="font-semibold text-[#16241F]">
                          {order.customer}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3.5 font-bold text-[#16241F]">
                      {order.amount}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[order.status].badge}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${STATUS_STYLES[order.status].bar}`}
                        />
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Status Overview */}
        <div className="rounded-2xl border border-[#E4DDCE] bg-white p-5 shadow-sm">
          <h2 className="text-base font-extrabold text-[#16241F]">
            Order Status
          </h2>
          <p className="text-xs text-[#16241F]/50">Based on recent orders</p>

          <div className="mt-5 space-y-5">
            {statusSummary.map((s) => (
              <div key={s.status}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#16241F]">
                    {s.status}
                  </span>
                  <span className="text-xs font-bold text-[#16241F]/60">
                    {s.count} orders · {s.percent}%
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
              {orders.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}