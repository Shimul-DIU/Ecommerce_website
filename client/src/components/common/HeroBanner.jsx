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
    }, 3500);

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
      // mt-[..] = navbar-এর (utility bar + main nav) মোট ফিক্সড উচ্চতা, যাতে banner নেভবারের ঠিক নিচে বসে,
      // ওভারল্যাপ/আন্ডারল্যাপ না হয়। mobile: ~68px (h-5 + h-12), md+: ~80px (h-6 + h-14)। সাথে সামান্য গ্যাপ যোগ করা আছে।
      className="max-w-7xl mx-auto mt-[-27px] md:mt-[-35px] px-2 sm:px-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Container */}
      <div className="relative w-full h-[200px] sm:h-[280px] md:h-[340px] lg:h-[400px] rounded-lg sm:rounded-xl overflow-hidden shadow-sm">

        {/* Slides Stack */}
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="absolute inset-0 flex items-center justify-between px-5 sm:px-10 md:px-14 lg:px-16 transition-opacity duration-700 ease-in-out"
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
                className="text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase mb-1 sm:mb-2"
                style={{ color: banner.badgeColor }}
              >
                {banner.badge}
              </span>

              <h2
                className="font-serif italic font-bold leading-tight mb-1 sm:mb-2"
                style={{
                  color: banner.titleColor,
                  fontSize: "clamp(1.3rem, 4vw, 3rem)",
                }}
              >
                {banner.title}
              </h2>

              <p
                className="text-[11px] sm:text-sm md:text-base mb-3 sm:mb-5 opacity-90 font-medium line-clamp-2"
                style={{ color: banner.subtitleColor }}
              >
                {banner.subtitle}
              </p>

              <div>
                <a
                  href={banner.btnLink}
                  className="inline-block px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-2.5 text-[11px] sm:text-sm md:text-base font-semibold rounded-full shadow-sm no-underline w-fit transition-transform hover:scale-105 active:scale-95"
                  style={{ background: banner.btnBg, color: banner.btnColor }}
                >
                  {banner.btnText}
                </a>
              </div>
            </div>

            {/* Right Product Icons */}
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
              {banner.products.map((p, i) => (
                <span
                  key={i}
                  className="drop-shadow-md select-none"
                  style={{ fontSize: "clamp(28px, 6vw, 64px)", lineHeight: 1 }}
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
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-black/30 hover:bg-black/50 text-white rounded-full grid place-items-center transition-all z-20 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" className="sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-black/30 hover:bg-black/50 text-white rounded-full grid place-items-center transition-all z-20 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" className="sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Counter */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/30 backdrop-blur-sm text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-full z-20">
          {currentIndex + 1} / {banners.length}
        </div>

        {/* Indicator Dots */}
        <div className="absolute bottom-2.5 sm:bottom-4 inset-x-0 flex items-center justify-center gap-1 z-20">
          <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-2.5 py-1 sm:py-1.5 rounded-full">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full h-1.5 ${
                  index === currentIndex
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80"
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
