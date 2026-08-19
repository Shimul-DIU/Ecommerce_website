import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShoppingCart,
  faArrowRight,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import useProducts from "../../hooks/useProducts";
import { CountContext } from "../../context/countContext";


const getItemsCount = (width) => {
  if (width >= 1024) return 4;
  if (width >= 768) return 4;
  if (width >= 640) return 3;
  if (width >= 480) return 3;
  if (width >= 320) return 2;
  return 1;
};

const NewArrivals = () => {
  const { wishlist, cart, toggleWishlist, toggleCart } = useContext(CountContext);
  const [products, loading, error] = useProducts();


  const [itemsPerRow, setItemsPerRow] = useState(() =>
    typeof window !== "undefined" ? getItemsCount(window.innerWidth) : 5
  );

  useEffect(() => {
    const handleResize = () => {
      setItemsPerRow(getItemsCount(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  }[itemsPerRow] || "grid-cols-5";

  if (error) {
    return (
      <div className="flex justify-center items-center py-16 px-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl text-center shadow-sm max-w-md">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  const visibleProductsList = products?.slice(0, itemsPerRow);

  return (
    <section className="max-w-7xl mx-auto ">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 ">
        <div className="flex items-center gap-2 ">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-[#16241F]">
            New Arrivals
          </h2>
          <span className="ml-2 bg-[#FAF6EF] border border-[#E4DDCE] text-[#16241F]/70 text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded-full">
            {products?.length || 0} Products
          </span>
        </div>

        {/* See All link */}
        <Link
          to="/products"
          state={{ filter: "all" }}
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

      {!loading && (
        <div className={`grid ${gridColsClass} gap-3 sm:gap-4.5`}>
          {visibleProductsList?.map((item) => {
            const inWishlist = wishlist?.includes(item._id);
            const inCart = cart?.includes(item._id);
            const isOutOfStock = item.stock <= 0;

            const originalPrice = item.originalPrice || Math.round(item.price * 1.25);
            const discountPercent =
              item.discountPercent ||
              (originalPrice > item.price
                ? Math.round(((originalPrice - item.price) / originalPrice) * 100)
                : 0);

            const savingsAmount = originalPrice - item.price;

            return (
              <Link
                to={'/checkout'}
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

                  {/* Top Left Discount Badge */}
                  {discountPercent > 0 && !isOutOfStock && (
                    <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                      <FontAwesomeIcon icon={faTag} className="text-[9px] sm:text-[10px]" />
                      <span>{discountPercent}% OFF</span>
                    </div>
                  )}

                  {/* Floating Action Buttons */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(item._id);
                      }}
                      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all duration-200 active:scale-90 ${inWishlist
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
                        toggleCart(item._id);
                      }}
                      aria-label={inCart ? "Remove from cart" : "Add to cart"}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all duration-200 active:scale-90 ${inCart
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

export default NewArrivals;
