import { useState, useEffect } from 'react';

const banners = [
  {
    id: 1,
    badge: "New Collection",
    title: "MEN'S FASHION",
    subtitle: "Look good, feel confident",
    btnText: "Shop Now",
    btnLink: "/shop?category=men",
    features: ["PREMIUM QUALITY", "FAST DELIVERY", "BEST PRICE"],
    featureIcons: ["🛡️", "🚚", "🏷️"],
    products: ["👔", "👟", "⌚"],
    bg: "#0d1b2a",
    badgeColor: "#4fc3f7",
    titleColor: "#ffffff",
    subtitleColor: "#b0bec5",
    btnBg: "#ffffff",
    btnColor: "#0d1b2a",
    layout: "left",
  },
  {
    id: 2,
    badge: "New Arrival",
    title: "FEEL THE BEAUTY",
    subtitle: "Premium Fragrances for Every You",
    btnText: "Shop Now",
    btnLink: "/shop?category=perfume",
    features: ["LONG LASTING", "PREMIUM QUALITY", "CRUELTY FREE"],
    featureIcons: ["🍃", "💎", "💚"],
    products: ["🌸", "🧴"],
    bg: "#fce4ec",
    badgeColor: "#c2185b",
    titleColor: "#880e4f",
    subtitleColor: "#6d4c5a",
    btnBg: "#c2185b",
    btnColor: "#ffffff",
    layout: "right",
    italic: true,
  },
  {
    id: 3,
    badge: "Latest Technology",
    title: "ELECTRONICS",
    subtitle: "Smart choices, better living",
    btnText: "Shop Now",
    btnLink: "/shop?category=electronics",
    features: ["100% Original Products", "Warranty Available", "Fast & Safe Delivery"],
    featureIcons: ["✓", "✓", "✓"],
    products: ["🎧", "⌚", "📱", "💻"],
    bg: "#0a0f1a",
    badgeColor: "#00bcd4",
    titleColor: "#ffffff",
    subtitleColor: "#90a4ae",
    btnBg: "#00bcd4",
    btnColor: "#0a0f1a",
    layout: "left",
    accentColor: "#00bcd4",
    featRight: true,
  },
  {
    id: 4,
    badge: "New Season",
    title: "WOMEN'S FASHION",
    subtitle: "Elevate your style, every day",
    btnText: "Shop Now",
    btnLink: "/shop?category=women",
    features: ["Trendy Collections", "Premium Quality", "Easy Returns & Exchange"],
    featureIcons: ["✓", "✓", "✓"],
    products: ["👗", "👜", "👒"],
    bg: "#f5ebe0",
    badgeColor: "#6d4c41",
    titleColor: "#3e2723",
    subtitleColor: "#5d4037",
    btnBg: "#3e2723",
    btnColor: "#f5ebe0",
    layout: "left",
    accentColor: "#795548",
    featRight: true,
    italic: true,
  },
  {
    id: 5,
    badge: "Limited Time Offer",
    title: "MEGA",
    titleHighlight: "SALE",
    subtitle: "Up to 50% off on selected items",
    btnText: "Shop Now",
    btnLink: "/offers",
    products: ["👟", "👜", "⌚"],
    bg: "#b71c1c",
    badgeColor: "#ffeb3b",
    titleColor: "#ffffff",
    highlightColor: "#ffeb3b",
    subtitleColor: "#ffcdd2",
    btnBg: "#ffffff",
    btnColor: "#b71c1c",
    layout: "left",
    isSale: true,
  },
];

