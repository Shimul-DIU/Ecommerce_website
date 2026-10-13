import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBolt } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../utils/axiosInstance"; // path নিজের মতো ঠিক করো

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
// TIME BOX
// ============================================================
function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-md sm:rounded-lg bg-[#16241F] text-[#FAF6EF] flex items-center justify-center text-xs sm:text-base font-semibold">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[10px] sm:text-xs text-[#16241F]/45 mt-1 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

// ============================================================
// DEAL CARD
// ============================================================
function DealCard({ deal }) {
  const { name, description, price, oldPrice, sold = 0, stock = 0 } = deal;
  const image = getImageUrl(deal.image);

  // ছবির আসল aspect ratio (load হওয়ার পর সেট হবে)
  const [ratio, setRatio] = useState(1);

  const { days, hours, minutes, seconds, expired } = useCountdown(
    new Date(deal.dealEndsAt).getTime()
  );

  const total = sold + stock;
  const soldPercent = total > 0 ? Math.min((sold / total) * 100, 100) : 0;
  const outOfStock = stock <= 0;

  return (
    <div className="bg-white rounded-lg sm:rounded-2xl border border-[#E4DDCE] overflow-hidden flex flex-col sm:flex-row sm:items-stretch transition-all hover:shadow-md">
      {/* Image: mobile এ উপরে full width, sm+ এ বাঁ দিকে ছবির ratio অনুযায়ী */}
      <div
        className="relative w-full bg-[#d0ceca] sm:bg-transparent sm:w-auto sm:shrink-0 sm:self-stretch sm:min-h-[200px] sm:max-w-[55%] sm:[aspect-ratio:var(--ratio)]"
        style={{ "--ratio": ratio }}
      >
        <img
          src={image}
          alt={name}
          onLoad={(e) => {
            const { naturalWidth, naturalHeight } = e.currentTarget;
            if (naturalWidth && naturalHeight) {
              setRatio(naturalWidth / naturalHeight);
            }
          }}
          className="block w-full h-auto max-h-72 object-contain sm:absolute sm:inset-0 sm:h-full sm:max-h-none"
        />
      </div>

      {/* Content: mobile এ ছবির নিচে, sm+ এ ডান পাশে বাকি জায়গা */}
      <div className="p-2.5 sm:p-5 w-full sm:w-auto sm:flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="text-sm sm:text-lg md:text-xl text-[#16241F] font-semibold leading-snug line-clamp-1 sm:line-clamp-2">
            {name}
          </h3>

          {description && (
            <p className="hidden sm:block text-sm md:text-base text-[#16241F]/50 mt-1 sm:mt-2 leading-relaxed line-clamp-2">
              {description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1.5 sm:mt-3">
            <span className="text-lg sm:text-2xl md:text-3xl text-[#16241F] font-semibold">
              ৳{price}
            </span>
            {oldPrice > price && (
              <span className="text-xs sm:text-base text-[#16241F]/35 line-through">
                ৳{oldPrice}
              </span>
            )}
          </div>

          {/* Stock progress */}
          <div className="mt-2 sm:mt-4">
            <div className="flex justify-between text-xs sm:text-sm text-[#16241F]/50 mb-1 sm:mb-1.5">
              <span>
                Sold: <b className="text-[#16241F]">{sold}</b>
              </span>
              <span>
                Available: <b className="text-[#16241F]">{stock}</b>
              </span>
            </div>
            <div className="h-1 sm:h-1.5 w-full rounded-full bg-[#EFE9DC] overflow-hidden">
              <div
                className="h-full bg-[#B08946] rounded-full transition-all duration-300"
                style={{ width: `${soldPercent}%` }}
              />
            </div>
          </div>

          {/* Countdown */}
          <div className="mt-2.5 sm:mt-5">
            <p className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#16241F]/60 mb-1.5 sm:mb-2">
              <FontAwesomeIcon
                icon={faBolt}
                className="text-[#B08946] text-xs sm:text-sm"
              />
              {expired ? "Ended" : "Ends in"}
            </p>

            {!expired && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
                <TimeBox value={days} label="Days" />
                <TimeBox value={hours} label="Hrs" />
                <TimeBox value={minutes} label="Min" />
                <TimeBox value={seconds} label="Sec" />
              </div>
            )}
          </div>
        </div>

        {/* Action */}
        <button
          disabled={expired || outOfStock}
          className="mt-3 sm:mt-6 w-full sm:w-auto self-start flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-md sm:rounded-lg bg-[#16241F] hover:bg-[#0F1A16] disabled:bg-[#16241F]/30 disabled:cursor-not-allowed text-[#FAF6EF] text-sm sm:text-base font-medium transition"
        >
          <FontAwesomeIcon icon={faShoppingCart} className="text-xs sm:text-sm" />
          {outOfStock ? "Out of stock" : "Add to cart"}
        </button>
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

    <section className="w-full  py-6 px-3 sm:py-10 sm:px-6">
      <div className="w-full mx-auto">
        <div className="flex items-baseline justify-between mb-3 sm:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-[#16241F]">
            Deal of the Day
          </h2>
          <span className="text-sm sm:text-base text-[#16241F]/40">
            {deals.length} deals
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:gap-6">
          {deals.map((deal) => (
            <DealCard key={deal._id} deal={deal} />
          ))}
        </div>
      </div>
    </section>

  );
};

export default DealOfTheDay;