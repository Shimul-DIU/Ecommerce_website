import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../utils/translations";

// এখানে নিজের আসল product এর নাম, দাম ও ছবি বসান
const banners = [
  {
    id: 1,
    tag: "MEN'S",
    productName: "Classic Men's Chronograph Watch",
    desc: "Stainless steel body, water resistant, perfect for office and party.",
    oldPrice: 4500,
    price: 2999,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900&auto=format&fit=crop",
    btnText: "Buy Now",
    btnLink: "/products?category=men&search=watch",
  },
  {
    id: 2,
    tag: "WOMEN'S",
    productName: "Belle Premium Hand Bag",
    desc: "Elegant design with durable material and spacious compartments.",
    oldPrice: 2000,
    price: 1340,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop",
    btnText: "Buy Now",
    btnLink: "/products?category=women&search=bag",
  },
  {
    id: 3,
    tag: "JEWELLERY",
    productName: "Gold Plated Pearl Necklace Set",
    desc: "Graceful necklace and earring set that makes every occasion special.",
    oldPrice: 3500,
    price: 1750,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=900&auto=format&fit=crop",
    btnText: "Buy Now",
    btnLink: "/products?category=jewellery&search=necklace",
  },
];

const HeroBanner = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  const goToNext = () =>
    setCurrentIndex((prev) => (prev + 1) % banners.length);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goToNext() : goToPrevious();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="w-full mx-auto px-2 mt-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner Container */}
      <div className="relative w-full h-[300px] sm:h-[380px] md:h-[440px] lg:h-[480px] rounded-2xl overflow-hidden shadow-2xl bg-[#16241F]">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#16241F] via-[#1B2E27] to-[#0F1A16]" />
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#B08946]/20 blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 w-72 h-72 rounded-full bg-[#B08946]/10 blur-3xl" />

        {/* Slides */}
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          const discountPercent = Math.round(
            ((banner.oldPrice - banner.price) / banner.oldPrice) * 100
          );
          const savings = banner.oldPrice - banner.price;

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div className="relative h-full grid grid-cols-2 items-center gap-2 sm:gap-6 px-5 sm:px-12 md:px-16">
                {/* Left: Product Info */}
                <div className="flex flex-col justify-center text-left">
                  <span className="inline-block w-fit text-[9px] sm:text-xs font-black tracking-[0.2em] text-[#B08946] border border-[#B08946]/60 px-2.5 py-1 rounded-full uppercase mb-2 sm:mb-3">
                    {t(banner.tag)}
                  </span>

                  <h2 className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-2 sm:mb-3 line-clamp-3">
                    {t(banner.productName)}
                  </h2>

                  <p className="hidden sm:block text-sm md:text-base text-white/70 font-medium mb-4 line-clamp-2 max-w-md">
                    {t(banner.desc)}
                  </p>

                  {/* Price */}
                  <div className="flex items-end gap-2 sm:gap-3 mb-1">
                    <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#B08946]">
                      ৳{banner.price}
                    </span>
                    <span className="text-xs sm:text-lg text-white/40 line-through font-semibold mb-0.5 sm:mb-1.5">
                      ৳{banner.oldPrice}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-sm font-bold text-green-400 mb-3 sm:mb-6">
                    {t("You save")} ৳{savings}
                  </p>

                  <div>
                    <Link
                      to={banner.btnLink}
                      className="inline-flex items-center justify-center px-5 sm:px-8 py-2 sm:py-3.5 text-[11px] sm:text-sm font-bold uppercase tracking-wider rounded-full bg-[#B08946] text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#c29a52] hover:shadow-xl active:scale-95"
                    >
                      {t(banner.btnText)}
                    </Link>
                  </div>
                </div>

                {/* Right: Product Image */}
                <div className="relative flex items-center justify-center h-full py-6 sm:py-8">
                  <div className="relative w-full max-w-[200px] sm:max-w-[300px] md:max-w-[380px] aspect-square">
                    {/* Gold ring */}
                    <div className="absolute inset-0 rounded-[2rem] rotate-6 border-2 border-[#B08946]/40" />

                    <div
                      className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-white transition-transform duration-[6000ms] ease-out"
                      style={{ transform: isActive ? "scale(1.04)" : "scale(1)" }}
                    >
                      <img
                        src={banner.image}
                        alt={banner.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute -top-3 -right-2 sm:-top-5 sm:-right-4 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-red-600 text-white flex flex-col items-center justify-center shadow-xl border-2 border-white/80 rotate-12">
                      <span className="text-base sm:text-2xl md:text-3xl font-black leading-none">
                        {discountPercent}%
                      </span>
                      <span className="text-[9px] sm:text-xs font-bold tracking-wider">
                        OFF
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 bg-black/40 hover:bg-[#B08946] text-white rounded-full flex items-center justify-center transition-all duration-300 z-20 backdrop-blur-md border border-white/10 shadow-md group"
          aria-label={t("Previous Slide")}
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 bg-black/40 hover:bg-[#B08946] text-white rounded-full flex items-center justify-center transition-all duration-300 z-20 backdrop-blur-md border border-white/10 shadow-md group"
          aria-label={t("Next Slide")}
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Bottom Pagination Dots */}
        <div className="absolute bottom-3 sm:bottom-5 inset-x-0 flex items-center justify-center gap-2 z-20">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full h-2 ${
                  index === currentIndex
                    ? "w-7 bg-[#B08946]"
                    : "w-2 bg-white/50 hover:bg-white"
                }`}
                aria-label={`${t("Go to slide")} ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;