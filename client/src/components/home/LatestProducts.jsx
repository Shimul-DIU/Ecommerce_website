import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShoppingCart,
  faArrowRight,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { CountContext } from "../../context/CountContext";

const API_URL = "/data/products.json";

// প্রতি সারিতে কতটা কার্ড
const getItemsCount = (width) => {
  if (width >= 1280) return 6; // xl
  if (width >= 1024) return 5; // lg
  if (width >= 768) return 4; // md
  if (width >= 640) return 3; // sm
  if (width >= 320) return 2;
  return 1;
};

const gridColsMap = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

// নতুন প্রোডাক্ট বের করার জন্য তারিখ (createdAt)
const getTime = (p) => {
  const t = new Date(p.createdAt || p.addedAt || 0).getTime();
  return Number.isNaN(t) ? 0 : t;
};

const LatestProducts = () => {
  const { wishlist, cart, toggleWishlist, toggleCart } = useContext(CountContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  const itemsPerRow = getItemsCount(width);

  // API call (dummy JSON থেকে)
  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error("প্রোডাক্ট লোড করা যায়নি");
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.products || [];

        // সবচেয়ে নতুন আগে
        const hasDates = list.some((p) => getTime(p) > 0);
        const sorted = hasDates
          ? [...list].sort((a, b) => getTime(b) - getTime(a))
          : [...list].reverse();

        setProducts(sorted);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  // resize হলে width আপডেট (rows ও itemsPerRow দুটোই এখান থেকে হিসাব হবে)
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridColsClass = gridColsMap[itemsPerRow] || "grid-cols-6";

  if (error) {
    return (
      <div className="flex justify-center items-center py-16 px-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl text-center shadow-sm max-w-md">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  // বড় স্ক্রিনে ২ সারি, ছোট স্ক্রিনে ১ সারি
  const rows = width >= 1024 ? 2 : 1;
  const visibleProductsList = products?.slice(0, itemsPerRow * rows);

  return (
    <section className="w-full mx-auto">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-[#16241F]">
            Latest Products
          </h2>
          <span className="ml-2 bg-[#FAF6EF] border border-[#E4DDCE] text-[#16241F]/70 text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded-full">
            {products?.length || 0} Products
          </span>
        </div>

        {/* See All link */}
        <Link
          to="/products"
          state={{ filter: "latest" }}
          className="group flex items-center gap-1.5 text-sm sm:text-base font-semibold text-[#16241F] hover:text-[#B08946] transition-colors duration-200"
        >
          <span>See All</span>
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FAF6EF] group-hover:bg-[#B08946] text-[#16241F] group-hover:text-white flex items-center justify-center transition-all duration-300">
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-xs sm:text-sm transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </div>
        </Link>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className={`grid ${gridColsClass} gap-3 sm:gap-4`}>
          {[...Array(itemsPerRow)].map((_, index) => (
            <div
              key={index}
              className="bg-white border border-[#E4DDCE]/60 rounded-2xl p-2 animate-pulse"
            >
              <div className="aspect-square rounded-xl bg-[#E4DDCE]/50" />
              <div className="h-3.5 w-3/4 rounded-md bg-[#E4DDCE]/50 mt-2" />
              <div className="h-3 w-1/2 rounded-md bg-[#E4DDCE]/40 mt-1" />
              <div className="h-8 rounded-xl bg-[#E4DDCE]/50 mt-2" />
            </div>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <div className={`grid ${gridColsClass} gap-3 sm:gap-4`}>
          {visibleProductsList?.map((item, index) => {
            const inWishlist = wishlist?.includes(String(item._id));
            const inCart = cart?.includes(String(item._id));
            const isOutOfStock = item.stock <= 0;

            const originalPrice =
              item.originalPrice || Math.round(item.price * 1.25);
            const discountPercent =
              item.discountPercent ||
              (originalPrice > item.price
                ? Math.round(((originalPrice - item.price) / originalPrice) * 100)
                : 0);

            const savingsAmount = originalPrice - item.price;

            // প্রথম ৪টি প্রোডাক্টে "NEW" ব্যাজ
            const isNew = index < 4;

            return (
              <Link
                to={"/checkout"}
                state={{ product: item }}
                key={item._id}
                className="group relative flex flex-col bg-white border border-[#E4DDCE] hover:border-[#B08946]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-square bg-[#FAF6EF]/60 overflow-hidden flex items-center justify-center p-1 sm:p-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full rounded-lg h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Top Left Badges */}
                  <div className="absolute top-2 left-2 z-10 flex flex-col items-start gap-1">
                    {isNew && !isOutOfStock && (
                      <div className="bg-[#B08946] text-[#16241F] text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-md shadow-md">
                        NEW
                      </div>
                    )}
                    {discountPercent > 0 && !isOutOfStock && (
                      <div className="bg-red-600 text-white text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                        <FontAwesomeIcon
                          icon={faTag}
                          className="text-[9px] sm:text-[10px]"
                        />
                        <span>{discountPercent}% OFF</span>
                      </div>
                    )}
                  </div>

                  {/* Floating Action Buttons */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(String(item._id));
                      }}
                      aria-label={
                        inWishlist ? "Remove from wishlist" : "Add to wishlist"
                      }
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all duration-200 active:scale-90 ${
                        inWishlist
                          ? "bg-red-500 text-white"
                          : "bg-white/90 text-[#16241F]/60 hover:text-red-500 hover:bg-white"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="text-xs sm:text-sm"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleCart(String(item._id));
                      }}
                      aria-label={inCart ? "Remove from cart" : "Add to cart"}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all duration-200 active:scale-90 ${
                        inCart
                          ? "bg-[#16241F] text-[#B08946]"
                          : "bg-white/90 text-[#16241F]/60 hover:text-[#16241F] hover:bg-white"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={faShoppingCart}
                        className="text-xs sm:text-sm"
                      />
                    </button>
                  </div>

                  {/* Out of Stock Overlay */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-[#16241F]/40 backdrop-blur-[2px] flex items-center justify-center p-2 z-10">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-600 bg-white px-3 py-1 rounded-full shadow-lg border border-red-100">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="pl-2.5 pb-2.5 pr-1 sm:p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <h3
                      title={item.name}
                      className="text-[#16241F] text-sm sm:text-base font-semibold line-clamp-1 leading-snug group-hover:text-[#B08946] transition-colors"
                    >
                      {item.name}
                    </h3>
                  </div>

                  <div className="mt-2">
                    <div className="space-y-0.5 mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base sm:text-lg font-extrabold text-[#16241F]">
                            ৳{item.price}
                          </span>
                          {originalPrice > item.price && (
                            <span className="text-xs sm:text-sm text-[#16241F]/40 line-through font-medium">
                              ৳{originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium text-[#16241F]/50 bg-[#FAF6EF] px-1.5 py-0.5 rounded border border-[#E4DDCE]/60">
                          Stock: {item.stock}
                        </span>
                      </div>

                      {savingsAmount > 0 && !isOutOfStock && (
                        <p className="text-[10px] sm:text-xs text-green-600 font-semibold">
                          Save ৳{savingsAmount}
                        </p>
                      )}
                    </div>

                    <button
                      disabled={isOutOfStock}
                      className="w-full h-9 sm:h-10 rounded-xl bg-[#16241F] hover:bg-[#0F1A16] active:scale-[0.98] disabled:bg-[#16241F]/20 disabled:text-[#16241F]/40 disabled:cursor-not-allowed text-[#FAF6EF] text-sm sm:text-base font-bold transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>{isOutOfStock ? "Unavailable" : "Buy Now"}</span>
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default LatestProducts;