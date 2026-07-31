import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faLock,
  faTruck,
  faCircleCheck,
  faBolt,
  faExclamationCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const Checkout = () => {
  const [formdata, setFormdata] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "",
    transactionId: "",
    mobileNumber: "",
  });

  const [count, setCount] = useState(1);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const [loading, setLoading] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage("");
  };

  // Product na thakle (jemon: URL directly type kore ele) crash na kore guard dekhabe
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF6EF] gap-4 px-4 text-center">
        <FontAwesomeIcon icon={faExclamationCircle} size="2x" className="text-red-500" />
        <p className="text-[#16241F] font-medium">
          কোনো প্রোডাক্ট পাওয়া যায়নি। দয়া করে শপ পেজ থেকে আবার চেষ্টা করুন।
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-[#16241F] text-[#FAF6EF] px-6 py-2.5 rounded-lg font-medium"
        >
          শপ পেজে ফিরে যান
        </button>
      </div>
    );
  }

  const { name, image, price, stock, description } = product;
  const deliveryCharge = 60;
  const subtotal = price * count;
  const total = subtotal + deliveryCharge;

  const validate = () => {
    if (!formdata.name.trim()) return "নাম দিতে হবে।";
    if (!formdata.phone.trim() || formdata.phone.length < 10)
      return "সঠিক ফোন নাম্বার দিন।";
    if (!formdata.address.trim()) return "ডেলিভারি ঠিকানা দিতে হবে।";
    if (!formdata.paymentMethod) return "পেমেন্ট মেথড সিলেক্ট করুন।";

    if (formdata.paymentMethod === "bkash" || formdata.paymentMethod === "nagad") {
      if (!formdata.mobileNumber.trim() || formdata.mobileNumber.length < 11)
        return "সঠিক মোবাইল নাম্বার দিন।";
      if (!formdata.transactionId.trim())
        return "Transaction ID দিতে হবে।";
    }

    if (count < 1 || count > stock) return "পণ্যের পরিমাণ ঠিক নেই।";

    return null;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const errorMsg = validate();
    if (errorMsg) {
      setMessage(errorMsg);
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        productId: product._id,
        quantity: count,
        subtotal,
        deliveryCharge,
        total,
        customer: {
          name: formdata.name,
          phone: formdata.phone,
          address: formdata.address,
        },
        payment: {
          method: formdata.paymentMethod,
          mobileNumber: formdata.mobileNumber || null,
          transactionId: formdata.transactionId || null,
        },
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        payload,
        { withCredentials: true }
      );

      setMessage("Order placed successfully!");
      setMessageType("success");

      // 1.5 sec por order confirmation page e navigate
      setTimeout(() => {
        navigate("/order-success", { state: { order: res.data } });
      }, 1500);
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "অর্ডার প্লেস করা যায়নি। আবার চেষ্টা করুন।";
      setMessage(errMsg);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Shipping Information */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E4DDCE] p-8 sm:p-10">
            <h2 className="text-3xl mb-1 text-[#16241F] font-semibold">
              Shipping details
            </h2>
            <p className="text-[#16241F]/50 mb-8 text-sm">
              We'll use this to get your order to you.
            </p>

            {/* Message */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${messageType === "success"
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-600"
                  }`}
              >
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  className={`mt-0.5 ${messageType === "success" ? "text-green-500" : "text-red-500"
                    }`}
                />
                <p className="text-sm">{message}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={submitHandler} id="checkout-form">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-[#16241F]">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formdata.name}
                  onChange={changeHandler}
                  placeholder="e.g. Md. Shimul"
                  className="w-full border border-[#E4DDCE] bg-[#FAF6EF]/40 rounded-lg px-4 py-3 text-[#16241F] placeholder:text-[#16241F]/30 outline-none focus:ring-2 focus:ring-[#B08946] focus:border-[#B08946] transition"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-[#16241F]">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-0 top-0 h-full flex items-center pl-4 pointer-events-none">
                    <span className="text-[#16241F]/40 font-medium">+880</span>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formdata.phone}
                    onChange={changeHandler}
                    required
                    maxLength={12}
                    className="w-full border border-[#E4DDCE] bg-[#FAF6EF]/40 rounded-lg pl-16 pr-4 py-3 text-[#16241F] placeholder:text-[#16241F]/30 outline-none focus:ring-2 focus:ring-[#B08946] focus:border-[#B08946] transition"
                  />
                </div>
              </div>

              {/* Address Field */}
              <div>
                <label htmlFor="address" className="block mb-2 text-sm font-medium text-[#16241F]">
                  Delivery address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  name="address"
                  required
                  value={formdata.address}
                  onChange={changeHandler}
                  placeholder="House no, Road no, Area, Thana, District"
                  className="w-full border border-[#E4DDCE] bg-[#FAF6EF]/40 rounded-lg px-4 py-3 text-[#16241F] placeholder:text-[#16241F]/30 outline-none focus:ring-2 focus:ring-[#B08946] focus:border-[#B08946] transition resize-none"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block mb-3 text-sm font-medium text-[#16241F]">
                  Payment method <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {/* Bkash */}
                  <div>
                    <div
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${formdata.paymentMethod === "bkash"
                          ? "border-[#B08946] bg-[#B08946]/5"
                          : "border-[#E4DDCE] hover:border-[#B08946]/50"
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bkash"
                        checked={formdata.paymentMethod === "bkash"}
                        onChange={changeHandler}
                        className="mr-3 accent-[#B08946]"
                      />
                      <div className="flex items-center gap-3">
                        <span className="text-xl">💳</span>
                        <span className="font-medium">Bkash</span>
                      </div>
                      {formdata.paymentMethod === "bkash" && (
                        <FontAwesomeIcon icon={faCircleCheck} className="ml-auto text-[#B08946]" />
                      )}
                    </div>

                    {formdata.paymentMethod === "bkash" && (
                      <div className="mt-2 pl-8 pr-3 pb-3">
                        <div className="p-4 bg-[#FAF6EF]/60 rounded-lg border border-[#E4DDCE]">
                          <h4 className="text-sm font-semibold text-[#16241F] mb-3 flex items-center gap-2">
                            <FontAwesomeIcon icon={faBolt} className="text-[#B08946]" />
                            Bkash Payment Details
                          </h4>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-[#16241F]/70 mb-1">
                                Bkash Number <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute left-0 top-0 h-full flex items-center pl-3 pointer-events-none">
                                  <span className="text-[#16241F]/30 text-sm">+880</span>
                                </div>
                                <input
                                  type="tel"
                                  required
                                  name="mobileNumber"
                                  value={formdata.mobileNumber}
                                  onChange={changeHandler}
                                  placeholder="1XXXXXXXXXX"
                                  maxLength={11}
                                  className="w-full border border-[#E4DDCE] bg-white rounded-lg px-4 py-2.5 pl-16 text-[#16241F] placeholder:text-[#16241F]/30 outline-none focus:ring-2 focus:ring-[#B08946] focus:border-[#B08946] transition"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-[#16241F]/70 mb-1">
                                Transaction ID <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="transactionId"
                                value={formdata.transactionId}
                                onChange={changeHandler}
                                placeholder="Enter transaction ID"
                                className="w-full border border-[#E4DDCE] bg-white rounded-lg px-4 py-2.5 text-[#16241F] placeholder:text-[#16241F]/30 outline-none focus:ring-2 focus:ring-[#B08946] focus:border-[#B08946] transition"
                              />
                            </div>

                            <div className="p-2 bg-[#B08946]/5 rounded border border-[#B08946]/20">
                              <p className="text-xs text-[#16241F]/60">
                                <span className="font-medium">Note:</span> Send payment to Bkash number and enter the transaction ID above.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Nagad */}
                  <div>
                    <div
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${formdata.paymentMethod === "nagad"
                          ? "border-[#B08946] bg-[#B08946]/5"
                          : "border-[#E4DDCE] hover:border-[#B08946]/50"
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="nagad"
                        checked={formdata.paymentMethod === "nagad"}
                        onChange={changeHandler}
                        className="mr-3 accent-[#B08946]"
                      />
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📱</span>
                        <span className="font-medium">Nagad</span>
                      </div>
                      {formdata.paymentMethod === "nagad" && (
                        <FontAwesomeIcon icon={faCircleCheck} className="ml-auto text-[#B08946]" />
                      )}
                    </div>

                    {formdata.paymentMethod === "nagad" && (
                      <div className="mt-2 pl-8 pr-3 pb-3">
                        <div className="p-4 bg-[#FAF6EF]/60 rounded-lg border border-[#E4DDCE]">
                          <h4 className="text-sm font-semibold text-[#16241F] mb-3 flex items-center gap-2">
                            <FontAwesomeIcon icon={faBolt} className="text-[#B08946]" />
                            Nagad Payment Details
                          </h4>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-[#16241F]/70 mb-1">
                                Nagad Number <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute left-0 top-0 h-full flex items-center pl-3 pointer-events-none">
                                  <span className="text-[#16241F]/30 text-sm">+880</span>
                                </div>
                                <input
                                  type="tel"
                                  name="mobileNumber"
                                  value={formdata.mobileNumber}
                                  onChange={changeHandler}
                                  placeholder="1XXXXXXXXXX"
                                  maxLength={11}
                                  className="w-full border border-[#E4DDCE] bg-white rounded-lg px-4 py-2.5 pl-16 text-[#16241F] placeholder:text-[#16241F]/30 outline-none focus:ring-2 focus:ring-[#B08946] focus:border-[#B08946] transition"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-[#16241F]/70 mb-1">
                                Transaction ID <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="transactionId"
                                value={formdata.transactionId}
                                onChange={changeHandler}
                                placeholder="Enter transaction ID"
                                className="w-full border border-[#E4DDCE] bg-white rounded-lg px-4 py-2.5 text-[#16241F] placeholder:text-[#16241F]/30 outline-none focus:ring-2 focus:ring-[#B08946] focus:border-[#B08946] transition"
                              />
                            </div>

                            <div className="p-2 bg-[#B08946]/5 rounded border border-[#B08946]/20">
                              <p className="text-xs text-[#16241F]/60">
                                <span className="font-medium">Note:</span> Send payment to Nagad number and enter the transaction ID above.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cash on Delivery */}
                  <div>
                    <div
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${formdata.paymentMethod === "cod"
                          ? "border-[#B08946] bg-[#B08946]/5"
                          : "border-[#E4DDCE] hover:border-[#B08946]/50"
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formdata.paymentMethod === "cod"}
                        onChange={changeHandler}
                        className="mr-3 accent-[#B08946]"
                      />
                      <div className="flex items-center gap-3">
                        <span className="text-xl">💵</span>
                        <span className="font-medium">Cash on Delivery</span>
                      </div>
                      {formdata.paymentMethod === "cod" && (
                        <FontAwesomeIcon icon={faCircleCheck} className="ml-auto text-[#B08946]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-8 pt-6 border-t border-[#E4DDCE] text-xs text-[#16241F]/50">
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faLock} className="text-[#B08946]" />
                  Secure checkout
                </span>
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faTruck} className="text-[#B08946]" />
                  Delivery in 3–5 days
                </span>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2 lg:sticky lg:top-10">
            <div
              className="bg-white rounded-2xl border border-[#E4DDCE] overflow-hidden"
              style={{ boxShadow: "0 1px 0 rgba(22,36,31,0.03)" }}
            >
              <div
                className="h-4 w-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% -50%, transparent 8px, #FAF6EF 9px)",
                  backgroundSize: "16px 16px",
                  backgroundPosition: "0 0",
                  backgroundColor: "white",
                }}
              />

              <div className="p-8">
                <p className="text-xs tracking-[0.15em] uppercase text-[#16241F]/40 mb-4">
                  Order Summary
                </p>

                <div className="flex gap-4">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${image}`}
                    alt={name}
                    className="w-20 h-20 object-cover rounded-lg border border-[#E4DDCE]"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg text-[#16241F] truncate font-semibold">{name}</h3>
                    <p className="text-sm text-[#16241F]/50 line-clamp-2 mt-1">{description}</p>
                    <p className="mt-2 text-[#16241F]">৳{price}</p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex justify-between items-center mt-6">
                  <span className="text-sm font-medium text-[#16241F]">Quantity</span>
                  <div className="flex items-center border border-[#E4DDCE] rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setCount((prev) => (prev > 1 ? prev - 1 : 1))}
                      className="px-3 py-2 text-[#16241F] hover:bg-[#FAF6EF] transition"
                    >
                      <FontAwesomeIcon icon={faMinus} size="xs" />
                    </button>
                    <span className="px-5 font-medium">{count}</span>
                    <button
                      type="button"
                      onClick={() => setCount((prev) => (prev < stock ? prev + 1 : stock))}
                      className="px-3 py-2 text-[#16241F] hover:bg-[#FAF6EF] transition"
                    >
                      <FontAwesomeIcon icon={faPlus} size="xs" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#16241F]/40 mt-2">{stock} in stock</p>

                <div className="border-t border-dashed border-[#D8CFB8] my-6" />

                <div className="space-y-2.5 text-sm text-[#16241F]/70">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>৳{deliveryCharge}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-[#D8CFB8] my-4" />

                <div className="flex justify-between items-baseline">
                  <span className="text-[#16241F] font-semibold">Total</span>
                  <span className="text-2xl text-[#16241F] font-semibold">৳{total}</span>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="w-full mt-8 bg-[#16241F] hover:bg-[#0F1A16] duration-200 text-[#FAF6EF] py-3.5 rounded-xl font-medium text-base flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon
                    icon={loading ? faSpinner : faCircleCheck}
                    className={`text-[#B08946] group-hover:text-[#c9a25c] transition ${loading ? "animate-spin" : ""
                      }`}
                  />
                  {loading ? "Placing order..." : "Confirm & Place Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;