import { useState, useMemo } from "react";
import axiosInstance from "../../utils/axiosInstance";

const categories = [
  { id: "all", label: "সব", icon: "📚" },
  { id: "order", label: "অর্ডার", icon: "🛒" },
  { id: "payment", label: "পেমেন্ট", icon: "💳" },
  { id: "delivery", label: "ডেলিভারি", icon: "🚚" },
  { id: "return", label: "রিটার্ন ও রিফান্ড", icon: "🔄" },
  { id: "account", label: "অ্যাকাউন্ট", icon: "👤" },
];

const faqs = [
  {
    category: "order",
    q: "কীভাবে অর্ডার করব?",
    a: "পছন্দের প্রোডাক্ট সিলেক্ট করে 'কার্টে যোগ করুন' বাটনে ক্লিক করুন। এরপর কার্টে গিয়ে 'চেকআউট' চাপুন, ঠিকানা ও পেমেন্ট মেথড দিয়ে অর্ডার কনফার্ম করুন।",
  },
  {
    category: "order",
    q: "অর্ডার করার পর কি বাতিল করা যায়?",
    a: "হ্যাঁ, অর্ডার শিপ হওয়ার আগে 'আমার অর্ডার' পেজ থেকে বাতিল করতে পারবেন। শিপ হয়ে গেলে বাতিল করা যাবে না, তবে রিটার্ন করতে পারবেন।",
  },
  {
    category: "order",
    q: "আমার অর্ডারের স্ট্যাটাস কীভাবে দেখব?",
    a: "লগইন করে 'আমার অর্ডার' সেকশনে গেলে প্রতিটি অর্ডারের বর্তমান অবস্থা দেখতে পাবেন।",
  },
  {
    category: "payment",
    q: "কোন কোন পেমেন্ট মেথড গ্রহণ করা হয়?",
    a: "ক্যাশ অন ডেলিভারি, বিকাশ, নগদ, রকেট এবং ডেবিট/ক্রেডিট কার্ড গ্রহণ করা হয়।",
  },
  {
    category: "payment",
    q: "অনলাইন পেমেন্ট কি নিরাপদ?",
    a: "হ্যাঁ, আমরা এনক্রিপ্টেড পেমেন্ট গেটওয়ে ব্যবহার করি। আপনার কার্ড বা মোবাইল ব্যাংকিং তথ্য আমরা সংরক্ষণ করি না।",
  },
  {
    category: "delivery",
    q: "ডেলিভারিতে কত সময় লাগে?",
    a: "ঢাকার ভেতরে ১-২ কার্যদিবস এবং ঢাকার বাইরে ৩-5 কার্যদিবস সময় লাগে।",
  },
  {
    category: "delivery",
    q: "ডেলিভারি চার্জ কত?",
    a: "ঢাকার ভেতরে ৬০ টাকা এবং ঢাকার বাইরে ১২০ টাকা। নির্দিষ্ট অর্ডার মূল্যের ওপরে ফ্রি ডেলিভারি পাওয়া যায়।",
  },
  {
    category: "return",
    q: "রিটার্ন পলিসি কী?",
    a: "প্রোডাক্ট হাতে পাওয়ার ৭ দিনের মধ্যে ত্রুটিপূর্ণ বা ভুল পণ্য রিটার্ন করা যাবে। পণ্যটি অব্যবহৃত ও আসল প্যাকেজিংয়ে থাকতে হবে।",
  },
  {
    category: "return",
    q: "রিফান্ড পেতে কতদিন লাগে?",
    a: "রিটার্ন পণ্য যাচাইয়ের পর ৫-৭ কার্যদিবসের মধ্যে আপনার পেমেন্ট মেথডে টাকা ফেরত দেওয়া হয়।",
  },
  {
    category: "account",
    q: "পাসওয়ার্ড ভুলে গেলে কী করব?",
    a: "লগইন পেজে 'পাসওয়ার্ড ভুলে গেছেন?' লিংকে ক্লিক করুন। আপনার ইমেইলে রিসেট লিংক পাঠানো হবে।",
  },
  {
    category: "account",
    q: "কীভাবে আমার প্রোফাইল তথ্য পরিবর্তন করব?",
    a: "লগইন করে 'প্রোফাইল' পেজে গিয়ে নাম, ফোন নম্বর ও ঠিকানা আপডেট করতে পারবেন।",
  },
];

const contacts = [
  { icon: "📞", title: "ফোন", value: "+880 1XXX-XXXXXX", note: "সকাল ১০টা - রাত ৮টা" },
  { icon: "✉️", title: "ইমেইল", value: "support@yourshop.com", note: "২৪ ঘণ্টার মধ্যে উত্তর" },
  { icon: "💬", title: "লাইভ চ্যাট", value: "চ্যাট শুরু করুন", note: "প্রতিদিন সক্রিয়" },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left px-5 py-4 hover:bg-gray-50 transition"
      >
        <span className="font-medium text-gray-800">{item.q}</span>
        <span
          className={`text-xl text-indigo-600 transition-transform duration-200 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {isOpen && (
        <div className="px-5 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      const matchCategory = activeCategory === "all" || f.category === activeCategory;
      const text = (f.q + f.a).toLowerCase();
      const matchSearch = text.includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [search, activeCategory]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    setError("");

    try {
      await axiosInstance.post("/api/support", {
        ...formData,
        category: "help",
        source: "help-page",
      });
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "মেসেজ পাঠানো যায়নি। আবার চেষ্টা করুন।"
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero + Search */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            আমরা কীভাবে সাহায্য করতে পারি?
          </h1>
          <p className="text-indigo-100 mb-8">
            আপনার প্রশ্নের উত্তর খুঁজুন অথবা আমাদের সাথে যোগাযোগ করুন
          </p>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 প্রশ্ন সার্চ করুন... (যেমন: রিটার্ন, পেমেন্ট)"
            className="w-full px-5 py-4 rounded-xl text-gray-800 outline-none shadow-lg focus:ring-4 focus:ring-indigo-300"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-4 -mt-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCategory(c.id);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-full shadow text-sm font-medium transition ${
                activeCategory === c.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-indigo-50"
              }`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          সচরাচর জিজ্ঞাসিত প্রশ্ন
        </h2>
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((item, i) => (
              <FaqItem
                key={item.q}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">
              দুঃখিত, কোনো ফলাফল পাওয়া যায়নি। নিচের ফর্ম দিয়ে আমাদের জানান।
            </p>
          )}
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          সরাসরি যোগাযোগ করুন
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {contacts.map((c) => (
            <div
              key={c.title}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition"
            >
              <div className="text-4xl mb-3">{c.icon}</div>
              <h3 className="font-semibold text-gray-800">{c.title}</h3>
              <p className="text-indigo-600 font-medium mt-1">{c.value}</p>
              <p className="text-sm text-gray-500 mt-1">{c.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Message Form */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            আমাদের মেসেজ পাঠান
          </h2>
          <p className="text-gray-500 mb-6">
            উত্তর না পেলে এখানে লিখুন, আমরা দ্রুত যোগাযোগ করব।
          </p>

          {submitted && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
              ✅ আপনার মেসেজ সফলভাবে পাঠানো হয়েছে!
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="আপনার নাম"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="ইমেইল ঠিকানা"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <textarea
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="আপনার সমস্যা বা প্রশ্ন লিখুন..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {isSending ? "পাঠানো হচ্ছে..." : "মেসেজ পাঠান"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}