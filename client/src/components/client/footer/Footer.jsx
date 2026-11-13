import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPhone,
  faLocationDot,
  faPaperPlane,
  faShieldHalved,
  faTruck,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useTranslation } from "../../../utils/translations";

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setEmail("");
  };
  const socialIcons = [
    {
      label: "Facebook",
      icon: faFacebookF,
      href: "https://www.facebook.com/shimul.mia.79462",
    },
    {
      label: "LinkedIn",
      icon: faLinkedin,
      href: "https://www.linkedin.com/in/md-shimul-71a4b3319/",
    },
    {
      label: "GitHub",
      icon: faGithub,
      href: "https://github.com/Shimul-DIU",
    },
  ];
  const columns = [
    {
      title: "Shop",
      links: [
        { label: "New Arrivals", to: "/products?category=new-arrival" },
        { label: "Best Sellers", to: "/products?category=best-sellers" },
        { label: "Men", to: "/men" },
        { label: "Women", to: "/women" },
        { label: "Jewellery", to: "/products?category=jewellery" },
        { label: "Fishing", to: "/fishing" },
        { label: "Sale", to: "/offers" },
      ],
    },
    {
      title: "Customer Care",
      links: [
        { label: "Track Order", to: "/userDashboard/user-orders" },
        { label: "Shipping Info", to: "/contact#faq-shipping" },
        { label: "Returns & Exchanges", to: "/contact#faq-returns" },
        { label: "Size Guide", to: "/contact#contact-form" },
        { label: "FAQs", to: "/contact#faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", to: "/about" },
        { label: "Contact Us", to: "/contact" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-slate-950 text-slate-300">
      {/* Trust strip */}
      <div className="border-b border-slate-800">
        <div className="w-full max-w-none mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faTruck} className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">{t("Free Shipping")}</p>
              <p className="text-xs text-slate-400">{t("On orders over ৳2,000")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faRotateLeft} className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">{t("Easy Returns")}</p>
              <p className="text-xs text-slate-400">{t("7-day return policy")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faShieldHalved} className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">{t("Secure Payment")}</p>
              <p className="text-xs text-slate-400">{t("100% protected checkout")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="w-full max-w-none mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand + newsletter */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Shimul<span className="text-amber-400">shop</span>
          </h2>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-xs">
            {t("Quality products, honest prices, and fast delivery across Bangladesh. Shop with confidence.")}
          </p>

          <form onSubmit={handleSubscribe} className="mt-6 max-w-sm">
            <p className="text-sm font-medium text-white mb-2">
              {t("Subscribe for offers & updates")}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("Enter your email")}
                className="flex-1 min-w-0 rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="shrink-0 rounded-md bg-amber-400 hover:bg-amber-300 transition-colors px-3 py-2 text-slate-900 font-semibold flex items-center gap-1 text-sm"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
              </button>
            </div>
            {submitted && (
              <p className="mt-2 text-xs text-amber-400">
                {t("Thanks! Please check your inbox to confirm.")}
              </p>
            )}
          </form>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {t(col.title)}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {t(label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact + socials */}
      <div className="w-full max-w-none mx-auto px-6 py-6 border-t border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-slate-400">
          <a href="tel:+8801922773703" className="flex items-center gap-2 hover:text-amber-400">
            <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-amber-400" />
            +880 1922773703
          </a>
          <a href="mailto:shimuldiu7@gmail.com" className="flex items-center gap-2 hover:text-amber-400">
            <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-amber-400" />
            shimuldiu7@gmail.com
          </a>
          <span className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 text-amber-400" /> Dhaka, Bangladesh
          </span>
        </div>

        <div className="flex items-center gap-4">
          {socialIcons.map(({ label, icon, href }) => (
            <a
              href={href}
              key={label}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-amber-400 hover:text-slate-900 text-slate-300 transition-colors"
            >
              <FontAwesomeIcon icon={icon} className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="w-full max-w-none mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Shimul_shop. {t("All rights reserved.")}
          </p>
        </div>
      </div>
    </footer>
  );
}
