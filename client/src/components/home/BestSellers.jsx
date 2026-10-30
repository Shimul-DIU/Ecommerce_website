import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShoppingCart,
  faArrowRight,
  faCheck,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { CountContext } from "../../context/CountContext";

const API_URL = "/data/products.json";

// NewArrivals-এর সাথে হুবহু একই breakpoint (প্রতি সারিতে কতটা কার্ড)
const getItemsCount = (width) => {
  if (width >= 1280) return 6; // xl
  if (width >= 1024) return 5; // lg
  if (width >= 768) return 4; // md
  if (width >= 640) return 3; // sm
  if (width >= 320) return 2; // ফোন
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

const BestSellers = () => {
  const { wishlist, cart, toggleWishlist, toggleCart } =
    useContext(CountContext);

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

        // সবচেয়ে বেশি বিক্রি হওয়া আগে
        setProducts([...list].sort((a, b) => (b.sold || 0) - (a.sold || 0)));
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

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
      {/* ============ Section Header ============ */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <span className="hidden sm:block h-8 w-1 rounded-full bg-[#B08946]" />
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#B08946]">
              Most Loved
            </p>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-[#16241F] leading-tight">
                Best Sellers
              </h2>
              <span className="hidden sm:inline-block bg-[#16241F] text-[#FAF6EF] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {products?.length || 0}
              </span>
            </div>
          </div>
        </div>

        <Link
          to="/products"
          state={{ filter: "best-sellers" }}
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

      {/* ============ Loading Skeleton ============ */}
      {loading && (
        <div className={`grid ${gridColsClass} gap-3 sm:gap-4`}>
          {[...Array(itemsPerRow)].map((_, index) => (
            <div
              key={index}
              className="bg-white border border-[#E4DDCE]/60 rounded-3xl p-2 animate-pulse"
            >
              <div className="aspect-square rounded-2xl bg-[#E4DDCE]/50" />
              <div className="h-3.5 w-3/4 rounded-md bg-[#E4DDCE]/50 mt-3" />
              <div className="h-3 w-1/2 rounded-md bg-[#E4DDCE]/40 mt-2" />
              <div className="h-4 w-1/3 rounded-md bg-[#E4DDCE]/50 mt-3 mb-1" />
            </div>
          ))}
        </div>
      )}

      {/* ============ Products Grid ============ */}
      {!loading && (
        <div className={`grid ${gridColsClass} gap-3 sm:gap-4`}>
          {visibleProductsList?.map((item, index) => {
            const inWishlist = wishlist?.includes(String(item._id));
            const inCart = cart?.includes(String(item._id));
            const isOutOfStock = item.stock <= 0;
            const isLowStock = item.stock > 0 && item.stock <= 5;

            const originalPrice =
              item.originalPrice || Math.round(item.price * 1.25);
            const discountPercent =
              item.discountPercent ||
              (originalPrice > item.price
                ? Math.round(((originalPrice - item.price) / originalPrice) * 100)
                : 0);

            const savingsAmount = originalPrice - item.price;

            // প্রথম ৩টি প্রোডাক্টে র‍্যাংক ব্যাজ (#1, #2, #3)
            const isTop = index < 3;

            return (
              <Link
                to={"/checkout"}
                state={{ product: item }}
                key={item._id}
                className="group relative flex flex-col bg-white border border-[#E4DDCE] hover:border-[#B08946]/60 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_18px_40px_-12px_rgba(22,36,31,0.25)] hover:-translate-y-1.5"
              >
                {/* ---------- Image Panel ---------- */}
                <div className="relative w-full aspect-square overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#FFFFFF_0%,#FAF6EF_60%,#EFE9DC_100%)] flex items-center justify-center p-3 sm:p-4">
                  {/* পেছনের হালকা গোল */}
                  <div className="absolute w-2/3 aspect-square rounded-full bg-[#B08946]/10 transition-transform duration-700 group-hover:scale-125" />

                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className={`relative z-[1] w-full h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2 ${
                      isOutOfStock ? "grayscale opacity-60" : ""
                    }`}
                  />

                  {/* Top Left Badges */}
                  <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1">
                    {isTop && !isOutOfStock && (
                      <span className="inline-flex items-center gap-1 bg-[#16241F] text-[#B08946] text-[9px] sm:text-[10px] font-extrabold tracking-[0.12em] px-2 py-0.5 rounded-full shadow-md">
                        <FontAwesomeIcon icon={faFire} className="text-[8px]" />
                        #{index + 1}
                      </span>
                    )}
                    {discountPercent > 0 && !isOutOfStock && (
                      <span className="bg-[#B08946] text-[#16241F] text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full shadow-md">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Floating Action Buttons */}
                  <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-20">
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
                        icon={inCart ? faCheck : faShoppingCart}
                        className="text-xs sm:text-sm"
                      />
                    </button>
                  </div>

                  {/* Hover এ নিচ থেকে স্লাইড করা Quick Buy (ডেস্কটপে) */}
                  {!isOutOfStock && (
                    <div className="hidden md:flex absolute inset-x-3 bottom-3 z-10 translate-y-[140%] group-hover:translate-y-0 transition-transform duration-300">
                      <span className="w-full flex items-center justify-center gap-2 bg-[#16241F] text-[#FAF6EF] text-sm font-bold py-2 rounded-xl shadow-lg">
                        Quick Buy
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="text-xs text-[#B08946]"
                        />
                      </span>
                    </div>
                  )}

                  {/* Out of Stock Overlay */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-[#16241F]/40 backdrop-blur-[2px] flex items-center justify-center p-2 z-10">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-600 bg-white px-3 py-1 rounded-full shadow-lg border border-red-100">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* ---------- Details ---------- */}
                <div className="px-3 pt-3 pb-3 sm:px-4 sm:pb-4 flex flex-col flex-1">
                  <h3
                    title={item.name}
                    className="text-[#16241F] text-sm sm:text-base font-semibold line-clamp-1 leading-snug group-hover:text-[#B08946] transition-colors"
                  >
                    {item.name}
                  </h3>

                  {/* Stock status + sold */}
                  <p className="mt-1 flex items-center gap-1.5 text-[10px] sm:text-xs font-medium">
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${
                        isOutOfStock
                          ? "bg-red-500"
                          : isLowStock
                            ? "bg-orange-400"
                            : "bg-green-500"
                      }`}
                    />
                    <span
                      className={
                        isOutOfStock
                          ? "text-red-500"
                          : isLowStock
                            ? "text-orange-500"
                            : "text-[#16241F]/55"
                      }
                    >
                      {isOutOfStock
                        ? "Out of stock"
                        : isLowStock
                          ? `মাত্র ${item.stock} টি বাকি`
                          : item.sold
                            ? `${item.sold}+ sold`
                            : `In stock: ${item.stock}`}
                    </span>
                  </p>

                  {/* Price */}
                  <div className="mt-auto pt-3">
                    <div className="flex items-end justify-between gap-2 border-t border-dashed border-[#E4DDCE] pt-3">
                      <div className="flex flex-col leading-none">
                        {originalPrice > item.price && (
                          <span className="text-[11px] sm:text-xs text-[#16241F]/40 line-through font-medium mb-1">
                            ৳{originalPrice}
                          </span>
                        )}
                        <span className="text-lg sm:text-xl font-extrabold text-[#16241F]">
                          ৳{item.price}
                        </span>
                      </div>

                      {savingsAmount > 0 && !isOutOfStock ? (
                        <span className="hidden sm:inline-block text-[10px] sm:text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                          Save ৳{savingsAmount}
                        </span>
                      ) : null}

                      {/* Mobile এ ছোট তীর বাটন */}
                      <span
                        className={`sm:hidden w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                          isOutOfStock
                            ? "bg-[#16241F]/15 text-[#16241F]/40"
                            : "bg-[#16241F] text-[#B08946]"
                        }`}
                      >
                        <FontAwesomeIcon icon={faArrowRight} />
                      </span>
                    </div>
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

export default BestSellers;