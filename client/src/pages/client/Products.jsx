import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShoppingCart,
  faSliders,
  faFilter,
  faTimes,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useMemo, useState } from "react";
import { CountContext } from "../../context/countContext";
import { Link, useLocation } from "react-router-dom";
import useProducts from "../../hooks/useProducts";

const CATEGORY_OPTIONS = [
  { key: "all", label: "All Categories" },
  { key: "deal", label: "Deal of the Day" },
  { key: "new-arrival", label: "New Arrival" },
  { key: "men", label: "Men's" },
  { key: "women", label: "Women's" },
  { key: "jewellery", label: "Jewellery" },
  { key: "fishing", label: "Fishing" },
  { key: "Electronics", label: "Electronics" },
];

const MIN_LIMIT = 100;
const MAX_LIMIT = 3000;

const Products = () => {
  const { wishlist, cart, toggleWishlist, toggleCart } = useContext(CountContext);
  const [products, loading, error] = useProducts();
  const location = useLocation();

  const initialFilter = location.state?.filter || "all";

  const [activeCategory, setActiveCategory] = useState(initialFilter);
  const [sortBy, setSortBy] = useState("default");

  // Dynamic Range Config (100 Tk - 3000 Tk)
  const [minPrice, setMinPrice] = useState(MIN_LIMIT);
  const [maxPrice, setMaxPrice] = useState(MAX_LIMIT);

  const [inStockOnly, setInStockOnly] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (location.state?.filter) {
      setActiveCategory(location.state.filter);
    }
  }, [location.state]);

  // Dynamic Filtering Logic
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result =
      activeCategory === "all"
        ? [...products]
        : products.filter((item) => item.category === activeCategory);

    if (inStockOnly) {
      result = result.filter((item) => item.stock > 0);
    }

    // Dynamic Price Filter (Between minPrice and maxPrice)
    result = result.filter((item) => item.price >= minPrice && item.price <= maxPrice);

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, activeCategory, inStockOnly, minPrice, maxPrice, sortBy]);

  const resetFilters = () => {
    setActiveCategory("all");
    setSortBy("default");
    setMinPrice(MIN_LIMIT);
    setMaxPrice(MAX_LIMIT);
    setInStockOnly(false);
  };

  // Dynamic Percentage Calculation for Active Track Line
  const minPercent = ((minPrice - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100;
  const maxPercent = ((maxPrice - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100;

  // Render Filter Section Body
  const renderFilterContent = () => (
    <div className="space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-[#E4DDCE]">
        <FontAwesomeIcon icon={faSliders} className="text-[#16241F] text-lg" />
        <h3 className="text-lg font-bold text-[#16241F]">Filter Products</h3>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-[#16241F]/70 mb-2 font-bold">
          Category
        </label>
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="w-full text-sm border border-[#E4DDCE] rounded-lg px-3 py-2 bg-[#FAF6EF] text-[#16241F] focus:outline-none focus:ring-2 focus:ring-[#B08946] transition"
        >
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat.key} value={cat.key}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sorting */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-[#16241F]/70 mb-2 font-bold">
          Sort by
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full text-sm border border-[#E4DDCE] rounded-lg px-3 py-2 bg-[#FAF6EF] text-[#16241F] focus:outline-none focus:ring-2 focus:ring-[#B08946] transition"
        >
          <option value="default">Default</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
        </select>
      </div>

      {/* Dual Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs uppercase tracking-wider text-[#16241F]/70 font-bold">
            Price Range
          </label>
          <span className="text-xs font-bold text-[#B08946] bg-[#FAF6EF] px-2.5 py-1 rounded-md border border-[#E4DDCE]">
            ৳{minPrice} - ৳{maxPrice}
          </span>
        </div>

        {/* Range Slider Track */}
        <div className="relative w-full h-8 flex items-center">
          {/* Base Background Bar */}
          <div className="absolute w-full h-2 bg-[#E4DDCE] rounded-lg pointer-events-none"></div>

          {/* Dynamic Active Gold Bar */}
          <div
            className="absolute h-2 bg-[#B08946] rounded-lg pointer-events-none"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          ></div>

          {/* MIN Price Input Slider (Left Circle) */}
          <input
            type="range"
            min={MIN_LIMIT}
            max={MAX_LIMIT}
            step="10"
            value={minPrice}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), maxPrice - 50);
              setMinPrice(val);
            }}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none accent-[#B08946] z-30 focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
          />

          {/* MAX Price Input Slider (Right Circle) */}
          <input
            type="range"
            min={MIN_LIMIT}
            max={MAX_LIMIT}
            step="10"
            value={maxPrice}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), minPrice + 50);
              setMaxPrice(val);
            }}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none accent-[#B08946] z-40 focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
          />
        </div>

        <div className="flex justify-between text-[11px] text-[#16241F]/60 font-medium mt-1">
          <span>Min: ৳{MIN_LIMIT}</span>
          <span>Max: ৳{MAX_LIMIT}</span>
        </div>
      </div>

      {/* Stock Checkbox */}
      <label className="flex items-center gap-2 cursor-pointer select-none py-1">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="w-4 h-4 accent-[#B08946] rounded cursor-pointer"
        />
        <span className="text-sm text-[#16241F] font-medium">In stock only</span>
      </label>

      {/* Reset Button */}
      <button
        type="button"
        onClick={resetFilters}
        className="w-full py-2 rounded-lg border border-[#16241F]/20 text-[#16241F] text-xs font-bold uppercase tracking-wider hover:bg-[#16241F] hover:text-white transition shadow-sm"
      >
        Reset Filters
      </button>
    </div>
  );

  if (error) {
    return (
      <div className="flex justify-center items-center py-20 min-h-screen bg-[#FAF6EF]">
        <h2 className="text-red-500 font-semibold text-lg">{error}</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[99px] pb-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header Section */}
        <div className="flex justify-between mb-3">
          <h2 className="text-lg sm:text-2xl lg:hidden font-bold">Products</h2>
          <div className="lg:hidden flex items-center sm:w-auto">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-1 px-2 sm:px-4 py-0.5 sm:py-2 bg-white border border-[#E4DDCE] rounded-lg text-[#16241F] text-sm font-semibold hover:bg-gray-50 transition shadow-sm"
            >
              <FontAwesomeIcon icon={faFilter} className="text-[#B08946]" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {isDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsDrawerOpen(false)}
            />
            <div className="relative w-80 max-w-[85%] bg-white h-full shadow-2xl p-6 overflow-y-auto z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#16241F]">Filters</h2>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 hover:bg-[#FAF6EF] rounded-full transition"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-[#16241F] text-lg" />
                </button>
              </div>
              {renderFilterContent()}
            </div>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="flex gap-8 items-start">
          {/* Desktop Sidebar Filter */}
          <aside className="hidden lg:block w-64 shrink-0 bg-white border border-[#E4DDCE] rounded-2xl p-5 shadow-sm sticky top-[100px]">
            {renderFilterContent()}
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white border border-[#E4DDCE]/60 rounded-2xl p-2"
                  >
                    <div className="aspect-square rounded-xl bg-[#E4DDCE]/50" />
                    <div className="h-3.5 w-3/4 rounded-md bg-[#E4DDCE]/50 mt-2" />
                    <div className="h-3 w-1/2 rounded-md bg-[#E4DDCE]/40 mt-1" />
                    <div className="h-8 rounded-xl bg-[#E4DDCE]/50 mt-2" />
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-[#E4DDCE] text-center p-6">
                <FontAwesomeIcon icon={faTag} className="text-4xl text-[#16241F]/30 mb-3" />
                <p className="text-base text-[#16241F] font-semibold">No products found!</p>
                <p className="text-xs text-[#16241F]/60 mt-1">
                  Try resetting your filters or adjusting your price range.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-[#16241F] text-white text-xs font-semibold rounded-lg hover:bg-[#0F1A16] transition"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {!loading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
                {filteredProducts.map((item) => {
                  const inWishlist = wishlist?.includes(item._id);
                  const inCart = cart?.includes(item._id);
                  const isOutOfStock = item.stock <= 0;

                  const originalPrice =
                    item.originalPrice || Math.round(item.price * 1.25);
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
                          <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                            <FontAwesomeIcon icon={faTag} className="text-[8px] sm:text-[9px]" />
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
                            aria-label={
                              inWishlist ? "Remove from wishlist" : "Add to wishlist"
                            }
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all duration-200 active:scale-90 ${inWishlist
                                ? "bg-red-500 text-white"
                                : "bg-white/90 text-[#16241F]/60 hover:text-red-500 hover:bg-white"
                              }`}
                          >
                            <FontAwesomeIcon
                              icon={faHeart}
                              className="text-[11px] sm:text-xs"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleCart(item._id);
                            }}
                            aria-label={inCart ? "Remove from cart" : "Add to cart"}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all duration-200 active:scale-90 ${inCart
                                ? "bg-[#16241F] text-[#B08946]"
                                : "bg-white/90 text-[#16241F]/60 hover:text-[#16241F] hover:bg-white"
                              }`}
                          >
                            <FontAwesomeIcon
                              icon={faShoppingCart}
                              className="text-[11px] sm:text-xs"
                            />
                          </button>
                        </div>

                        {/* Out of Stock Overlay */}
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-[#16241F]/40 backdrop-blur-[2px] flex items-center justify-center p-2 z-10">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-600 bg-white px-3 py-1 rounded-full shadow-lg border border-red-100">
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
                            className="text-[#16241F] text-xs sm:text-sm font-semibold line-clamp-1 leading-snug group-hover:text-[#B08946] transition-colors"
                          >
                            {item.name}
                          </h3>
                        </div>

                        <div className="mt-2">
                          <div className="space-y-0.5 mb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <span className="text-sm sm:text-base font-extrabold text-[#16241F]">
                                  ৳{item.price}
                                </span>
                                {originalPrice > item.price && (
                                  <span className="text-[10px] sm:text-xs text-[#16241F]/40 line-through font-medium">
                                    ৳{originalPrice}
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] sm:text-[10px] font-medium text-[#16241F]/50 bg-[#FAF6EF] px-1 py-0.5 rounded border border-[#E4DDCE]/60">
                                Stock: {item.stock}
                              </span>
                            </div>

                            {savingsAmount > 0 && !isOutOfStock && (
                              <p className="text-[9px] sm:text-[10px] text-green-600 font-semibold">
                                Save ৳{savingsAmount}
                              </p>
                            )}
                          </div>

                          <button
                            disabled={isOutOfStock}
                            className="w-full h-8 sm:h-9 rounded-xl bg-[#16241F] hover:bg-[#0F1A16] active:scale-[0.98] disabled:bg-[#16241F]/20 disabled:text-[#16241F]/40 disabled:cursor-not-allowed text-[#FAF6EF] text-xs font-bold transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5"
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;