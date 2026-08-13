import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faClock,
  faPaperPlane,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [openFaq, setOpenFaq] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Integrate backend API call here
    console.log("Form Submitted:", formData);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How long does delivery take?",
      a: "Inside Dhaka, delivery takes 24–48 hours. Outside Dhaka, it takes 2–3 business days.",
    },
    {
      q: "Can I return a product if I don't like it?",
      a: "Yes! You can return or exchange items within 7 days according to our return policy.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Cash on Delivery, Mobile Banking (bKash, Nagad, Rocket), and all major Debit/Credit cards.",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER SECTION ================= */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Get in Touch With Us
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Have a question or feedback? Our team is here to assist you every step of the way.
          </p>
        </div>

        {/* ================= INFO CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1: Phone */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faPhone} className="text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">Phone Support</h3>
              <p className="text-sm text-slate-600 mb-1">+880 1922773703</p>
              <p className="text-sm text-slate-600">+880 01540184685</p>
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faEnvelope} className="text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">Email Us</h3>
              <p className="text-sm text-slate-600">md.shimulstore@gamil.com.com</p>
              <p className="text-sm text-slate-600 mb-1">md.shimuldiu7@gmail.com</p>
            </div>
          </div>

          {/* Card 3: Address */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">Showroom / Office</h3>
              <p className="text-sm text-slate-600">
                GM bari,North Badda, Bangladesh.
              </p>
            </div>
          </div>

          {/* Card 4: Working Hours */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faClock} className="text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">Working Hours</h3>
              <p className="text-sm text-slate-600 mb-1">Saturday - Thursday</p>
              <p className="text-sm text-slate-600">9:00 AM - 10:00 PM</p>
            </div>
          </div>
        </div>

        {/* ================= FORM & MAP SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Send Us a Message</h2>
            <p className="text-slate-500 text-sm mb-6">
              Fill out the form below and our team will get back to you as soon as possible.
            </p>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm">
                Thank you! Your message has been sent successfully. We will contact you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@mail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1700-000000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Order Inquiry"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message or inquiry here..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Send Message</span>
                <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
              </button>
            </form>
          </div>

          {/* Map & Social Links */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Google Map */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 h-full min-h-[300px] overflow-hidden">
              <iframe
                title="Google Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902442430132!2d90.3754223!3d23.7508581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33cff1357%3A0x932c021312314b!2sDhanmondi%2032!5e0!3m2!1sen!2sbd!4v1680000000000!5m2!1sen!2sbd"
                className="w-full h-full min-h-[300px] rounded-xl border-0"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

            {/* Social Media Links */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-3 text-sm">Follow Us on Social Media</h3>
              <div className="flex gap-3">
                <a
                  href="https://www.Facebook.com"
                  aria-label="Facebook"
                  className="w-10 h-10 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-xl flex items-center justify-center text-slate-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 bg-slate-100 hover:bg-pink-600 hover:text-white rounded-xl flex items-center justify-center text-slate-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-10 h-10 bg-slate-100 hover:bg-sky-500 hover:text-white rounded-xl flex items-center justify-center text-slate-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a
                  href="#"
                  aria-label="WhatsApp"
                  className="w-10 h-10 bg-slate-100 hover:bg-emerald-600 hover:text-white rounded-xl flex items-center justify-center text-slate-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FAQ SECTION ================= */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between font-medium text-slate-800 text-sm sm:text-base focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <FontAwesomeIcon
                    icon={openFaq === index ? faChevronUp : faChevronDown}
                    className="text-slate-400 text-xs"
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-sm text-slate-600 border-t border-slate-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;