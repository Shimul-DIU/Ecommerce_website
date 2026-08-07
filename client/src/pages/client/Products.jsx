import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShoppingCart,
  faSliders,
  faTag,
  faSort,
  faFilter,
  faChevronDown,
  faTimes,
  faBars
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

const Products = () => {
  const { wishlist, cart, toggleWishlist, toggleCart } =
    useContext(CountContext);
  const [products, loading, error] = useProducts();
  const location = useLocation();

  const initialFilter = location.state?.filter || "all";

  const [activeCategory, setActiveCategory] = useState(initialFilter);
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState(10000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (location.state?.filter) {
      setActiveCategory(location.state.filter);
    }
  }, [location.state]);

  const productPrices = useMemo(() => {
    if (!products) return { min: 0, max: 10000 };
    const prices = products.map(p => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result =
      activeCategory === "all"
        ? [...products]
        : products.filter((item) => item.category === activeCategory);

    if (inStockOnly) {
      result = result.filter((item) => item.stock > 0);
    }

    result = result.filter((item) => item.price <= priceRange);

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, activeCategory, inStockOnly, priceRange, sortBy]);

  const resetFilters = () => {
    setActiveCategory("all");
    setSortBy("default");
    setPriceRange(productPrices.max);
    setInStockOnly(false);
  };

  useEffect(() => {
    if (productPrices.max > 0) {
      setPriceRange(productPrices.max);
    }
  }, [productPrices.max]);

  // Filter content (shared between desktop sidebar and mobile drawer)
  const FilterContent = () => (
    <div className="">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faSliders} className="text-[#16241F] text-base" />
        <h3 className="text-lg font-bold text-[#16241F]">Filters</h3>
      </div>

      <div>
        <label className="block text-[10px] sm:text-xs uppercase tracking-wide text-[#16241F]/70 mb-1.5 font-semibold">
          Category
        </label>
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="w-full text-sm border border-[#E4DDCE] rounded-md px-3 py-2 bg-[#FAF6EF] text-[#16241F] focus:outline-none focus:ring-1 focus:ring-blue-600"
        >
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat.key} value={cat.key}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] sm:text-xs uppercase tracking-wide text-[#16241F]/70 mb-1.5 font-semibold">
          Sort by
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full text-sm border border-[#E4DDCE] rounded-md px-3 py-2 bg-[#FAF6EF] text-[#16241F] focus:outline-none focus:ring-1 focus:ring-blue-600"
        >
          <option value="default">Default</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-[10px] sm:text-xs uppercase tracking-wide text-[#16241F]/70 font-semibold">
            Price Range
          </label>
          <span className="text-sm font-bold text-[#16241F]">৳{priceRange}</span>
        </div>
        <input
          type="range"
          min={productPrices.min}
          max={productPrices.max}
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full mt-1 accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-[#16241F]/50 font-medium">
          <span>৳{productPrices.min}</span>
          <span>৳{productPrices.max}</span>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="w-3.5 h-3.5 accent-blue-600"
        />
        <span className="text-sm text-[#16241F] font-medium">In stock only</span>
      </label>

      <button
        type="button"
        onClick={resetFilters}
        className="w-full h-8 rounded-md border border-[#16241F]/20 text-[#16241F] text-sm font-semibold hover:bg-[#16241F] hover:text-white transition"
      >
        Reset Filters
      </button>
    </div>
  );

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <h2 className="text-red-500 text-lg">{error}</h2>
      </div>
    );
  }

  return (
    // Outer wrapper: full viewport height, top padding for navbar (adjust pt-16 if your navbar is different)
    <div className="h-screen  overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 h-full flex flex-col lg:flex-row gap-6">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center gap-3 ">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 border border-[#E4DDCE] rounded-md text-[#16241F] text-sm font-semibold hover:bg-[#FAF6EF] transition"
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>Filters</span>
          </button>
          <span className="text-sm text-[#16241F]/60 font-medium">
            {filteredProducts.length} items
          </span>
        </div>

        {/* Mobile Drawer (left side) */}
        {isDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/30"
              onClick={() => setIsDrawerOpen(false)}
            />
            <div className="relative w-72 max-w-[85%] bg-white shadow-xl overflow-y-auto p-5 animate-slide-in-left">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#16241F]">Filter</h2>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 hover:bg-[#F4F1EA] rounded-full transition"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-[#16241F] text-lg" />
                </button>
              </div>
              <FilterContent />
            </div>
          </div>
        )}

        {/* ---------- Left Sidebar (desktop) ---------- */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="lg:sticky lg:top-4 bg-white border border-[#E4DDCE] rounded-xl p-4">
            <FilterContent />
          </div>
        </aside>

        {/* ---------- Right Side: Products ---------- */}
        <div className="flex-1 min-w-0 h-full flex flex-col">
          {/* Header (title + count) – visible only on desktop */}
          <div className="hidden lg:flex items-center justify-between mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#16241F]">
              {CATEGORY_OPTIONS.find((c) => c.key === activeCategory)?.label}
            </h2>
            <span className="text-xs sm:text-sm text-[#16241F]/60 font-medium">
              {filteredProducts.length} items
            </span>
          </div>

          {/* Grid container – takes remaining height and scrolls internally */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5 grid-rows-2 auto-rows-[1fr] h-full animate-pulse">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="space-y-2 h-full">
                    <div className="aspect-square rounded-xl bg-[#E4DDCE]" />
                    <div className="h-3 w-3/4 rounded bg-[#E4DDCE]" />
                    <div className="h-3 w-1/2 rounded bg-[#E4DDCE]" />
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-sm sm:text-base text-[#16241F]/60 font-medium">
                  No products found matching your filters.
                </p>
              </div>
            )}

            {!loading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  justify-between ">
                {filteredProducts.map((item) => {
                  const inWishlist = wishlist?.includes(item._id);
                  const inCart = cart?.includes(item._id);

                  return (
                    <div
                      key={item._id}
                      className="group flex flex-col bg-white border border-[#E4DDCE] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md h-full"
                    >
                      <div className="relative w-full aspect-square bg-[#F4F1EA] overflow-hidden flex items-center justify-center p-1 sm:p-2">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />

                        <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 z-10">
                          <button
                            type="button"
                            onClick={() => toggleWishlist(item._id)}
                            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                            className={`w-4 h-4 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-sm transition
                              ${inWishlist
                                ? "bg-blue-600 text-white"
                                : "bg-white/90 text-[#16241F]/50 hover:text-blue-600"
                              }`}
                          >
                            <FontAwesomeIcon icon={faHeart} className="text-xs" />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleCart(item._id)}
                            aria-label={inCart ? "Remove from cart" : "Add to cart"}
                            className={`w-4 h-4 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-sm transition
                              ${inCart
                                ? "bg-blue-600 text-white"
                                : "bg-white/90 text-[#16241F]/50 hover:text-blue-600"
                              }`}
                          >
                            <FontAwesomeIcon icon={faShoppingCart} className=" text-xs" />
                          </button>
                        </div>

                        {item.stock <= 0 && (
                          <div className="absolute inset-0 bg-white/70 flex items-center justify-center p-1 z-10">
                            <span className="text-[9px] sm:text-[10px] tracking-wide uppercase text-[#16241F]/70 bg-white px-2 py-0.5 rounded-full border border-[#E4DDCE] font-bold">
                              Out of stock
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-1.5 flex flex-col flex-grow justify-between">
                        <div>
                          <h3 className="text-[#16241F] text-sm sm:text-base font-bold line-clamp-1 leading-tight">
                            {item.name}
                          </h3>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm sm:text-base md:text-lg text-[#16241F] font-bold">
                              ৳{item.price}
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-[#16241F]/50 font-medium">
                              Stock: {item.stock}
                            </span>
                          </div>

                          <Link to="/checkout" state={{ product: item }} className="block">
                            <button
                              disabled={item.stock <= 0}
                              className="w-full p-1 sm:p-2 md:p-2  rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white text-[11px] sm:text-xs font-semibold transition"
                            >
                              {item.stock <= 0 ? "Unavailable" : "Buy Now"}
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;