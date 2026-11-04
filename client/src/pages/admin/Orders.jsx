import { useEffect, useState } from "react";
import {
  faMagnifyingGlass,
  faEye,
  faReceipt,
  faClock,
  faTruckFast,
  faCircleCheck,
  faBoxOpen,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "react-router-dom";

const ITEMS_PER_PAGE = 6;

const STATUSES = ["Pending", "Processing", "Delivered", "Cancelled"];

const STATUS_STYLES = {
  Pending: {
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  Processing: {
    badge: "bg-sky-50 text-sky-700 ring-sky-200",
    dot: "bg-sky-500",
  },
  Delivered: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  Cancelled: {
    badge: "bg-red-50 text-red-600 ring-red-200",
    dot: "bg-red-500",
  },
};

// ডেমো ডাটা (পরে API থেকে আনবেন)
const INITIAL_ORDERS = [
  { _id: "101", customer: "Shimul Mia", phone: "01711-000001", amount: 1200, payment: "bKash", status: "Pending", date: "2026-11-04" },
  { _id: "102", customer: "Rahim Uddin", phone: "01811-000002", amount: 800, payment: "Nagad", status: "Delivered", date: "2026-11-03" },
  { _id: "103", customer: "Karim Hossain", phone: "01911-000003", amount: 2000, payment: "COD", status: "Processing", date: "2026-11-03" },
  { _id: "104", customer: "Nusrat Jahan", phone: "01611-000004", amount: 3500, payment: "bKash", status: "Delivered", date: "2026-11-02" },
  { _id: "105", customer: "Sabbir Ahmed", phone: "01511-000005", amount: 950, payment: "COD", status: "Cancelled", date: "2026-11-02" },
  { _id: "106", customer: "Tania Akter", phone: "01711-000006", amount: 1800, payment: "Nagad", status: "Pending", date: "2026-11-01" },
  { _id: "107", customer: "Imran Hasan", phone: "01811-000007", amount: 2750, payment: "bKash", status: "Processing", date: "2026-11-01" },
  { _id: "108", customer: "Mim Sultana", phone: "01911-000008", amount: 640, payment: "COD", status: "Delivered", date: "2026-10-31" },
  { _id: "109", customer: "Fahim Reza", phone: "01611-000009", amount: 4200, payment: "bKash", status: "Pending", date: "2026-10-31" },
  { _id: "110", customer: "Rima Begum", phone: "01511-000010", amount: 1300, payment: "Nagad", status: "Delivered", date: "2026-10-30" },
];

const filterClass =
  "w-full rounded-xl border border-[#E4DDCE] bg-[#FAF6EF]/50 px-4 py-2.5 text-sm text-[#16241F] outline-none transition placeholder:text-[#16241F]/35 focus:border-[#B08946] focus:bg-white focus:ring-2 focus:ring-[#B08946]/25";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// পেজ নম্বরের তালিকা, যেমন: 1 ... 4 5 6 ... 10
const getPageNumbers = (current, total) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  pages.push(total);

  return pages;
};

const Orders = () => {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  // ================= STATS =================
  const countBy = (status) => orders.filter((o) => o.status === status).length;

  const stats = [
    { id: 1, title: "Total Orders", value: orders.length, icon: faReceipt },
    { id: 2, title: "Pending", value: countBy("Pending"), icon: faClock },
    { id: 3, title: "Processing", value: countBy("Processing"), icon: faTruckFast },
    { id: 4, title: "Delivered", value: countBy("Delivered"), icon: faCircleCheck },
  ];

  // ================= FILTER =================
  const filteredOrders = orders.filter((o) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      o._id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.phone.includes(q);
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // সার্চ বা ফিল্টার বদলালে প্রথম পেজে ফিরে যাবে
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // ================= PAGINATION =================
  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const showingFrom = filteredOrders.length ? startIndex + 1 : 0;
  const showingTo = Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ================= STATUS UPDATE =================
  const handleStatusChange = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
    );
    // TODO: API কল এখানে দিন
    // await axiosInstance.patch(`/api/admin/orders/${id}`, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER BANNER ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-[#16241F] p-5 shadow-lg sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#B08946]/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 right-24 h-32 w-32 rounded-full bg-[#B08946]/10 blur-2xl" />

        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#B08946]">
            Sales
          </p>
          <h1 className="mt-1 text-xl font-extrabold text-[#FAF6EF] sm:text-2xl">
            Orders
          </h1>
          <p className="mt-1 text-sm text-[#FAF6EF]/60">
            Track and manage all customer orders.
          </p>
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
          </div>
        ))}
      </div>

      {/* ================= FILTERS ================= */}
      <div className="rounded-2xl border border-[#E4DDCE] bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-sm text-[#B08946]"
              />
            </div>
            <input
              type="text"
              placeholder="Search by order ID, name or phone..."
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearchParams(value ? { search: value } : {}, {
                  replace: true,
                });
              }}
              className={`${filterClass} pl-10`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={filterClass}
          >
            <option value="All">All Status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-hidden rounded-2xl border border-[#E4DDCE] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E4DDCE] px-5 py-4">
          <div>
            <h2 className="text-base font-extrabold text-[#16241F]">
              All Orders
            </h2>
            <p className="text-xs text-[#16241F]/50">
              {filteredOrders.length} orders found
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="bg-[#FAF6EF] text-left text-[11px] font-bold uppercase tracking-wider text-[#16241F]/55">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Payment</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.map((order) => {
                const style = STATUS_STYLES[order.status];

                return (
                  <tr
                    key={order._id}
                    className="border-t border-[#E4DDCE]/70 transition-colors hover:bg-[#FAF6EF]/60"
                  >
                    <td className="px-5 py-3.5 font-bold text-[#16241F]">
                      #{order._id}
                    </td>

                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#16241F] text-xs font-bold text-[#B08946] ring-2 ring-[#B08946]/40">
                          {getInitials(order.customer)}
                        </span>
                        <div className="leading-tight">
                          <p className="font-semibold text-[#16241F]">
                            {order.customer}
                          </p>
                          <p className="text-xs text-[#16241F]/50">
                            {order.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3.5 text-[#16241F]/70">
                      {formatDate(order.date)}
                    </td>

                    <td className="px-3 py-3.5">
                      <span className="rounded-full bg-[#FAF6EF] px-2.5 py-1 text-xs font-semibold text-[#16241F]/70 ring-1 ring-[#E4DDCE]">
                        {order.payment}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 font-bold text-[#16241F]">
                      ৳{order.amount.toLocaleString()}
                    </td>

                    <td className="px-3 py-3.5">
                      <div className="relative inline-block">
                        <span
                          className={`pointer-events-none absolute left-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${style.dot}`}
                        />
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className={`cursor-pointer appearance-none rounded-full py-1 pl-6 pr-3 text-xs font-semibold outline-none ring-1 ${style.badge}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          title="View details"
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#16241F] text-[#B08946] shadow-sm transition-colors hover:bg-[#B08946] hover:text-[#16241F]"
                        >
                          <FontAwesomeIcon icon={faEye} className="text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty state */}
          {filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-[#16241F]/40">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#16241F] text-[#B08946] shadow-md">
                <FontAwesomeIcon icon={faBoxOpen} className="text-xl" />
              </span>
              <p className="text-sm font-semibold text-[#16241F]/60">
                No orders found
              </p>
            </div>
          )}
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="flex flex-col gap-3 border-t border-[#E4DDCE] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#16241F]/50">
            Showing{" "}
            <span className="font-bold text-[#16241F]">
              {showingFrom}-{showingTo}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#16241F]">
              {filteredOrders.length}
            </span>{" "}
            Orders
          </p>

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 rounded-full border border-[#E4DDCE] px-4 py-1.5 text-sm font-semibold text-[#16241F] transition-colors hover:border-[#B08946] hover:text-[#B08946] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E4DDCE] disabled:hover:text-[#16241F]"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" />
                Previous
              </button>

              {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                page === "..." ? (
                  <span
                    key={`dots-${idx}`}
                    className="px-1 text-sm font-bold text-[#16241F]/40"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    className={`h-9 min-w-9 rounded-full px-3 text-sm font-bold transition-colors ${
                      page === currentPage
                        ? "bg-[#B08946] text-[#16241F]"
                        : "border border-[#E4DDCE] text-[#16241F] hover:border-[#B08946] hover:text-[#B08946]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 rounded-full border border-[#E4DDCE] px-4 py-1.5 text-sm font-semibold text-[#16241F] transition-colors hover:border-[#B08946] hover:text-[#B08946] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E4DDCE] disabled:hover:text-[#16241F]"
              >
                Next
                <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;