const BannerItem = ({ banner }) => {
  const isRight = banner.layout === "right";

  return (
    <div
      style={{ background: banner.bg }}
      className="w-full rounded-xl overflow-hidden flex items-center h-[280px] md:h-[340px]"
    >
      <div
        className="flex items-center justify-between w-full px-5 py-5 md:px-10 gap-4 h-full"
        style={{ flexDirection: isRight ? "row-reverse" : "row" }}
      >
        {/* ---- Text side ---- */}
        <div className="flex-1 min-w-0 h-full flex flex-col justify-center">
          {/* Badge */}
          <span
            className="text-[10px] font-bold uppercase tracking-widest block mb-2"
            style={
              banner.isSale
                ? {
                    color: banner.badgeColor,
                    background: "rgba(0,0,0,0.25)",
                    padding: "2px 8px",
                    borderRadius: "3px",
                    display: "inline-block",
                    width: "fit-content",
                  }
                : { color: banner.badgeColor }
            }
          >
            {banner.badge}
          </span>

          {/* Title */}
          <div
            className="font-bold leading-tight mb-1"
            style={{
              color: banner.titleColor,
              fontSize: "clamp(1.3rem, 2.5vw, 2.2rem)",
              fontFamily: banner.italic ? "Georgia, serif" : "inherit",
              fontStyle: banner.italic ? "italic" : "normal",
            }}
          >
            {banner.isSale ? (
              <span>
                {banner.title}{" "}
                <span style={{ color: banner.highlightColor }}>
                  {banner.titleHighlight}
                </span>
              </span>
            ) : (
              banner.title
            )}
          </div>

          {/* Subtitle */}
          <p
            className="text-sm mb-3"
            style={{ color: banner.subtitleColor }}
          >
            {banner.subtitle}
          </p>

          {/* Icon features — B1, B2 only */}
          {!banner.featRight && !banner.isSale && banner.features && (
            <div className="hidden md:flex gap-4 mb-3">
              {banner.features.map((f, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-0.5 text-center"
                  style={{ color: banner.subtitleColor, fontSize: "8px", fontWeight: 600 }}
                >
                  <span style={{ fontSize: "18px" }}>{banner.featureIcons[i]}</span>
                  {f}
                </div>
              ))}
            </div>
          )}

          {/* Button */}
          <a
            href={banner.btnLink}
            className="inline-block px-4 py-1.5 text-sm font-semibold rounded no-underline w-fit"
            style={{
              background: banner.btnBg,
              color: banner.btnColor,
            }}
          >
            {banner.btnText}
          </a>
        </div>

        {/* ---- Products + right features ---- */}
        <div className="flex items-center gap-3 shrink-0 h-full">
          {/* Emoji products */}
          <div className="flex gap-1 items-center">
            {banner.products.map((p, i) => (
              <span
                key={i}
                style={{
                  fontSize: "clamp(30px, 4vw, 48px)",
                  lineHeight: 1,
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                }}
              >
                {p}
              </span>
            ))}
          </div>

          {/* Right-side text features — B3, B4 */}
          {banner.featRight && (
            <div className="hidden lg:flex flex-col gap-1.5">
              {banner.features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs font-medium"
                  style={{ color: banner.subtitleColor }}
                >
                  <span style={{ color: banner.accentColor, fontWeight: 700 }}>
                    {banner.featureIcons[i]}
                  </span>
                  {f}
                </div>
              ))}
            </div>
          )}

          {/* Sale circle — B5 */}
          {banner.isSale && (
            <div
              className="rounded-full flex flex-col items-center justify-center shrink-0"
              style={{
                width: "clamp(60px, 8vw, 85px)",
                height: "clamp(60px, 8vw, 85px)",
                background: "#ffeb3b",
              }}
            >
              <span
                style={{
                  color: "#b71c1c",
                  fontSize: "clamp(16px, 2vw, 24px)",
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                50%
              </span>
              <span
                style={{
                  color: "#b71c1c",
                  fontSize: "clamp(9px, 1vw, 12px)",
                  fontWeight: 700,
                }}
              >
                OFF
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HeroBanner = () => {
  // Create extended array with duplicates for smooth infinite loop
  // [..., 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, ...]
  const extendedBanners = [
    ...banners.slice(-2), // Last 2 banners (4, 5)
    ...banners,           // All banners (1, 2, 3, 4, 5)
    ...banners.slice(0, 2) // First 2 banners (1, 2)
  ];

  const [currentIndex, setCurrentIndex] = useState(2); // Start at index 2 (first real banner 1)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide effect - always moving forward
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Handle infinite loop - smooth forward movement
  useEffect(() => {
    // When we reach the end (after the duplicate section)
    if (currentIndex >= banners.length + 2) {
      // Reset to the beginning of the real section
      setTimeout(() => {
        const sliderTrack = document.querySelector('.slider-track');
        if (sliderTrack) {
          sliderTrack.style.transition = 'none';
          setCurrentIndex(2); // Go back to first real banner (index 2)
          setTimeout(() => {
            if (sliderTrack) {
              sliderTrack.style.transition = 'transform 0.7s ease-in-out';
            }
          }, 50);
        }
      }, 50);
    }
  }, [currentIndex]);

  // Handle manual navigation
  const goToSlide = (slideIndex) => {
    // Map real index (0-4) to extended array index
    const targetIndex = slideIndex + 2; // +2 because of the 2 duplicate items at start
    setCurrentIndex(targetIndex);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Get current banner for indicators
  const getCurrentBannerIndex = () => {
    // Map current index to real banner index (0-4)
    if (currentIndex < 2) {
      // If we're in the initial duplicate section
      return currentIndex + banners.length - 2;
    } else if (currentIndex >= banners.length + 2) {
      // If we're in the final duplicate section
      return currentIndex - banners.length - 2;
    }
    // Normal section
    return currentIndex - 2;
  };

  return (
    <div className="relative px-4 py-4 md:px-8">
      {/* Slider Container */}
      <div className="relative overflow-hidden rounded-xl">
        {/* Slides */}
        <div
          className="slider-track flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {extendedBanners.map((banner, index) => (
            <div key={`${banner.id}-${index}`} className="min-w-full">
              <BannerItem banner={banner} />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300 z-10"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300 z-10"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Dots/Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === getCurrentBannerIndex()
                  ? "w-6 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full z-10">
          {getCurrentBannerIndex() + 1} / {banners.length}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;