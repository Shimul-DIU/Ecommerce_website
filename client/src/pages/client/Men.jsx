import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faHeart,
  faShoppingCart,
  faSliders,
  faFilter,
  faTimes,
  faTag,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import { CountContext } from "../../context/countContext";
import useProducts from "../../hooks/useProducts";
import { useScroll } from "../../hooks/useScroll";


/* =========================================================
   PRICE RANGE
   ========================================================= */

const MIN_LIMIT = 100;
const MAX_LIMIT = 3000;


/* =========================================================
   MEN CATEGORIES

   আপনার backend/category data অনুযায়ী এগুলো পরিবর্তন করতে পারেন।
   ========================================================= */

const MEN_CATEGORIES = [
  {
    key: "men",
    label: "All Men's",
  },
  {
    key: "men-shirt",
    label: "Shirt",
  },
  {
    key: "men-tshirt",
    label: "T-Shirt",
  },
  {
    key: "men-pant",
    label: "Pants",
  },
  {
    key: "men-jeans",
    label: "Jeans",
  },
  {
    key: "men-shoes",
    label: "Shoes",
  },
  {
    key: "men-accessories",
    label: "Accessories",
  },
];


/* =========================================================
   MEN PAGE
   ========================================================= */

const Men = () => {
  const isScrolled = useScroll();

  const {
    wishlist,
    cart,
    toggleWishlist,
    toggleCart,
  } = useContext(CountContext);

  const [products, loading, error] = useProducts();

  const [searchParams] = useSearchParams();

  /* Search query */
  const searchQuery =
    searchParams.get("search")?.trim().toLowerCase() || "";

  /* =======================================================
     FILTER STATES
     ======================================================= */

  const [selectedCategory, setSelectedCategory] =
    useState("men");

  const [sortBy, setSortBy] = useState("default");

  const [minPrice, setMinPrice] =
    useState(MIN_LIMIT);

  const [maxPrice, setMaxPrice] =
    useState(MAX_LIMIT);

  const [inStockOnly, setInStockOnly] =
    useState(false);

  const [isDrawerOpen, setIsDrawerOpen] =
    useState(false);


  /* =======================================================
     FILTER MEN PRODUCTS

     IMPORTANT:

     আপনার backend-এ যদি Men's category value
     "men" হয় তাহলে এই logic কাজ করবে।

     যদি আপনার database-এ category অন্য নামে থাকে,
     এখানে category matching পরিবর্তন করবেন।
     ======================================================= */

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    /*
      প্রথমে শুধুমাত্র Men's products নিচ্ছি।

      আপনার existing Products.jsx-এ:
      item.category === activeCategory

      ব্যবহার করা হয়েছে।
      তাই এখানেও একই structure রাখা হয়েছে।
    */

    let result = products.filter(
      (item) => item.category === "men"
    );


    /* =====================================================
       SEARCH
       ===================================================== */

    if (searchQuery) {
      const searchTerms = searchQuery
        .split(/\s+/)
        .filter(Boolean);

      const searchedProducts = result.filter((item) => {
        const searchableText = [
          item.name,
          item.category,
          item.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchTerms.every((term) =>
          searchableText.includes(term)
        );
      });

      result = searchedProducts;
    }


    /* =====================================================
       PRICE FILTER
       ===================================================== */

    result = result.filter(
      (item) =>
        item.price >= minPrice &&
        item.price <= maxPrice
    );


    /* =====================================================
       STOCK FILTER
       ===================================================== */

    if (inStockOnly) {
      result = result.filter(
        (item) => item.stock > 0
      );
    }


    /* =====================================================
       SORT
       ===================================================== */

    if (sortBy === "price-low") {
      result = [...result].sort(
        (a, b) => a.price - b.price
      );
    }

    if (sortBy === "price-high") {
      result = [...result].sort(
        (a, b) => b.price - a.price
      );
    }

    return result;
  }, [
    products,
    searchQuery,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
  ]);


  /* =======================================================
     RESET FILTERS
     ======================================================= */

  const resetFilters = () => {
    setSelectedCategory("men");
    setSortBy("default");
    setMinPrice(MIN_LIMIT);
    setMaxPrice(MAX_LIMIT);
    setInStockOnly(false);
  };


  /* =======================================================
     PRICE SLIDER POSITION
     ======================================================= */

  const minPercent =
    ((minPrice - MIN_LIMIT) /
      (MAX_LIMIT - MIN_LIMIT)) *
    100;

  const maxPercent =
    ((maxPrice - MIN_LIMIT) /
      (MAX_LIMIT - MIN_LIMIT)) *
    100;


  /* =======================================================
     FILTER CONTENT

     Desktop sidebar এবং mobile drawer
     দু জায়গাতেই একই filter ব্যবহার হবে।
     ======================================================= */

  const renderFilterContent = () => (
    <div className="space-y-6">

      {/* ===================================================
          FILTER HEADER
      =================================================== */}

      <div className="flex items-center gap-2 border-b border-[#E4DDCE] pb-3">
        <FontAwesomeIcon
          icon={faSliders}
          className="text-lg text-[#16241F]"
        />

        <h3 className="text-base font-bold text-[#16241F]">
          Filter Products
        </h3>
      </div>


      {/* ===================================================
          CATEGORY
      =================================================== */}

      <div>
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[#16241F]/70">
          Category
        </label>

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
          className="w-full rounded-lg border border-[#E4DDCE] bg-[#FAF6EF] px-3 py-2.5 text-sm text-[#16241F] outline-none transition focus:border-[#B08946] focus:ring-2 focus:ring-[#B08946]/20"
        >
          {MEN_CATEGORIES.map((category) => (
            <option
              key={category.key}
              value={category.key}
            >
              {category.label}
            </option>
          ))}
        </select>
      </div>


      {/* ===================================================
          SORT
      =================================================== */}

      <div>
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[#16241F]/70">
          Sort By
        </label>

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
          className="w-full rounded-lg border border-[#E4DDCE] bg-[#FAF6EF] px-3 py-2.5 text-sm text-[#16241F] outline-none transition focus:border-[#B08946] focus:ring-2 focus:ring-[#B08946]/20"
        >
          <option value="default">
            Default
          </option>

          <option value="price-low">
            Price: Low → High
          </option>

          <option value="price-high">
            Price: High → Low
          </option>
        </select>
      </div>


      {/* ===================================================
          PRICE RANGE
      =================================================== */}

      <div>

        <div className="mb-2 flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#16241F]/70">
            Price Range
          </label>

          <span className="rounded-md border border-[#E4DDCE] bg-[#FAF6EF] px-2 py-1 text-[10px] font-bold text-[#B08946]">
            ৳{minPrice} - ৳{maxPrice}
          </span>
        </div>


        {/* Slider */}

        <div className="relative flex h-8 w-full items-center">

          {/* Background */}
          <div className="pointer-events-none absolute h-1.5 w-full rounded-full bg-[#E4DDCE]" />


          {/* Active range */}
          <div
            className="pointer-events-none absolute h-1.5 rounded-full bg-[#B08946]"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />


          {/* Minimum */}
          <input
            type="range"
            min={MIN_LIMIT}
            max={MAX_LIMIT}
            step="10"
            value={minPrice}
            onChange={(e) => {
              const value = Math.min(
                Number(e.target.value),
                maxPrice - 50
              );

              setMinPrice(value);
            }}
            className="absolute z-30 h-2 w-full appearance-none bg-transparent pointer-events-none accent-[#B08946] focus:outline-none [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
          />


          {/* Maximum */}
          <input
            type="range"
            min={MIN_LIMIT}
            max={MAX_LIMIT}
            step="10"
            value={maxPrice}
            onChange={(e) => {
              const value = Math.max(
                Number(e.target.value),
                minPrice + 50
              );

              setMaxPrice(value);
            }}
            className="absolute z-40 h-2 w-full appearance-none bg-transparent pointer-events-none accent-[#B08946] focus:outline-none [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
          />

        </div>


        <div className="mt-1 flex justify-between text-[10px] font-medium text-[#16241F]/50">
          <span>Min: ৳{MIN_LIMIT}</span>
          <span>Max: ৳{MAX_LIMIT}</span>
        </div>

      </div>


      {/* ===================================================
          STOCK
      =================================================== */}

      <label className="flex cursor-pointer select-none items-center gap-2">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) =>
            setInStockOnly(e.target.checked)
          }
          className="h-4 w-4 cursor-pointer accent-[#B08946]"
        />

        <span className="text-sm font-medium text-[#16241F]">
          In stock only
        </span>
      </label>


      {/* ===================================================
          RESET
      =================================================== */}

      <button
        type="button"
        onClick={resetFilters}
        className="w-full rounded-lg border border-[#16241F]/20 py-2.5 text-xs font-bold uppercase tracking-wider text-[#16241F] shadow-sm transition hover:bg-[#16241F] hover:text-white"
      >
        Reset Filters
      </button>

    </div>
  );


  /* =======================================================
     ERROR
     ======================================================= */

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6EF] px-4">
        <h2 className="font-semibold text-red-500">
          {error}
        </h2>
      </div>
    );
  }


  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <div className="min-h-screen bg-white pb-12">

      {/* ===================================================
          TOP BANNER
      =================================================== */}

      <section className="relative overflow-hidden">

        <div className="relative h-[220px] sm:h-[280px] lg:h-[340px]">

          {/* Banner image */}

          <img
            src="https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1800&q=85"
            alt="Men's Collection"
            className="h-full w-full object-cover"
          />


          {/* Dark overlay */}

          <div className="absolute inset-0 bg-gradient-to-r from-[#16241F]/90 via-[#16241F]/60 to-[#16241F]/20" />


          {/* Banner content */}

          <div className="absolute inset-0 flex items-center">

            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

              <div className="max-w-xl">

                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D8B766] sm:text-xs">
                  Men's Collection
                </p>

                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Style Made for You
                </h1>

                <p className="mt-3 max-w-md text-sm leading-6 text-white/75 sm:text-base">
                  Discover our latest men's fashion,
                  footwear and accessories.
                </p>

                <Link
                  to="/products"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#B08946] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#967238]"
                >
                  Explore Collection

                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-[10px]"
                  />
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">

        {/* =================================================
            MOBILE FILTER BUTTON
        ================================================= */}

        <div className="mb-5 flex items-center justify-between lg:hidden">

          <div>
            <h2 className="text-xl font-bold text-[#16241F]">
              Men's Collection
            </h2>

            <p className="mt-0.5 text-xs text-[#16241F]/50">
              {filteredProducts.length} products
            </p>
          </div>


          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-[#E4DDCE] bg-white px-3 py-2 text-sm font-semibold text-[#16241F] shadow-sm"
          >
            <FontAwesomeIcon
              icon={faFilter}
              className="text-[#B08946]"
            />

            Filters
          </button>

        </div>


        {/* =================================================
            MOBILE FILTER DRAWER
        ================================================= */}

        {isDrawerOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">

            {/* Overlay */}

            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsDrawerOpen(false)}
            />


            {/* Drawer */}

            <div className="absolute left-0 top-0 h-full w-80 max-w-[88%] overflow-y-auto bg-white p-5 shadow-2xl">

              <div className="mb-6 flex items-center justify-between">

                <h2 className="text-lg font-bold text-[#16241F]">
                  Filters
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setIsDrawerOpen(false)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF6EF] text-[#16241F]"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>

              </div>


              {renderFilterContent()}

            </div>

          </div>
        )}


        {/* =================================================
            DESKTOP: FILTER + PRODUCTS
        ================================================= */}

        <div className="flex items-start gap-6 lg:gap-8">

          {/* =================================================
              LEFT FILTER SIDEBAR
          ================================================= */}

          <aside
            className={`hidden w-60 shrink-0 rounded-2xl border border-[#E4DDCE] bg-white p-5 shadow-sm lg:block xl:w-64 ${isScrolled
                ? "sticky top-[92px]"
                : "sticky top-[76px]"
              }`}
          >

            {renderFilterContent()}

          </aside>


          {/* =================================================
              RIGHT PRODUCT AREA
          ================================================= */}

          <main className="min-w-0 flex-1">

            {/* Product toolbar */}

            <div className="mb-5 flex items-center justify-between border-b border-[#E4DDCE] pb-4">

              <div>

                <h2 className="text-xl font-bold text-[#16241F]">
                  Men's Products
                </h2>

                <p className="mt-0.5 text-xs text-[#16241F]/50">
                  Showing {filteredProducts.length} products
                </p>

              </div>


              {/* Desktop sort */}

              <div className="hidden items-center gap-2 sm:flex">

                <span className="text-xs text-[#16241F]/50">
                  Sort:
                </span>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                  className="rounded-lg border border-[#E4DDCE] bg-white px-3 py-2 text-xs font-semibold text-[#16241F] outline-none focus:border-[#B08946]"
                >
                  <option value="default">
                    Featured
                  </option>

                  <option value="price-low">
                    Price: Low → High
                  </option>

                  <option value="price-high">
                    Price: High → Low
                  </option>
                </select>

              </div>

            </div>


            {/* =================================================
                LOADING SKELETON
            ================================================= */}

            {loading && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-[#E4DDCE]/60 bg-white p-2"
                  >

                    <div className="aspect-square animate-pulse rounded-xl bg-[#E4DDCE]/50" />

                    <div className="mt-3 h-3.5 w-3/4 animate-pulse rounded-md bg-[#E4DDCE]/50" />

                    <div className="mt-2 h-3 w-1/2 animate-pulse rounded-md bg-[#E4DDCE]/40" />

                    <div className="mt-3 h-9 animate-pulse rounded-xl bg-[#E4DDCE]/50" />

                  </div>
                ))}

              </div>
            )}


            {/* =================================================
                EMPTY
            ================================================= */}

            {!loading &&
              filteredProducts.length === 0 && (
                <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-[#E4DDCE] bg-white p-6 text-center">

                  <FontAwesomeIcon
                    icon={faTag}
                    className="mb-3 text-4xl text-[#16241F]/20"
                  />

                  <p className="font-semibold text-[#16241F]">
                    No men's products found
                  </p>

                  <p className="mt-1 text-xs text-[#16241F]/50">
                    Try changing your filters or price
                    range.
                  </p>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-4 rounded-lg bg-[#16241F] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0F1A16]"
                  >
                    Reset Filters
                  </button>

                </div>
              )}


            {/* =================================================
                PRODUCT GRID
            ================================================= */}

            {!loading &&
              filteredProducts.length > 0 && (
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4">

                  {filteredProducts.map((item) => {

                    /* Wishlist state */
                    const inWishlist =
                      wishlist?.includes(item._id);

                    /* Cart state */
                    const inCart =
                      cart?.includes(item._id);

                    /* Stock */
                    const isOutOfStock =
                      item.stock <= 0;


                    /* Original price */

                    const originalPrice =
                      item.originalPrice ||
                      Math.round(item.price * 1.25);


                    /* Discount */

                    const discountPercent =
                      item.discountPercent ||
                      (
                        originalPrice > item.price
                          ? Math.round(
                            (
                              (originalPrice -
                                item.price) /
                              originalPrice
                            ) * 100
                          )
                          : 0
                      );


                    /* Savings */

                    const savingsAmount =
                      originalPrice - item.price;


                    return (

                      <Link
                        key={item._id}
                        to="/checkout"
                        state={{
                          product: item,
                        }}
                        className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E4DDCE] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#B08946]/50 hover:shadow-xl"
                      >

                        {/* =================================================
                            PRODUCT IMAGE
                        ================================================= */}

                        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-[#FAF6EF]/60 p-1.5 sm:p-2">

                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="h-full w-full rounded-lg object-contain transition-transform duration-500 group-hover:scale-105"
                          />


                          {/* =================================================
                              DISCOUNT BADGE
                          ================================================= */}

                          {discountPercent > 0 &&
                            !isOutOfStock && (
                              <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-md bg-red-600 px-2 py-0.5 text-[9px] font-extrabold text-white shadow-md sm:text-[10px]">

                                <FontAwesomeIcon
                                  icon={faTag}
                                  className="text-[8px]"
                                />

                                <span>
                                  {discountPercent}% OFF
                                </span>

                              </div>
                            )}


                          {/* =================================================
                              WISHLIST + CART
                          ================================================= */}

                          <div className="absolute right-2 top-2 z-20 flex flex-col gap-1.5">

                            {/* Wishlist */}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                toggleWishlist(item._id);
                              }}
                              aria-label={
                                inWishlist
                                  ? "Remove from wishlist"
                                  : "Add to wishlist"
                              }
                              className={`flex h-7 w-7 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-200 active:scale-90 sm:h-8 sm:w-8 ${inWishlist
                                  ? "bg-red-500 text-white"
                                  : "bg-white/90 text-[#16241F]/60 hover:bg-white hover:text-red-500"
                                }`}
                            >

                              <FontAwesomeIcon
                                icon={faHeart}
                                className="text-[11px] sm:text-xs"
                              />

                            </button>


                            {/* Cart */}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                toggleCart(item._id);
                              }}
                              aria-label={
                                inCart
                                  ? "Remove from cart"
                                  : "Add to cart"
                              }
                              className={`flex h-7 w-7 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-200 active:scale-90 sm:h-8 sm:w-8 ${inCart
                                  ? "bg-[#16241F] text-[#B08946]"
                                  : "bg-white/90 text-[#16241F]/60 hover:bg-white hover:text-[#16241F]"
                                }`}
                            >

                              <FontAwesomeIcon
                                icon={faShoppingCart}
                                className="text-[11px] sm:text-xs"
                              />

                            </button>

                          </div>


                          {/* =================================================
                              OUT OF STOCK
                          ================================================= */}

                          {isOutOfStock && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#16241F]/40 p-2 backdrop-blur-[2px]">

                              <span className="rounded-full border border-red-100 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600 shadow-lg sm:text-xs">
                                Out of Stock
                              </span>

                            </div>
                          )}

                        </div>


                        {/* =================================================
                            PRODUCT DETAILS
                        ================================================= */}

                        <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3.5">

                          <div>

                            <h3
                              title={item.name}
                              className="line-clamp-1 text-xs font-semibold leading-snug text-[#16241F] transition-colors group-hover:text-[#B08946] sm:text-sm"
                            >
                              {item.name}
                            </h3>

                          </div>


                          <div className="mt-2">

                            {/* Price */}

                            <div className="mb-2 space-y-0.5">

                              <div className="flex items-center justify-between gap-1">

                                <div className="flex min-w-0 items-center gap-1">

                                  <span className="text-sm font-extrabold text-[#16241F] sm:text-base">
                                    ৳{item.price}
                                  </span>

                                  {originalPrice >
                                    item.price && (
                                      <span className="text-[10px] font-medium text-[#16241F]/40 line-through sm:text-xs">
                                        ৳{originalPrice}
                                      </span>
                                    )}

                                </div>


                                {/* Stock */}

                                <span className="shrink-0 rounded border border-[#E4DDCE]/60 bg-[#FAF6EF] px-1 py-0.5 text-[9px] font-medium text-[#16241F]/50 sm:text-[10px]">
                                  Stock: {item.stock}
                                </span>

                              </div>


                              {/* Saving */}

                              {savingsAmount > 0 &&
                                !isOutOfStock && (
                                  <p className="text-[9px] font-semibold text-green-600 sm:text-[10px]">
                                    Save ৳{savingsAmount}
                                  </p>
                                )}

                            </div>


                            {/* Buy button */}

                            <button
                              type="button"
                              disabled={isOutOfStock}
                              onClick={(e) =>
                                e.preventDefault()
                              }
                              className="flex h-8 w-full items-center justify-center gap-1.5 rounded-xl bg-[#16241F] text-xs font-bold text-[#FAF6EF] shadow-sm transition-all duration-200 hover:bg-[#0F1A16] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#16241F]/20 disabled:text-[#16241F]/40 sm:h-9"
                            >
                              <span>
                                {isOutOfStock
                                  ? "Unavailable"
                                  : "Buy Now"}
                              </span>
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


export default Men;