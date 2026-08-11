import { useState, useEffect, useRef } from 'react';

const banners = [
  {
    id: 1,
    badge: "NEW COLLECTION",
    title: "MEN'S FASHION",
    subtitle: "Look good, feel confident",
    btnText: "Shop Now",
    btnLink: "/shop?category=men",
    products: ["👔", "👟", "⌚"],
    bg: "#0d1b2a",
    badgeColor: "#8d99ae",
    titleColor: "#ffffff",
    subtitleColor: "#b0bec5",
    btnBg: "#ffffff",
    btnColor: "#0d1b2a",
  },
  {
    id: 2,
    badge: "NEW ARRIVAL",
    title: "FEEL THE BEAUTY",
    subtitle: "Premium Fragrances for Every You",
    btnText: "Shop Now",
    btnLink: "/shop?category=perfume",
    products: ["🌸", "🧴", "💎"],
    bg: "#fce4ec",
    badgeColor: "#c2185b",
    titleColor: "#880e4f",
    subtitleColor: "#6d4c5a",
    btnBg: "#c2185b",
    btnColor: "#ffffff",
  },
  {
    id: 3,
    badge: "LATEST TECHNOLOGY",
    title: "ELECTRONICS",
    subtitle: "Smart choices, better living",
    btnText: "Shop Now",
    btnLink: "/shop?category=electronics",
    products: ["🎧", "⌚", "📱"],
    bg: "#0a0f1a",
    badgeColor: "#00bcd4",
    titleColor: "#ffffff",
    subtitleColor: "#90a4ae",
    btnBg: "#00bcd4",
    btnColor: "#0a0f1a",
  },
  {
    id: 4,
    badge: "NEW SEASON",
    title: "WOMEN'S FASHION",
    subtitle: "Elevate your style, every day",
    btnText: "Shop Now",
    btnLink: "/shop?category=women",
    products: ["👗", "👜", "👒"],
    bg: "#f5ebe0",
    badgeColor: "#6d4c41",
    titleColor: "#3e2723",
    subtitleColor: "#5d4037",
    btnBg: "#3e2723",
    btnColor: "#f5ebe0",
  },
  {
    id: 5,
    badge: "LIMITED TIME OFFER",
    title: "MEGA SALE",
    subtitle: "Up to 50% off on selected items",
    btnText: "Shop Now",
    btnLink: "/offers",
    products: ["👟", "👜", "⌚"],
    bg: "#b71c1c",
    badgeColor: "#ffeb3b",
    titleColor: "#ffffff",
    subtitleColor: "#ffcdd2",
    btnBg: "#ffffff",
    btnColor: "#b71c1c",
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
    }, 2500);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex]);

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
      className="max-w-7xl mx-auto "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Container */}
      <div className="relative w-full h-[140px] sm:h-[200px] md:h-[240px] lg:h-[260px] rounded-lg sm:rounded-xl overflow-hidden shadow-sm">

        {/* Slides Stack */}
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="absolute inset-0 flex items-center justify-between px-4 sm:px-8 md:px-12 transition-opacity duration-700 ease-in-out"
            style={{
              background: banner.bg,
              opacity: index === currentIndex ? 1 : 0,
              pointerEvents: index === currentIndex ? "auto" : "none",
              zIndex: index === currentIndex ? 1 : 0,
            }}
            aria-hidden={index !== currentIndex}
          >
            {/* Left Content */}
            <div className="flex flex-col justify-center max-w-[62%] sm:max-w-[55%]">
              <span
                className="text-[8px] sm:text-[10px] md:text-xs font-bold tracking-widest uppercase mb-0.5 sm:mb-1"
                style={{ color: banner.badgeColor }}
              >
                {banner.badge}
              </span>

              <h2
                className="font-serif italic font-bold leading-tight mb-0.5 sm:mb-1"
                style={{
                  color: banner.titleColor,
                  fontSize: "clamp(0.95rem, 2.5vw, 1.8rem)",
                }}
              >
                {banner.title}
              </h2>

              <p
                className="text-[9px] sm:text-xs md:text-xs mb-2 sm:mb-3 opacity-90 font-medium line-clamp-1"
                style={{ color: banner.subtitleColor }}
              >
                {banner.subtitle}
              </p>

              <div>
                <a
                  href={banner.btnLink}
                  className="inline-block px-3 sm:px-5 py-1 sm:py-1.5 text-[9px] sm:text-xs font-semibold rounded-full shadow-sm no-underline w-fit transition-transform hover:scale-105 active:scale-95"
                  style={{ background: banner.btnBg, color: banner.btnColor }}
                >
                  {banner.btnText}
                </a>
              </div>
            </div>

            {/* Right Product Icons */}
            <div className="flex items-center gap-1 sm:gap-3">
              {banner.products.map((p, i) => (
                <span
                  key={i}
                  className="drop-shadow-md select-none"
                  style={{ fontSize: "clamp(18px, 3.8vw, 38px)", lineHeight: 1 }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-black/30 hover:bg-black/50 text-white rounded-full grid place-items-center transition-all z-20 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" className="sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-black/30 hover:bg-black/50 text-white rounded-full grid place-items-center transition-all z-20 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" className="sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Counter */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/30 backdrop-blur-sm text-white text-[8px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full z-20">
          {currentIndex + 1} / {banners.length}
        </div>

        {/* Indicator Dots */}
        <div className="absolute bottom-1.5 sm:bottom-2.5 inset-x-0 flex items-center justify-center gap-1 z-20">
          <div className="flex items-center gap-1 bg-black/25 backdrop-blur-md px-2 py-0.5 sm:py-1 rounded-full">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full h-1 ${
                  index === currentIndex
                    ? "w-4 bg-white"
                    : "w-1 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroBanner;