import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faPercent, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "../../utils/translations";

// এখানে নিজের আসল offer, লেখা ও ছবি বসান
const promos = [
  {
    id: 1,
    icon: faTruck,
    tag: "FREE DELIVERY",
    title: "Free Delivery Over ৳2000",
    subtitle: "Order more, save more. Get your favourite products delivered to your door.",
    btnText: "Shop Now",
    btnLink: "/products",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=900&auto=format&fit=crop",
    dark: true,
  },
  {
    id: 2,
    icon: faPercent,
    tag: "SPECIAL OFFER",
    title: "Up To 50% Off On Selected Items",
    subtitle: "Grab the best deals on perfume, jewellery, bags and more before they are gone.",
    btnText: "View Deals",
    btnLink: "/products?category=deal",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=900&auto=format&fit=crop",
    dark: false,
  },
];

const PromoBanners = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full px-2 sm:px-4 md:px-8 mt-8 sm:mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className={`group relative overflow-hidden rounded-2xl shadow-lg border min-h-[180px] sm:min-h-[220px] ${
              promo.dark
                ? "bg-[#16241F] border-[#16241F]"
                : "bg-[#FAF6EF] border-[#E4DDCE]"
            }`}
          >
            {/* Background image (ডান দিকে, ঝাপসা) */}
            <div
              className="absolute inset-y-0 right-0 w-1/2 bg-cover bg-center opacity-30 sm:opacity-40 transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${promo.image})` }}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-r ${
                promo.dark
                  ? "from-[#16241F] via-[#16241F]/90 to-transparent"
                  : "from-[#FAF6EF] via-[#FAF6EF]/90 to-transparent"
              }`}
            />

            {/* Decoration */}
            <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-[#B08946]/15 blur-2xl pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center h-full p-5 sm:p-8 max-w-[75%] sm:max-w-[65%]">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#B08946] text-white flex items-center justify-center text-xs sm:text-sm shadow-md">
                  <FontAwesomeIcon icon={promo.icon} />
                </span>
                <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] text-[#B08946] uppercase">
                  {t(promo.tag)}
                </span>
              </div>

              <h3
                className={`text-lg sm:text-2xl lg:text-3xl font-extrabold leading-tight mb-1.5 sm:mb-2 ${
                  promo.dark ? "text-white" : "text-[#16241F]"
                }`}
              >
                {t(promo.title)}
              </h3>

              <p
                className={`text-xs sm:text-sm font-medium mb-4 sm:mb-5 line-clamp-2 ${
                  promo.dark ? "text-white/70" : "text-[#16241F]/70"
                }`}
              >
                {t(promo.subtitle)}
              </p>

              <div>
                <Link
                  to={promo.btnLink}
                  className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-md transition-all duration-300 hover:scale-105 active:scale-95 ${
                    promo.dark
                      ? "bg-[#B08946] text-white hover:bg-[#c29a52]"
                      : "bg-[#16241F] text-white hover:bg-[#0F1A16]"
                  }`}
                >
                  <span>{t(promo.btnText)}</span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-[10px] transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromoBanners;