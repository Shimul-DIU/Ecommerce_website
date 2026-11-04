import { useEffect, useState } from "react";
import {
  faPlus,
  faPen,
  faTrash,
  faMagnifyingGlass,
  faBoxOpen,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useSearchParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";

const ITEMS_PER_PAGE = 5;

const STATUS_STYLES = {
  Active: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  Inactive: {
    badge: "bg-red-50 text-red-600 ring-red-200",
    dot: "bg-red-500",
  },
};

const filterClass =
  "w-full rounded-xl border border-[#E4DDCE] bg-[#FAF6EF]/50 px-4 py-2.5 text-sm text-[#16241F] outline-none transition placeholder:text-[#16241F]/35 focus:border-[#B08946] focus:bg-white focus:ring-2 focus:ring-[#B08946]/25";

// পেজ নম্বরের তালিকা বানায়, যেমন: 1 ... 4 5 6 ... 10
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

const AdminProducts = () => {
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/api/products");
        setProducts(response.data.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  // ================= SEARCH FILTER =================
  const filteredProducts = products.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      item.name?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q) ||
      item.subCategory?.toLowerCase().includes(q)
    );
  });

  // সার্চ বদলালে প্রথম পেজে ফিরে যাবে
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ================= PAGINATION =================
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const showingFrom = filteredProducts.length ? startIndex + 1 : 0;
  const showingTo = Math.min(
    startIndex + ITEMS_PER_PAGE,
    filteredProducts.length
  );

  // প্রোডাক্ট কমে গেলে পেজ নম্বর যেন সীমার বাইরে না যায়
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER BANNER ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-[#16241F] p-5 shadow-lg sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#B08946]/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 right-24 h-32 w-32 rounded-full bg-[#B08946]/10 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#B08946]">
              Inventory
            </p>
            <h1 className="mt-1 text-xl font-extrabold text-[#FAF6EF] sm:text-2xl">
              Products
            </h1>
            <p className="mt-1 text-sm text-[#FAF6EF]/60">
              Manage everything you sell in your store.
            </p>
          </div>

          <Link
            to="/admin/products/add"
            className="flex w-fit items-center gap-2 rounded-full bg-[#B08946] px-4 py-2 text-sm font-bold text-[#16241F] transition-colors hover:bg-[#C49A52]"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            Add Product
          </Link>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="rounded-2xl border border-[#E4DDCE] bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-sm text-[#B08946]"
              />
            </div>
            <input
              type="text"
              placeholder="Search Product..."
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

          <select className={filterClass}>
            <option>All Categories</option>
            <option>Shoes</option>
            <option>Men Fashion</option>
            <option>Electronics</option>
          </select>

          <select className={filterClass}>
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-hidden rounded-2xl border border-[#E4DDCE] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E4DDCE] px-5 py-4">
          <div>
            <h2 className="text-base font-extrabold text-[#16241F]">
              All Products
            </h2>
            <p className="text-xs text-[#16241F]/50">
              {search
                ? `"${search}" এর জন্য ${filteredProducts.length}টি ফলাফল`
                : `${products.length} products in your store`}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="bg-[#FAF6EF] text-left text-[11px] font-bold uppercase tracking-wider text-[#16241F]/55">
                <th className="px-5 py-3">Image</th>
                <th className="px-3 py-3">Product</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Price</th>
                <th className="px-3 py-3">Stock</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedProducts.map((item) => {
                const status =
                  STATUS_STYLES[item.status] || STATUS_STYLES.Inactive;

                return (
                  <tr
                    key={item._id}
                    className="border-t border-[#E4DDCE]/70 transition-colors hover:bg-[#FAF6EF]/60"
                  >
                    <td className="px-5 py-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-14 w-14 rounded-xl object-cover ring-2 ring-[#B08946]/30"
                      />
                    </td>

                    <td className="px-3 py-3 font-bold text-[#16241F]">
                      {item.name}
                    </td>

                    <td className="px-3 py-3">
                      <span className="rounded-full bg-[#FAF6EF] px-2.5 py-1 text-xs font-semibold capitalize text-[#16241F]/70 ring-1 ring-[#E4DDCE]">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-3 py-3 font-bold text-[#16241F]">
                      ৳{item.price}
                    </td>

                    <td className="px-3 py-3 font-semibold text-[#16241F]/70">
                      {item.stock}
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${status.badge}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                        />
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#16241F] text-[#B08946] shadow-sm transition-colors hover:bg-[#B08946] hover:text-[#16241F]"
                        >
                          <FontAwesomeIcon icon={faPen} className="text-xs" />
                        </button>

                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty state */}
          {filteredProducts.length === 0 && !message && (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-[#16241F]/40">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#16241F] text-[#B08946] shadow-md">
                <FontAwesomeIcon icon={faBoxOpen} className="text-xl" />
              </span>
              <p className="text-sm font-semibold text-[#16241F]/60">
                {search
                  ? `"${search}" নামে কোনো প্রোডাক্ট পাওয়া যায়নি`
                  : "No products found"}
              </p>
            </div>
          )}
        </div>

        {message && (
          <p className="mx-5 my-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-500">
            {message}
          </p>
        )}

        {/* ================= PAGINATION ================= */}
        <div className="flex flex-col gap-3 border-t border-[#E4DDCE] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#16241F]/50">
            Showing{" "}
            <span className="font-bold text-[#16241F]">
              {showingFrom}-{showingTo}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#16241F]">
              {filteredProducts.length}
            </span>{" "}
            Products
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

export default AdminProducts;