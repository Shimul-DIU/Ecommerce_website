import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faBolt,
  faFire,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../utils/axiosInstance"; // path নিজের মতো ঠিক করো
import { CountContext } from "../../context/CountContext"; // path নিজের মতো ঠিক করো

// ============================================================
// IMAGE URL
// ============================================================
const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img; // Cloudinary বা full URL

  const base = (axiosInstance.defaults.baseURL || "")
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

  const path = img.replace(/\\/g, "/");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
};

// ============================================================
// COUNTDOWN HOOK
// ============================================================
function useCountdown(endsAt) {
  const [timeLeft, setTimeLeft] = useState(Math.max(endsAt - Date.now(), 0));

  useEffect(() => {
    const tick = () => setTimeLeft(Math.max(endsAt - Date.now(), 0));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return { days, hours, minutes, seconds, expired: timeLeft <= 0 };
}

// ============================================================
// TIME BOX (গোল্ড বর্ডারের কাচের মতো বক্স)
// ============================================================
function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-11 h-12 sm:w-14 sm:h-16 rounded-xl bg-white/5 border border-[#B08946]/40 backdrop-blur-sm flex items-center justify-center text-lg sm:text-2xl font-bold text-[#FAF6EF] tabular-nums shadow-inner">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#B08946]">
        {label}
      </span>
    </div>
  );
}

const Colon = () => (
  <span className="pb-5 text-lg sm:text-2xl font-bold text-[#B08946]/60 animate-pulse">
    :
  </span>
);

// ============================================================
// DEAL CARD
// ============================================================
function DealCard({ deal }) {
  const { name, description, price, oldPrice, sold = 0, stock = 0 } = deal;
  const image = getImageUrl(deal.image);

  const navigate = useNavigate();
  const { cart, toggleCart } = useContext(CountContext);

  const { days, hours, minutes, seconds, expired } = useCountdown(
    new Date(deal.dealEndsAt).getTime()
  );

  const total = sold + stock;
  const soldPercent = total > 0 ? Math.min((sold / total) * 100, 100) : 0;
  const outOfStock = stock <= 0;
  const unavailable = expired || outOfStock;
  const inCart = cart.includes(deal._id);

  const hasDiscount = oldPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;
  const savings = hasDiscount ? oldPrice - price : 0;

  // Add to cart বাটন: না থাকলে যোগ হবে, থাকলে remove হবে
  const handleToggleCart = () => {
    if (!inCart && unavailable) return;
    toggleCart(deal._id);
  };

  // ছবি বা Buy Now ক্লিক: cart এ না থাকলে যোগ করে checkout এ product সহ নিয়ে যাবে
  const handleBuyNow = () => {
    if (unavailable) return;
    if (!inCart) toggleCart(deal._id);

    navigate("/checkout", {
      state: {
        product: {
          _id: deal._id,
          name,
          price,
          originalPrice: oldPrice, // Checkout এ এই নামে পড়া হয়
          stock,
          image,
          quantity: 1,
        },
      },
    });
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#16241F] border border-[#B08946]/30 shadow-lg flex flex-col sm:flex-row transition-shadow duration-300 hover:shadow-2xl">
      {/* ডেকোরেটিভ গোল্ড সার্কেল */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#B08946]/10" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 w-56 h-56 rounded-full bg-[#B08946]/5" />

      {/* ============ IMAGE PANEL ============ */}
      <div
        onClick={handleBuyNow}
        className={`relative sm:w-[40%] lg:w-[36%] shrink-0 aspect-[4/3] sm:aspect-auto sm:min-h-[320px] bg-[radial-gradient(circle_at_50%_40%,#FFFFFF_0%,#FAF6EF_55%,#E4DDCE_100%)] flex items-center justify-center p-5 sm:p-8 ${
          unavailable ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {/* ছবির পেছনে হালকা রিং */}
        <div className="absolute w-3/4 aspect-square rounded-full border border-dashed border-[#B08946]/40" />

        <img
          src={image}
          alt={name}
          className={`relative z-10 max-h-full max-w-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2 ${
            unavailable ? "grayscale opacity-70" : ""
          }`}
        />

        {/* Discount ব্যাজ (গোল সিল) */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#B08946] text-[#16241F] flex flex-col items-center justify-center rotate-[-10deg] shadow-lg ring-4 ring-[#FAF6EF]">
            <span className="text-base sm:text-lg font-extrabold leading-none">
              {discountPercent}%
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-widest">
              OFF
            </span>
          </div>
        )}

        {/* Ended ওভারলে */}
        {unavailable && (
          <div className="absolute inset-0 z-20 bg-[#16241F]/55 flex items-center justify-center">
            <span className="rotate-[-8deg] border-2 border-white/80 text-white text-sm sm:text-base font-extrabold uppercase tracking-[0.2em] px-4 py-1.5 rounded-md">
              {expired ? "Deal Ended" : "Sold Out"}
            </span>
          </div>
        )}
      </div>

      {/* ============ CONTENT ============ */}
      <div className="relative z-10 flex-1 min-w-0 p-4 sm:p-7 flex flex-col justify-between gap-4 sm:gap-5">
        <div>
          {/* Tag */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#B08946]/15 border border-[#B08946]/40 text-[#B08946] text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] px-3 py-1">
            <FontAwesomeIcon icon={faBolt} className="text-[10px]" />
            Flash Deal
          </span>

          <h3 className="mt-3 text-lg sm:text-2xl md:text-3xl font-semibold text-[#FAF6EF] leading-snug line-clamp-2">
            {name}
          </h3>

          {description && (
            <p className="hidden sm:block mt-2 text-sm md:text-base text-[#FAF6EF]/55 leading-relaxed line-clamp-2">
              {description}
            </p>
          )}

          {/* Price */}
          <div className="mt-3 sm:mt-4 flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="text-3xl sm:text-5xl font-extrabold text-[#B08946] leading-none">
              ৳{price}
            </span>
            {hasDiscount && (
              <span className="text-sm sm:text-lg text-[#FAF6EF]/35 line-through pb-0.5">
                ৳{oldPrice}
              </span>
            )}
            {savings > 0 && (
              <span className="mb-0.5 text-[11px] sm:text-xs font-bold text-green-300 bg-green-400/10 border border-green-400/30 px-2 py-0.5 rounded-full">
                Save ৳{savings}
              </span>
            )}
          </div>

          {/* Stock progress */}
          <div className="mt-4 sm:mt-5">
            <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
              <span className="flex items-center gap-1.5 text-[#FAF6EF]/70">
                <FontAwesomeIcon
                  icon={faFire}
                  className="text-orange-400 text-xs"
                />
                <b className="text-[#FAF6EF]">{Math.round(soldPercent)}%</b>{" "}
                sold
              </span>
              <span className="text-[#FAF6EF]/50">
                মাত্র <b className="text-[#B08946]">{stock}</b> টি বাকি
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#B08946] to-[#E8C77F] transition-all duration-500"
                style={{ width: `${soldPercent}%` }}
              />
            </div>
          </div>

          {/* Countdown */}
          <div className="mt-4 sm:mt-5">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#FAF6EF]/50 mb-2">
              {expired ? "Deal ended" : "Offer ends in"}
            </p>

            {!expired && (
              <div className="flex items-start gap-1.5 sm:gap-2.5">
                <TimeBox value={days} label="Days" />
                <Colon />
                <TimeBox value={hours} label="Hrs" />
                <Colon />
                <TimeBox value={minutes} label="Min" />
                <Colon />
                <TimeBox value={seconds} label="Sec" />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <button
            onClick={handleBuyNow}
            disabled={unavailable}
            className="flex-1 sm:flex-none sm:min-w-[160px] flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-[#B08946] hover:bg-[#C49A52] active:scale-[0.98] text-[#16241F] text-sm sm:text-base font-bold shadow-md transition disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed"
          >
            <span>Buy Now</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>

          <button
            onClick={handleToggleCart}
            disabled={!inCart && unavailable}
            className={`flex-1 sm:flex-none sm:min-w-[170px] flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base font-semibold active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed ${
              inCart
                ? "bg-[#FAF6EF] text-[#16241F] border-[#FAF6EF]"
                : "bg-transparent text-[#FAF6EF] border-[#FAF6EF]/30 hover:border-[#B08946] hover:text-[#B08946]"
            }`}
          >
            <FontAwesomeIcon icon={faShoppingCart} className="text-xs sm:text-sm" />
            {inCart
              ? "Remove from cart"
              : unavailable
                ? "Out of stock"
                : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DEAL OF THE DAY (dynamic)
// ============================================================
const DealOfTheDay = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await axiosInstance.get("/api/products/deals");
        const list = res.data?.data;
        setDeals(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Deals load error:", err);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // load হওয়া পর্যন্ত বা deal না থাকলে section দেখাবে না
  if (loading || deals.length === 0) return null;

  return (
    <section className="w-full py-6 px-3 sm:py-10 sm:px-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div className="flex items-center gap-3">
            <span className="hidden sm:block h-8 w-1 rounded-full bg-[#B08946]" />
            <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-[#16241F]">
              Deal of the Day
            </h2>
            <span className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              Live
            </span>
          </div>

          <span className="text-sm sm:text-base text-[#16241F]/40">
            {deals.length} deals
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {deals.map((deal) => (
            <DealCard key={deal._id} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealOfTheDay;