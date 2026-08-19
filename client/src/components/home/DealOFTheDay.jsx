import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBolt } from "@fortawesome/free-solid-svg-icons";

const deals = [
  {
    id: "d1",
    name: "Shampoo, Conditioner & Facewash Pack",
    description:
      "A complete daily care set — gentle on hair, kind to skin, made for everyday use.",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
    price: 150,
    oldPrice: 200,
    sold: 20,
    available: 40,
    endsAt: Date.now() + 1000 * 60 * 60 * 27,
  },
  {
    id: "d2",
    name: "Rose Gold Diamond Earrings",
    description:
      "Hand-set stones in a rose gold finish — a small piece that carries a lot of shine.",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    price: 1990,
    oldPrice: 2200,
    sold: 15,
    available: 40,
    endsAt: Date.now() + 1000 * 60 * 60 * 51,
  },
];

function useCountdown(endsAt) {
  const [timeLeft, setTimeLeft] = useState(endsAt - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(Math.max(endsAt - Date.now(), 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return { days, hours, minutes, seconds, expired: timeLeft <= 0 };
}

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

function DealCard({ deal }) {
  const { name, description, image, price, oldPrice, sold, available } = deal;
  const { days, hours, minutes, seconds, expired } = useCountdown(deal.endsAt);
  const soldPercent = Math.min((sold / (sold + available)) * 100, 100);

  return (
    <div className="bg-white rounded-lg sm:rounded-2xl border border-[#E4DDCE] overflow-hidden flex flex-col sm:flex-row transition-all hover:shadow-md">
      {/* Image Container */}
      <div className="w-full sm:w-44 lg:w-48 h-32 sm:h-auto bg-[#F4F1EA] flex items-center justify-center p-1 sm:p-2 shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain sm:object-cover rounded-lg sm:rounded-none"
        />
      </div>

      {/* Content Container */}
      <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm sm:text-lg md:text-xl text-[#16241F] font-semibold leading-snug line-clamp-1 sm:line-clamp-2">
            {name}
          </h3>
          <p className="hidden sm:block text-sm md:text-base text-[#16241F]/50 mt-1 sm:mt-2 leading-relaxed line-clamp-2">
            {description}
          </p>

          <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1.5 sm:mt-3">
            <span className="text-lg sm:text-2xl md:text-3xl text-[#16241F] font-semibold">
              ৳{price}
            </span>
            <span className="text-xs sm:text-base text-[#16241F]/35 line-through">
              ৳{oldPrice}
            </span>
          </div>

          {/* Stock progress */}
          <div className="mt-2 sm:mt-4">
            <div className="flex justify-between text-xs sm:text-sm text-[#16241F]/50 mb-1 sm:mb-1.5">
              <span>
                Sold: <b className="text-[#16241F]">{sold}</b>
              </span>
              <span>
                Available: <b className="text-[#16241F]">{available}</b>
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
              <FontAwesomeIcon icon={faBolt} className="text-[#B08946] text-xs sm:text-sm" />
              {expired ? "Ended" : "Ends in"}
            </p>
            {!expired && (
              <div className="flex gap-1.5 sm:gap-2.5">
                <TimeBox value={days} label="Days" />
                <TimeBox value={hours} label="Hrs" />
                <TimeBox value={minutes} label="Min" />
                <TimeBox value={seconds} label="Sec" />
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={expired}
          className="mt-3 sm:mt-6 w-full sm:w-auto self-start flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-md sm:rounded-lg bg-[#16241F] hover:bg-[#0F1A16] disabled:bg-[#16241F]/30 disabled:cursor-not-allowed text-[#FAF6EF] text-sm sm:text-base font-medium transition"
        >
          <FontAwesomeIcon icon={faShoppingCart} className="text-xs sm:text-sm" />
          Add to cart
        </button>
      </div>
    </div>
  );
}

const DealOfTheDay = () => {
  return (
    <section className="max-w-7xl mx-auto ">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-3 sm:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-[#16241F]">
            Deal of the Day
          </h2>
          <span className="text-sm sm:text-base text-[#16241F]/40">
            {deals.length} deals
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-6">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealOfTheDay;
