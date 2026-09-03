import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const banners = [
  {
    id: 1,
    badge: "HOT DEAL - 50% OFF",
    title: "LATEST SMARTPHONES",
    subtitle: "Experience cutting-edge technology with high-res cameras and all-day battery life.",
    btnText: "Shop Electronics",
    btnLink: "/products?category=smartphones",
    bgImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop",
    badgeBg: "#D10024",
    badgeTextColor: "#FFFFFF",
    titleColor: "#FFFFFF",
    subtitleColor: "#E4E6EB",
    btnBg: "#D10024",
    btnColor: "#FFFFFF",
  },
  {
    id: 2,
    badge: "NEW ARRIVAL",
    title: "PREMIUM HEADPHONES",
    subtitle: "Immerse yourself in crystal-clear sound with active noise cancellation.",
    btnText: "Discover Sound",
    btnLink: "/products?category=accessories",
    bgImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
    badgeBg: "#2B2D42",
    badgeTextColor: "#FFFFFF",
    titleColor: "#FFFFFF",
    subtitleColor: "#D1D5DB",
    btnBg: "#FFFFFF",
    btnColor: "#15161D",
  },
  {
    id: 3,
    badge: "EXCLUSIVES",
    title: "NEXT-GEN LAPTOPS",
    subtitle: "Unmatched performance for gaming, editing, and daily productivity.",
    btnText: "Buy Now",
    btnLink: "/products?category=laptops",
    bgImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1600&auto=format&fit=crop",
    badgeBg: "#FFB400",
    badgeTextColor: "#15161D",
    titleColor: "#FFFFFF",
    subtitleColor: "#E5E7EB",
    btnBg: "#D10024",
    btnColor: "#FFFFFF",
  },
  {
    id: 4,
    badge: "LIMITED STOCK",
    title: "SMARTWATCHES & WEARABLES",
    subtitle: "Track your health, fitness, and daily notifications seamlessly on the go.",
    btnText: "Explore Collection",
    btnLink: "/products?category=wearables",
    bgImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop",
    badgeBg: "#10B981",
    badgeTextColor: "#FFFFFF",
    titleColor: "#FFFFFF",
    subtitleColor: "#D1D5DB",
    btnBg: "#FFFFFF",
    btnColor: "#111827",
  },
];

const HeroBanner = () => {
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
      className="max-w-7xl mx-auto px-2  mt-2 "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner Container */}
      <div className="relative w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
        {/* Slides */}
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
            >
              {/* Background Image with Dark Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 ease-out"
                style={{
                  backgroundImage: `url(${banner.bgImage})`,
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
              </div>

              {/* Content Box */}
              <div className="relative h-full max-w-xl flex flex-col justify-center px-6 sm:px-12 md:px-16 text-left">
                {/* Badge */}
                <div className="mb-2 sm:mb-3">
                  <span
                    className="inline-block text-[10px] sm:text-xs font-black tracking-wider px-3 py-1 rounded-md uppercase shadow-md"
                    style={{
                      backgroundColor: banner.badgeBg,
                      color: banner.badgeTextColor,
                    }}
                  >
                    {banner.badge}
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-tight mb-2 sm:mb-3 drop-shadow-md"
                  style={{ color: banner.titleColor }}
                >
                  {banner.title}
                </h2>

                {/* Subtitle */}
                <p
                  className="text-xs sm:text-sm md:text-base font-medium mb-5 sm:mb-8 line-clamp-2 leading-relaxed opacity-90 max-w-md"
                  style={{ color: banner.subtitleColor }}
                >
                  {banner.subtitle}
                </p>

                {/* CTA Button */}
                <div>
                  <Link
                    to={banner.btnLink}
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                    style={{
                      backgroundColor: banner.btnBg,
                      color: banner.btnColor,
                    }}
                  >
                    {banner.btnText}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-black/40 hover:bg-[#D10024] text-white rounded-full flex items-center justify-center transition-all duration-300 z-20 backdrop-blur-md border border-white/10 shadow-md group"
          aria-label="Previous Slide"
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
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-black/40 hover:bg-[#D10024] text-white rounded-full flex items-center justify-center transition-all duration-300 z-20 backdrop-blur-md border border-white/10 shadow-md group"
          aria-label="Next Slide"
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
        <div className="absolute bottom-4 sm:bottom-6 inset-x-0 flex items-center justify-center gap-2 z-20">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full h-2 ${index === currentIndex
                    ? "w-7 bg-[#D10024]"
                    : "w-2 bg-white/50 hover:bg-white"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;