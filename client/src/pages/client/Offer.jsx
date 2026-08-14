import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const API_BASE = import.meta.env?.VITE_API_URL || "/api";

const FILTERS = [
  { key: "all", label: "All Offers" },
  { key: "percentage", label: "% Discounts" },
  { key: "flat", label: "Flat Cashback" },
  { key: "code", label: "Coupon Codes" },
];

function daysLeft(endDate) {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days === 1) return "Ends today";
  return `${days} days left`;
}

// Small deterministic tilt per card so the row feels hand-laid, not uniform
function tiltFor(id) {
  const n = String(id)
    .split("")
    .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return (n % 5) - 2; // -2 .. 2 degrees
}

function OfferTicketCard({ offer }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!offer.code) return;
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard may be unavailable — fail silently, code is still visible
    }
  };

  return (
    <div
      className="group mt-[80px] flex overflow-hidden rounded-xl border border-black/10 bg-linear-to-r from-cyan-300 via-blue-200 to-blue-500 text-black shadow-[0_10px_28px_-14px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_16px_36px_-14px_rgba(0,0,0,0.4)] max-[480px]:flex-col"
      style={{ transform: `rotate(${tiltFor(offer._id)}deg)` }}
    >
      {/* stub */}
      <div className="flex min-w-[108px] flex-col items-center justify-center gap-1 bg-black px-2 py-5 text-center text-white max-[480px]:w-full max-[480px]:flex-row max-[480px]:gap-3 max-[480px]:px-4 max-[480px]:py-3">
        <span className="font-['Anton'] text-3xl leading-none">
          {offer.discountType === "percentage" ? `${offer.discountValue}%` : `৳${offer.discountValue}`}
        </span>
        <span className="font-['IBM_Plex_Mono'] text-[0.65rem] tracking-[0.15em] text-[#e8a33d] uppercase">
          OFF
        </span>
      </div>

      {/* perforation */}
      <div className="relative w-0 border-l-2 border-dashed border-black/20 max-[480px]:hidden">
        <span className="absolute -left-[7px] -top-[7px] h-3.5 w-3.5 rounded-full bg-white ring-1 ring-black/10" />
        <span className="absolute -left-[7px] -bottom-[7px] h-3.5 w-3.5 rounded-full bg-white ring-1 ring-black/10" />
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <p className="text-sm font-bold leading-snug">{offer.title}</p>
          {offer.description && (
            <p className="mt-1 text-[0.82rem] leading-relaxed text-black/60">{offer.description}</p>
          )}
        </div>

        <p className="font-['IBM_Plex_Mono'] text-[0.7rem] text-black/50">
          {offer.minOrderAmount > 0 ? `Min. order ৳${offer.minOrderAmount} · ` : ""}
          {daysLeft(offer.endDate)}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2">
          {offer.code ? (
            <>
              <span className="rounded-md border-[1.5px] border-dashed border-black px-2.5 py-1 font-['IBM_Plex_Mono'] text-sm font-semibold tracking-wide">
                {offer.code}
              </span>
              <button
                onClick={handleCopy}
                aria-label={`Copy coupon code ${offer.code}`}
                className={`rounded-md px-3 py-1.5 font-['IBM_Plex_Mono'] text-[0.72rem] uppercase tracking-wide text-white transition-transform active:scale-95 ${
                  copied ? "bg-black" : "bg-[#c1392b] hover:bg-[#a52f22]"
                }`}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </>
          ) : (
            <span className="font-['IBM_Plex_Mono'] text-[0.7rem] text-black/50">
              Applied automatically at checkout
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Offer() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    axios
      .get(`${API_BASE}/offers`, { params: { active: true } })
      .then((res) => {
        if (mounted) setOffers(res.data.offers);
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || "Failed to load offers");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredOffers = useMemo(() => {
    switch (filter) {
      case "percentage":
        return offers.filter((o) => o.discountType === "percentage");
      case "flat":
        return offers.filter((o) => o.discountType === "flat");
      case "code":
        return offers.filter((o) => !!o.code);
      default:
        return offers;
    }
  }, [offers, filter]);

  return (
    <div className="min-h-screen mt-[80px]  font-['Work_Sans',sans-serif] text-black">
      {/* Only needed if these fonts aren't already loaded globally in index.html */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Anton&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');`}</style>

      <section className="relative bg-[#F7E1AA] overflow-hidden border-b border-black/10 px-6 pb-16 pt-16 text-center">
        <p className="mb-4 font-['IBM_Plex_Mono'] text-xs uppercase tracking-[0.35em] text-[#c1392b]">
          Serial No. {new Date().getFullYear()}·OFFERS
        </p>
        <h1 className="font-['Anton'] text-2xl uppercase leading-[0.95] text-black sm:text-3xl">
          Tear off{" "}
          <em className="inline-block -rotate-3 not-italic text-[#c1392b]">your</em> discount
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-black/60">
          Every active coupon and deal on the store, laid out like the ticket stubs they really
          are. Copy a code, take it to checkout.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-2.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-4 py-2 font-['IBM_Plex_Mono'] text-[0.78rem] uppercase tracking-wide transition-colors ${
                filter === f.key
                  ? "border-black bg-black font-semibold text-white"
                  : "border-black/20 text-black/60 hover:border-black hover:text-black"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {loading && (
        <div className="mx-auto my-12 max-w-md rounded-xl border border-dashed border-black/20 p-8 text-center text-black/50">
          <p className="mb-2 font-['Anton'] text-2xl uppercase text-black">Printing tickets…</p>
          <p>Loading the latest offers.</p>
        </div>
      )}

      {!loading && error && (
        <div className="mx-auto my-12 max-w-md rounded-xl border border-dashed border-black/20 p-8 text-center text-black/50">
          <p className="mb-2 font-['Anton'] text-2xl uppercase text-black">Couldn't load offers</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && filteredOffers.length === 0 && (
        <div className="mx-auto my-12 max-w-md rounded-xl border border-dashed border-black/20 p-8 text-center text-black/50">
          <p className="mb-2 font-['Anton'] text-2xl uppercase text-black">No offers here right now</p>
          <p>Check back soon, or try a different filter above.</p>
        </div>
      )}

      {!loading && !error && filteredOffers.length > 0 && (
        <div className="mx-auto grid max-w-6xl grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-7 px-6 pb-20">
          {filteredOffers.map((offer) => (
            <OfferTicketCard key={offer._id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}
