import { useContext, useState } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import axiosInstance from "../../utils/axiosInstance";

const translations = {
  bn: {
    title: "আমরা সাহায্যের জন্য আছি",
    subtitle: "যেকোনো সমস্যায় আমাদের সাথে যোগাযোগ করুন, দ্রুত সমাধান দেব।",
    contact: [
      { icon: "📞", title: "ফোন", info: "+880 1XXX-XXXXXX", note: "সকাল ১০টা – রাত ৮টা" },
      { icon: "✉️", title: "ইমেইল", info: "support@yourshop.com", note: "২৪ ঘণ্টার মধ্যে উত্তর" },
      { icon: "💬", title: "লাইভ চ্যাট", info: "চ্যাট শুরু করুন", note: "দ্রুততম সাপোর্ট" },
      { icon: "📍", title: "অফিস", info: "ঢাকা, বাংলাদেশ", note: "শনি – বৃহস্পতি" },
    ],
    faqTitle: "সাধারণ প্রশ্ন (FAQ)",
    faqs: [
      {
        q: "আমার অর্ডার কীভাবে ট্র্যাক করব?",
        a: "লগইন করে 'My Orders' পেজে গিয়ে অর্ডার ID দিয়ে ট্র্যাক করতে পারবেন।",
      },
      {
        q: "রিটার্ন বা রিফান্ড পলিসি কী?",
        a: "পণ্য হাতে পাওয়ার ৭ দিনের মধ্যে রিটার্ন করা যাবে। পণ্য অব্যবহৃত ও আসল প্যাকেজিংয়ে থাকতে হবে।",
      },
      {
        q: "ডেলিভারি হতে কত সময় লাগে?",
        a: "ঢাকার ভেতরে ১–২ দিন এবং ঢাকার বাইরে ৩–৫ কর্মদিবস।",
      },
      {
        q: "কী কী পেমেন্ট মেথড আছে?",
        a: "ক্যাশ অন ডেলিভারি, bKash, Nagad এবং কার্ড পেমেন্ট সাপোর্ট করা হয়।",
      },
    ],
    formTitle: "সাপোর্ট টিকেট জমা দিন",
    placeholders: {
      name: "আপনার নাম",
      email: "ইমেইল",
      orderId: "অর্ডার ID (ঐচ্ছিক)",
      message: "আপনার সমস্যাটি বিস্তারিত লিখুন...",
    },
    categories: {
      order: "অর্ডার সংক্রান্ত",
      payment: "পেমেন্ট সমস্যা",
      return: "রিটার্ন / রিফান্ড",
      delivery: "ডেলিভারি",
      other: "অন্যান্য",
    },
    errors: {
      name: "নাম দিন",
      email: "সঠিক ইমেইল দিন",
      message: "কমপক্ষে ১০ অক্ষরের বার্তা লিখুন",
    },
    submit: "টিকেট পাঠান",
    success: "✅ আপনার টিকেট জমা হয়েছে। শীঘ্রই আমরা যোগাযোগ করব।",
    another: "আরেকটি টিকেট খুলুন",
  },

  en: {
    title: "We're here to help",
    subtitle: "Contact us for any issue and we'll get it sorted quickly.",
    contact: [
      { icon: "📞", title: "Phone", info: "+880 1XXX-XXXXXX", note: "10 AM – 8 PM" },
      { icon: "✉️", title: "Email", info: "support@yourshop.com", note: "Reply within 24 hours" },
      { icon: "💬", title: "Live Chat", info: "Start a chat", note: "Fastest support" },
      { icon: "📍", title: "Office", info: "Dhaka, Bangladesh", note: "Sat – Thu" },
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "How can I track my order?",
        a: "Log in, go to the 'My Orders' page and track it using your order ID.",
      },
      {
        q: "What is the return / refund policy?",
        a: "You can return a product within 7 days of receiving it. It must be unused and in its original packaging.",
      },
      {
        q: "How long does delivery take?",
        a: "1–2 days inside Dhaka and 3–5 working days outside Dhaka.",
      },
      {
        q: "Which payment methods are available?",
        a: "Cash on delivery, bKash, Nagad and card payments are supported.",
      },
    ],
    formTitle: "Submit a support ticket",
    placeholders: {
      name: "Your name",
      email: "Email",
      orderId: "Order ID (optional)",
      message: "Describe your problem in detail...",
    },
    categories: {
      order: "Order related",
      payment: "Payment issue",
      return: "Return / Refund",
      delivery: "Delivery",
      other: "Other",
    },
    errors: {
      name: "Please enter your name",
      email: "Please enter a valid email",
      message: "Message must be at least 10 characters",
    },
    submit: "Submit ticket",
    success: "✅ Your ticket has been submitted. We'll contact you soon.",
    another: "Open another ticket",
  },
};

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left font-medium text-gray-800"
        aria-expanded={open}
      >
        {q}
        <span className={`ml-4 transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      {open && <p className="pb-4 text-sm text-gray-600">{a}</p>}
    </div>
  );
}

const emptyForm = { name: "", email: "", orderId: "", category: "order", message: "" };

export default function Support() {
  const { language } = useContext(LanguageContext);
  const lang = language === "BN" ? "bn" : "en";
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const t = translations[lang];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "email";
    if (form.message.trim().length < 10) err.message = "message";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    setSubmitError("");
    if (Object.keys(err).length === 0 && !isSending) {
      setIsSending(true);
      try {
        await axiosInstance.post("/api/support", {
          ...form,
          lang,
          source: "support-page",
        });
      setSubmitted(true);
      setForm(emptyForm);
      } catch (error) {
        setSubmitError(
          error.response?.data?.message ||
            "Could not send the ticket. Please try again."
        );
      } finally {
        setIsSending(false);
      }
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        <p className="mt-2 text-gray-600">{t.subtitle}</p>
      </div>

      {/* Contact cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.contact.map((c) => (
          <div
            key={c.icon}
            className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm transition hover:shadow-md"
          >
            <div className="text-3xl">{c.icon}</div>
            <h3 className="mt-2 font-semibold text-gray-800">{c.title}</h3>
            <p className="mt-1 text-sm font-medium text-indigo-600">{c.info}</p>
            <p className="mt-1 text-xs text-gray-500">{c.note}</p>
          </div>
        ))}
      </div>

      {/* FAQ + Form */}
      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        {/* FAQ */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">{t.faqTitle}</h2>
          <div className="rounded-xl border border-gray-200 bg-white px-5">
            {t.faqs.map((f, i) => (
              <FaqItem key={`${lang}-${i}`} q={f.q} a={f.a} />
            ))}
          </div>
        </div>

        {/* Ticket form */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">{t.formTitle}</h2>

          {submitted ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-800">
              {t.success}
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 block text-sm font-medium underline"
              >
                {t.another}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-xl border border-gray-200 bg-white p-5"
              noValidate
            >
              {submitError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {submitError}
                </p>
              )}
              <div>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t.placeholders.name}
                  className={inputClass}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{t.errors.name}</p>
                )}
              </div>

              <div>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t.placeholders.email}
                  className={inputClass}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{t.errors.email}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="orderId"
                  value={form.orderId}
                  onChange={handleChange}
                  placeholder={t.placeholders.orderId}
                  className={inputClass}
                />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {Object.entries(t.categories).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <textarea
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t.placeholders.message}
                  className={inputClass}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{t.errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {isSending ? "..." : t.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}