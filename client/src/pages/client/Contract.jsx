import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faClock,
  faPaperPlane,
  faChevronDown,
  faCircleCheck,
  faHeadset,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "../../utils/translations";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200";

const Contact = () => {
  const { t } = useTranslation();
  const { hash } = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [openFaq, setOpenFaq] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [hash]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    setError("");

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "Not provided",
          subject: formData.subject || "No subject",
          message: formData.message,
          time: new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" }),
        },
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      );

      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      console.error("Email send failed:", err);
      setError("Something went wrong. Please try again or contact us by phone.");
    } finally {
      setIsSending(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      id: "shipping",
      q: "How long does delivery take?",
      a: "Inside Dhaka, delivery takes 24–48 hours. Outside Dhaka, it takes 2–3 business days.",
    },
    {
      id: "returns",
      q: "Can I return a product if I don't like it?",
      a: "Yes! You can return or exchange items within 7 days according to our return policy.",
    },
    {
      id: "payment",
      q: "What payment methods do you accept?",
      a: "We accept Cash on Delivery, Mobile Banking (bKash, Nagad, Rocket), and all major Debit/Credit cards.",
    },
  ];

  const infoCards = [
    {
      icon: faPhone,
      title: "Phone Support",
      lines: [
        { text: "+880 1922773703", href: "tel:+8801922773703" },
        { text: "+880 1540184685", href: "tel:+8801540184685" },
      ],
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: faEnvelope,
      title: "Email Us",
      lines: [
        {
          text: "md.shimulstore@gmail.com",
          href: "mailto:md.shimulstore@gmail.com",
        },
        {
          text: "md.shimuldiu7@gmail.com",
          href: "mailto:md.shimuldiu7@gmail.com",
        },
      ],
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: faMapMarkerAlt,
      title: "Showroom / Office",
      lines: [{ text: "GM Bari, North Badda, Dhaka, Bangladesh" }],
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: faClock,
      title: "Working Hours",
      lines: [{ text: "Saturday - Thursday" }, { text: "9:00 AM - 10:00 PM" }],
      color: "from-purple-500 to-fuchsia-600",
    },
  ];

  const socials = [
    { icon: faFacebookF, label: "Facebook", href: "https://www.facebook.com", hover: "hover:bg-blue-600" },
    { icon: faInstagram, label: "Instagram", href: "#", hover: "hover:bg-pink-600" },
    { icon: faTwitter, label: "Twitter", href: "#", hover: "hover:bg-sky-500" },
    { icon: faWhatsapp, label: "WhatsApp", href: "https://wa.me/8801922773703", hover: "hover:bg-emerald-600" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 pt-32 pb-40 px-4 sm:px-6 lg:px-8">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur text-white text-xs font-medium tracking-wide border border-white/20">
            <FontAwesomeIcon icon={faHeadset} />
            {t("We're here to help")}
          </span>
          <h1 className="mt-5 text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t("Get in Touch With Us")}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-blue-100 leading-relaxed">
            {t(
              "Have a question or feedback? Our team is here to assist you every step of the way."
            )}
          </p>
        </div>
      </section>

      <div className="relative -mt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* ================= INFO CARDS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {infoCards.map((card) => (
              <div
                key={card.title}
                className="group bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  <FontAwesomeIcon icon={card.icon} />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 text-base">
                  {t(card.title)}
                </h3>
                <div className="mt-2 space-y-1">
                  {card.lines.map((line) =>
                    line.href ? (
                      <a
                        key={line.text}
                        href={line.href}
                        className="block text-sm text-slate-600 hover:text-blue-600 transition-colors break-all"
                      >
                        {line.text}
                      </a>
                    ) : (
                      <p key={line.text} className="text-sm text-slate-600">
                        {t(line.text)}
                      </p>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ================= FORM & MAP ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
            {/* Contact Form */}
            <div
              id="contact-form"
              className="lg:col-span-7 scroll-mt-40 bg-white p-6 sm:p-10 rounded-3xl shadow-lg shadow-slate-200/60 border border-slate-100"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {t("Send Us a Message")}
              </h2>
              <p className="text-slate-500 text-sm mt-2 mb-8">
                {t(
                  "Fill out the form below and our team will get back to you as soon as possible."
                )}
              </p>

              {isSubmitted && (
                <div className="mb-6 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm">
                  <FontAwesomeIcon icon={faCircleCheck} className="mt-0.5 text-lg" />
                  <p>
                    {t(
                      "Thank you! Your message has been sent successfully. We will contact you shortly."
                    )}
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      {t("Your Name *")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("Enter your full name")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      {t("Email Address *")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@mail.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      {t("Phone Number")}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880 1700-000000"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      {t("Subject")}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t("e.g. Order Inquiry")}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t("Message *")}
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("Write your message or inquiry here...")}
                    className={`${inputClass} resize-none`}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="group w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>{isSending ? t("Sending...") : t("Send Message")}</span>
                  <FontAwesomeIcon
                    icon={isSending ? faSpinner : faPaperPlane}
                    spin={isSending}
                    className="text-xs"
                  />
                </button>
              </form>
            </div>

            {/* Map & Social */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="relative bg-white p-2 rounded-3xl shadow-lg shadow-slate-200/60 border border-slate-100 flex-1 min-h-[320px] overflow-hidden">
                <iframe
                  title={t("Google Map Location")}
                  src="https://www.google.com/maps?q=North+Badda,+Dhaka,+Bangladesh&output=embed"
                  className="w-full h-full min-h-[320px] rounded-2xl border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur rounded-xl px-4 py-3 shadow flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">
                    GM Bari, North Badda, Dhaka
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl shadow-lg">
                <h3 className="font-semibold text-white mb-1 text-base">
                  {t("Follow Us on Social Media")}
                </h3>
                <p className="text-slate-400 text-xs mb-4">
                  {t("Stay updated with our latest offers and news.")}
                </p>
                <div className="flex gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className={`w-11 h-11 bg-white/10 ${s.hover} hover:-translate-y-1 text-white rounded-xl flex items-center justify-center transition-all duration-300`}
                    >
                      <FontAwesomeIcon icon={s.icon} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ================= FAQ ================= */}
          <div id="faq" className="max-w-3xl mx-auto scroll-mt-40">
            <div className="text-center mb-8">
              <span className="text-xs font-semibold text-blue-600 tracking-widest uppercase">
                FAQ
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
                {t("Frequently Asked Questions")}
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={faq.id}
                    id={`faq-${faq.id}`}
                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "border-blue-200 shadow-md shadow-blue-100"
                        : "border-slate-100 shadow-sm"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-medium text-slate-800 text-sm sm:text-base focus:outline-none"
                    >
                      <span>{t(faq.q)}</span>
                      <span
                        className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isOpen
                            ? "bg-blue-600 text-white rotate-180"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-5 text-sm text-slate-600 leading-relaxed">
                          {t(faq.a)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;