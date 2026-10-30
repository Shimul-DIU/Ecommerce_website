import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faTrash,
  faCircleCheck,
  faExclamationCircle,
  faSpinner,
  faMobileAlt,
  faStore,
  faShoppingBag,
  faArrowLeft,
  faTag,
  faPaperPlane,
  faStar,
  faLock,
  faTruckFast,
  faShieldHalved,
  faUser,
  faLocationDot,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const SHIPPING_FEE = 60;
const FREE_SHIPPING_MIN = 2000;

// state থেকে আসা প্রোডাক্টগুলোকে এক ফরম্যাটে আনা
const buildInitialItems = (state) => {
  const source = state?.items?.length
    ? state.items
    : state?.product
      ? [{ ...state.product, quantity: 1 }]
      : [];

  return source
    .filter((p) => p && p._id)
    .map((p) => {
      const stock = Number(p.stock ?? 0);
      const maxQty = stock > 0 ? stock : 100;
      const qty = Math.min(Math.max(1, Number(p.quantity) || 1), maxQty);
      const price = Number(p.price || 0);
      const originalPrice = Number(p.originalPrice || 0);
      return {
        ...p,
        _id: String(p._id),
        price,
        originalPrice: originalPrice > price ? originalPrice : price,
        stock,
        quantity: qty,
        image: p.image || p.images?.[0] || "/images/placeholder.jpg",
      };
    });
};

/* ---------- ছোট UI helper ---------- */
const SectionTitle = ({ icon, title, step }) => (
  <div className="flex items-center gap-3 mb-4 sm:mb-5">
    <span className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-[#16241F] text-[#B08946] flex items-center justify-center">
      <FontAwesomeIcon icon={icon} className="text-sm sm:text-base" />
    </span>
    <div className="min-w-0">
      {step && (
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#B08946]">
          {step}
        </p>
      )}
      <h3 className="text-base sm:text-lg font-bold text-[#16241F] leading-tight">
        {title}
      </h3>
    </div>
  </div>
);

const FieldError = ({ message }) => (
  <p className="mt-1.5 flex items-center gap-1.5 text-xs sm:text-sm text-red-500 font-medium">
    <FontAwesomeIcon icon={faExclamationCircle} className="text-xs" />
    {message}
  </p>
);

const labelCls =
  "block text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] text-[#16241F]/70 mb-1.5";

const inputCls = (hasError) =>
  `w-full rounded-xl border px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-[#16241F] outline-none transition placeholder:text-[#16241F]/30 ${
    hasError
      ? "border-red-400 bg-red-50/40 ring-2 ring-red-200"
      : "border-[#E4DDCE] bg-[#FAF6EF]/50 focus:border-[#B08946] focus:bg-white focus:ring-4 focus:ring-[#B08946]/15"
  }`;

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  const [items, setItems] = useState(() => buildInitialItems(state));

  const [formdata, setFormdata] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "",
    transactionId: "",
    mobileNumber: "",
  });

  const [error, setError] = useState({ field: "", message: "" });
  const [serverMessage, setServerMessage] = useState("");
  const [serverMessageType, setServerMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== Review state =====
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // কোন প্রোডাক্টের review দেখাবো/দিবো (select না থাকলে বা item সরে গেলে প্রথমটা)
  const reviewProduct = useMemo(
    () => items.find((i) => i._id === selectedReviewId) || items[0] || null,
    [items, selectedReviewId]
  );
  const reviewProductId = reviewProduct?._id || null;

  const handleSelectReviewProduct = (id) => {
    if (id === reviewProductId) return;
    setSelectedReviewId(id);
    setReviewsList([]);
    setReviewError("");
    setReviewSubmitted(false);
    setUserRating(0);
    setReviewComment("");
  };

  const fetchReviews = useCallback(async () => {
    if (!reviewProductId) {
      setReviewsList([]);
      return;
    }
    try {
      const { data } = await axiosInstance.get(
        `/api/reviews/product/${reviewProductId}`
      );
      setReviewsList(data.reviews || []);
    } catch (err) {
      console.error(
        "Fetch reviews error:",
        err.response?.status,
        err.response?.data || err.message
      );
    }
  }, [reviewProductId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // ===== Order Summary হিসাব =====
  const summary = useMemo(() => {
    const totalQty = items.reduce((s, i) => s + i.quantity, 0);
    const originalTotal = items.reduce(
      (s, i) => s + i.originalPrice * i.quantity,
      0
    );
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const discount = originalTotal - subtotal;
    const discountPercent =
      originalTotal > 0 ? Math.round((discount / originalTotal) * 100) : 0;
    const shipping =
      subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;
    return {
      totalQty,
      originalTotal,
      subtotal,
      discount,
      discountPercent,
      shipping,
      total,
    };
  }, [items]);

  // ফ্রি শিপিং প্রোগ্রেস
  const freeShipProgress = Math.min(
    (summary.subtotal / FREE_SHIPPING_MIN) * 100,
    100
  );
  const freeShipRemaining = Math.max(FREE_SHIPPING_MIN - summary.subtotal, 0);

  // ===== Item handlers =====
  const increaseQty = (id) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i._id !== id) return i;
        const max = i.stock > 0 ? i.stock : 100;
        return { ...i, quantity: Math.min(i.quantity + 1, max) };
      })
    );
  };

  const decreaseQty = (id) => {
    setItems((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
      )
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
    if (error.field === name) setError({ field: "", message: "" });
    setServerMessage("");
  };

  // ===== Review submit =====
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSubmitted(false);

    if (!accessToken) {
      setReviewError("Please login first to submit a review.");
      return;
    }
    if (!reviewProductId) {
      setReviewError("No product selected for review.");
      return;
    }
    if (userRating < 1 || userRating > 5) {
      setReviewError("Please select a rating.");
      return;
    }
    const comment = reviewComment.trim();
    if (!comment) {
      setReviewError("Please write your review.");
      return;
    }
    if (comment.length > 500) {
      setReviewError("Review cannot be more than 500 characters.");
      return;
    }

    try {
      setReviewLoading(true);
      await axiosInstance.post(
        "/api/reviews",
        { productId: reviewProductId, rating: userRating, comment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      await fetchReviews();
      setUserRating(0);
      setReviewComment("");
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 3000);
    } catch (err) {
      console.error("Review submit error:", err.response?.data || err.message);
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
  };

  // ===== Validation =====
  const validate = () => {
    if (items.length === 0) {
      setServerMessage("No product selected.");
      setServerMessageType("error");
      return false;
    }
    if (!formdata.name.trim()) {
      setError({ field: "name", message: "Please enter your full name." });
      return false;
    }
    if (!formdata.phone.trim()) {
      setError({ field: "phone", message: "Please enter your phone number." });
      return false;
    }
    if (!/^01\d{9}$/.test(formdata.phone.trim())) {
      setError({
        field: "phone",
        message: "Please enter a valid 11-digit phone number.",
      });
      return false;
    }
    if (!formdata.address.trim()) {
      setError({
        field: "address",
        message: "Please enter your delivery address.",
      });
      return false;
    }
    if (!formdata.paymentMethod) {
      setError({
        field: "paymentMethod",
        message: "Please select a payment method.",
      });
      return false;
    }
    if (
      formdata.paymentMethod === "bkash" ||
      formdata.paymentMethod === "nagad"
    ) {
      if (!formdata.mobileNumber.trim()) {
        setError({
          field: "mobileNumber",
          message: "Please enter your payment mobile number.",
        });
        return false;
      }
      if (!/^01\d{9}$/.test(formdata.mobileNumber.trim())) {
        setError({
          field: "mobileNumber",
          message: "Please enter a valid 11-digit mobile number.",
        });
        return false;
      }
      if (!formdata.transactionId.trim()) {
        setError({
          field: "transactionId",
          message: "Please enter your Transaction ID.",
        });
        return false;
      }
    }
    const badQty = items.some(
      (i) => i.quantity < 1 || i.quantity > (i.stock > 0 ? i.stock : 100)
    );
    if (badQty) {
      setError({ field: "quantity", message: "Invalid product quantity." });
      return false;
    }
    setError({ field: "", message: "" });
    return true;
  };

  // ===== Order submit =====
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!accessToken) {
      setServerMessage("Please login before placing an order.");
      setServerMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setServerMessage("");

      const payload = {
        items: items.map((i) => ({
          productId: i._id,
          quantity: i.quantity,
        })),
        subtotal: summary.subtotal,
        deliveryCharge: summary.shipping,
        total: summary.total,
        customer: {
          name: formdata.name.trim(),
          phone: formdata.phone.trim(),
          address: formdata.address.trim(),
        },
        payment: {
          method: formdata.paymentMethod,
          mobileNumber: formdata.mobileNumber.trim() || null,
          transactionId: formdata.transactionId.trim() || null,
        },
      };

      const response = await axiosInstance.post("/api/orders", payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setServerMessage("Order placed successfully!");
      setServerMessageType("success");
      setTimeout(() => {
        navigate("/order-success", { state: { order: response.data.order } });
      }, 1000);
    } catch (err) {
      console.error("Order submit error:", err.response?.data || err.message);
      setServerMessage(
        err.response?.data?.message || "Failed to place order. Please try again."
      );
      setServerMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ===== কোনো প্রোডাক্ট না থাকলে =====
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 sm:pt-44 flex flex-col items-center justify-center bg-[#FAF6EF] gap-4 px-4 text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#B08946]/20 animate-ping" />
          <div className="relative w-20 h-20 bg-[#16241F] rounded-full flex items-center justify-center text-[#B08946] ring-4 ring-[#B08946]/30">
            <FontAwesomeIcon icon={faShoppingBag} size="2x" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#16241F] mt-2">
          No Product Selected
        </h2>
        <p className="text-[#16241F]/60 max-w-md text-sm">
          Please select a product from the shop page to proceed to checkout.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-[#16241F] text-[#FAF6EF] px-7 py-3 rounded-xl font-semibold hover:bg-[#B08946] hover:text-[#16241F] transition flex items-center gap-2 shadow-lg mt-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="sm" />
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF]/50 pt-20 sm:pt-24 pb-10 px-3 sm:px-4 md:px-8">
      {/* ============ HEADER ============ */}
      <div className="w-full max-w-none mx-auto mb-5 sm:mb-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="hidden sm:block h-10 w-1 rounded-full bg-[#B08946]" />
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#B08946]">
                Secure Checkout
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#16241F] tracking-tight leading-tight">
                Checkout
                <span className="ml-2 align-middle text-xs sm:text-sm font-semibold bg-[#16241F] text-[#FAF6EF] px-2.5 py-1 rounded-full">
                  {items.length} product{items.length > 1 ? "s" : ""}
                </span>
              </h1>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm font-semibold text-[#16241F] hover:text-[#B08946] transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-white border border-[#E4DDCE] group-hover:bg-[#B08946] group-hover:text-white group-hover:border-[#B08946] flex items-center justify-center transition-all">
              <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            </span>
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        {/* Step indicator */}
        <div className="mt-5 flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
          {[
            { n: 1, t: "Cart", done: true },
            { n: 2, t: "Details", done: false, active: true },
            { n: 3, t: "Confirm", done: false },
          ].map((s, idx) => (
            <React.Fragment key={s.n}>
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] ${
                    s.done
                      ? "bg-[#B08946] text-[#16241F]"
                      : s.active
                        ? "bg-[#16241F] text-[#B08946] ring-2 ring-[#B08946]"
                        : "bg-white border border-[#E4DDCE] text-[#16241F]/40"
                  }`}
                >
                  {s.done ? <FontAwesomeIcon icon={faCircleCheck} /> : s.n}
                </span>
                <span
                  className={
                    s.active || s.done ? "text-[#16241F]" : "text-[#16241F]/40"
                  }
                >
                  {s.t}
                </span>
              </div>
              {idx < 2 && (
                <span
                  className={`h-px flex-1 max-w-[60px] ${
                    s.done ? "bg-[#B08946]" : "bg-[#E4DDCE]"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ============ SERVER MESSAGE ============ */}
      {serverMessage && (
        <div className="w-full max-w-none mx-auto mb-5">
          <div
            className={`p-3.5 sm:p-4 rounded-2xl flex items-center gap-3 text-sm sm:text-base shadow-sm border-l-4 ${
              serverMessageType === "success"
                ? "bg-green-50 border-green-500 text-green-800"
                : "bg-red-50 border-red-500 text-red-700"
            }`}
          >
            <FontAwesomeIcon
              icon={
                serverMessageType === "success"
                  ? faCircleCheck
                  : faExclamationCircle
              }
              className="text-lg"
            />
            <p className="font-semibold">{serverMessage}</p>
          </div>
        </div>
      )}

      {/* ============ MAIN ============ */}
      <div className="w-full max-w-none mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-start">
        {/* ---------- LEFT: Form + Reviews ---------- */}
        <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6 order-2 lg:order-1">
          {/* SHIPPING + PAYMENT */}
          <div className="bg-white rounded-3xl border border-[#E4DDCE] shadow-sm p-4 sm:p-7">
            <form
              className="space-y-6 sm:space-y-8"
              onSubmit={submitHandler}
              id="checkout-form"
            >
              {/* --- Contact --- */}
              <div>
                <SectionTitle
                  icon={faUser}
                  step="Step 01"
                  title="Contact Information"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* NAME */}
                  <div>
                    <label className={labelCls}>
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formdata.name}
                      onChange={changeHandler}
                      placeholder="Enter your name"
                      className={inputCls(error.field === "name")}
                    />
                    {error.field === "name" && (
                      <FieldError message={error.message} />
                    )}
                  </div>

                  {/* PHONE */}
                  <div>
                    <label className={labelCls}>
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-0 top-0 bottom-0 flex items-center px-3 rounded-l-xl bg-[#16241F] text-[#B08946] text-xs sm:text-sm font-bold">
                        +880
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formdata.phone}
                        onChange={changeHandler}
                        placeholder="01XXXXXXXXX"
                        maxLength={11}
                        className={`${inputCls(error.field === "phone")} pl-16 sm:pl-[72px]`}
                      />
                    </div>
                    {error.field === "phone" && (
                      <FieldError message={error.message} />
                    )}
                  </div>
                </div>
              </div>

              {/* --- Address --- */}
              <div>
                <SectionTitle
                  icon={faLocationDot}
                  step="Step 02"
                  title="Delivery Address"
                />
                <label className={labelCls}>
                  Full Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  name="address"
                  value={formdata.address}
                  onChange={changeHandler}
                  placeholder="House no, Road no, Area, Thana, District..."
                  className={`${inputCls(error.field === "address")} resize-none`}
                />
                {error.field === "address" && (
                  <FieldError message={error.message} />
                )}
              </div>

              {/* --- Payment --- */}
              <div>
                <SectionTitle
                  icon={faWallet}
                  step="Step 03"
                  title="Payment Method"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {["bkash", "nagad", "cod"].map((method) => {
                    const selected = formdata.paymentMethod === method;
                    const accent =
                      method === "bkash"
                        ? "text-pink-600 bg-pink-50"
                        : method === "nagad"
                          ? "text-orange-600 bg-orange-50"
                          : "text-emerald-700 bg-emerald-50";
                    return (
                      <label
                        key={method}
                        className={`relative flex sm:flex-col items-center sm:items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                          selected
                            ? "border-[#B08946] bg-[#16241F] shadow-lg"
                            : error.field === "paymentMethod"
                              ? "border-red-300 bg-red-50/20 hover:border-red-400"
                              : "border-[#E4DDCE] bg-white hover:border-[#B08946]/60 hover:shadow-md"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={selected}
                          onChange={(e) => {
                            changeHandler(e);
                            if (error.field === "paymentMethod") {
                              setError({ field: "", message: "" });
                            }
                          }}
                          className="sr-only"
                        />
                        <span
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}
                        >
                          <FontAwesomeIcon
                            icon={method === "cod" ? faStore : faMobileAlt}
                          />
                        </span>
                        <span
                          className={`font-bold text-sm sm:text-base capitalize ${
                            selected ? "text-[#FAF6EF]" : "text-[#16241F]"
                          }`}
                        >
                          {method === "cod" ? "Cash on Delivery" : method}
                          <span
                            className={`block text-[11px] font-medium normal-case ${
                              selected ? "text-[#FAF6EF]/60" : "text-[#16241F]/45"
                            }`}
                          >
                            {method === "cod"
                              ? "পণ্য হাতে পেয়ে টাকা দিন"
                              : "মোবাইল পেমেন্ট"}
                          </span>
                        </span>
                        {selected && (
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="absolute top-3 right-3 text-[#B08946]"
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
                {error.field === "paymentMethod" && (
                  <FieldError message={error.message} />
                )}

                {/* bKash / Nagad extra fields */}
                {(formdata.paymentMethod === "bkash" ||
                  formdata.paymentMethod === "nagad") && (
                  <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-[#FAF6EF] border border-dashed border-[#B08946]/60 space-y-3.5">
                    <p className="text-xs sm:text-sm font-semibold text-[#16241F]/70 flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faShieldHalved}
                        className="text-[#B08946]"
                      />
                      <span className="capitalize">{formdata.paymentMethod}</span>{" "}
                      পেমেন্টের তথ্য দিন
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className={labelCls}>
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={formdata.mobileNumber}
                          onChange={changeHandler}
                          placeholder="01XXXXXXXXX"
                          maxLength={11}
                          className={inputCls(error.field === "mobileNumber")}
                        />
                        {error.field === "mobileNumber" && (
                          <FieldError message={error.message} />
                        )}
                      </div>
                      <div>
                        <label className={labelCls}>
                          Transaction ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="transactionId"
                          value={formdata.transactionId}
                          onChange={changeHandler}
                          placeholder="Enter Transaction ID"
                          className={inputCls(error.field === "transactionId")}
                        />
                        {error.field === "transactionId" && (
                          <FieldError message={error.message} />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* --- Order Summary --- */}
          {/* ORDER SUMMARY */}
          <div className="relative overflow-hidden rounded-3xl bg-[#16241F] text-[#FAF6EF] p-5 sm:p-6 shadow-xl border border-[#B08946]/30">
            <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#B08946]/10" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 w-44 h-44 rounded-full bg-[#B08946]/5" />

            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B08946]">
                Summary
              </p>
              <h3 className="text-lg sm:text-xl font-bold mb-4">Order Summary</h3>

              {/* Free shipping progress */}
              <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <FontAwesomeIcon icon={faTruckFast} className="text-[#B08946]" />
                  {freeShipRemaining > 0 ? (
                    <span className="text-[#FAF6EF]/80">
                      আরও{" "}
                      <b className="text-[#B08946]">
                        ৳{freeShipRemaining.toLocaleString()}
                      </b>{" "}
                      কিনলে ডেলিভারি ফ্রি
                    </span>
                  ) : (
                    <span className="text-green-300 font-semibold">
                      অভিনন্দন! আপনার ডেলিভারি ফ্রি
                    </span>
                  )}
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#B08946] to-[#E8C77F] transition-all duration-500"
                    style={{ width: `${freeShipProgress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2.5 text-sm sm:text-base">
                {summary.discount > 0 && (
                  <>
                    <div className="flex justify-between text-[#FAF6EF]/60">
                      <span>
                        Original Price ({summary.totalQty}{" "}
                        {summary.totalQty > 1 ? "items" : "item"})
                      </span>
                      <span className="line-through">
                        ৳{summary.originalTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-green-300 bg-green-400/10 border border-green-400/25 px-3 py-2 rounded-xl">
                      <span className="font-medium text-sm">
                        Discount ({summary.discountPercent}%)
                      </span>
                      <span className="font-bold">
                        -৳{summary.discount.toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-[#FAF6EF]/70">
                  <span>
                    Subtotal ({summary.totalQty}{" "}
                    {summary.totalQty > 1 ? "items" : "item"})
                  </span>
                  <span className="font-semibold text-[#FAF6EF]">
                    ৳{summary.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#FAF6EF]/70">
                  <span>Delivery Charge</span>
                  <span
                    className={`font-semibold ${
                      summary.shipping === 0 ? "text-green-300" : "text-[#FAF6EF]"
                    }`}
                  >
                    {summary.shipping === 0 ? "Free" : `৳${summary.shipping}`}
                  </span>
                </div>
              </div>

              <div className="my-4 border-t border-dashed border-[#B08946]/40" />

              <div className="flex justify-between items-end">
                <span className="font-semibold text-sm sm:text-base text-[#FAF6EF]/80">
                  Total Amount
                </span>
                <span className="text-3xl sm:text-4xl font-black text-[#B08946] leading-none">
                  ৳{summary.total.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={loading || !accessToken}
                className="w-full mt-5 bg-[#B08946] hover:bg-[#C49A52] text-[#16241F] py-3.5 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-lg active:scale-[0.99]"
              >
                <FontAwesomeIcon
                  icon={
                    loading ? faSpinner : !accessToken ? faLock : faCircleCheck
                  }
                  className={loading ? "animate-spin" : ""}
                />
                {!accessToken
                  ? "Please Login First"
                  : loading
                    ? "Placing Order..."
                    : `Confirm Order (৳${summary.total.toLocaleString()})`}
              </button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#FAF6EF]/50">
                <FontAwesomeIcon icon={faShieldHalved} className="text-[#B08946]" />
                আপনার তথ্য ১০০% নিরাপদ
              </p>
            </div>
          </div>

            </form>
          </div>

          {/* REVIEW */}
          {reviewProduct && (
            <div className="bg-white rounded-3xl border border-[#E4DDCE] p-4 sm:p-7 shadow-sm space-y-4">
              <SectionTitle icon={faStar} title="Ratings & Reviews" />

              {/* Product selector (একাধিক প্রোডাক্ট থাকলে) */}
              {items.length > 1 && (
                <div>
                  <p className="text-[11px] font-bold text-[#16241F]/55 mb-2 uppercase tracking-[0.15em]">
                    Select product to review
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {items.map((item) => (
                      <button
                        type="button"
                        key={item._id}
                        onClick={() => handleSelectReviewProduct(item._id)}
                        className={`flex items-center gap-2 shrink-0 px-2.5 py-1.5 rounded-xl border-2 text-left transition ${
                          reviewProductId === item._id
                            ? "border-[#B08946] bg-[#B08946]/10"
                            : "border-[#E4DDCE] opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover bg-white"
                        />
                        <span className="text-xs font-semibold text-[#16241F] max-w-[110px] truncate">
                          {item.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm text-[#16241F]/60">
                Reviewing:{" "}
                <span className="font-bold text-[#16241F]">
                  {reviewProduct.name}
                </span>
              </p>

              <form
                onSubmit={handleReviewSubmit}
                className="space-y-3 bg-[#FAF6EF] p-4 rounded-2xl border border-[#E4DDCE]"
              >
                <div>
                  <label className={labelCls}>Your Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="p-0.5 focus:outline-none transition-transform hover:scale-125"
                      >
                        <FontAwesomeIcon
                          icon={star <= userRating ? faStar : faStarOutline}
                          className={
                            star <= userRating
                              ? "text-[#B08946] text-xl sm:text-2xl"
                              : "text-[#16241F]/20 text-xl sm:text-2xl"
                          }
                        />
                      </button>
                    ))}
                    <span className="text-sm text-[#16241F]/60 ml-2 font-bold">
                      {userRating}/5
                    </span>
                  </div>
                </div>
                <div>
                  <textarea
                    rows="3"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    maxLength={500}
                    placeholder="Write your honest review here..."
                    className="w-full border border-[#E4DDCE] rounded-xl p-3 text-sm outline-none focus:border-[#B08946] focus:ring-4 focus:ring-[#B08946]/15 bg-white resize-none"
                  />
                  <div className="text-right text-xs text-[#16241F]/40 mt-1">
                    {reviewComment.length}/500
                  </div>
                </div>
                {reviewError && (
                  <p className="text-sm text-red-500 font-medium">
                    {reviewError}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={
                      reviewLoading || !reviewComment.trim() || userRating === 0
                    }
                    className="bg-[#16241F] hover:bg-[#B08946] hover:text-[#16241F] text-[#FAF6EF] text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <FontAwesomeIcon
                      icon={reviewLoading ? faSpinner : faPaperPlane}
                      className={reviewLoading ? "animate-spin" : ""}
                      size="sm"
                    />
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                  {reviewSubmitted && (
                    <span className="text-sm text-green-600 font-semibold flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faCircleCheck} /> Review added!
                    </span>
                  )}
                </div>
              </form>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {reviewsList.length === 0 ? (
                  <p className="text-sm text-[#16241F]/45 text-center py-4 italic">
                    No reviews yet. Be the first to review this product!
                  </p>
                ) : (
                  reviewsList.map((review) => {
                    const reviewer =
                      review.user?.fullname || review.user?.name || "Customer";
                    return (
                      <div
                        key={review._id}
                        className="flex gap-3 p-3 bg-white rounded-2xl border border-[#E4DDCE]"
                      >
                        <span className="w-9 h-9 shrink-0 rounded-full bg-[#16241F] text-[#B08946] font-bold flex items-center justify-center text-sm uppercase">
                          {reviewer.charAt(0)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-[#16241F] truncate">
                              {reviewer}
                            </p>
                            <span className="text-[11px] text-[#16241F]/40 shrink-0">
                              {review.createdAt
                                ? new Date(review.createdAt).toLocaleDateString()
                                : "Just now"}
                            </span>
                          </div>
                          <div className="flex gap-0.5 my-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FontAwesomeIcon
                                key={star}
                                icon={
                                  star <= review.rating ? faStar : faStarOutline
                                }
                                className={
                                  star <= review.rating
                                    ? "text-[#B08946] text-xs"
                                    : "text-[#16241F]/20 text-xs"
                                }
                              />
                            ))}
                          </div>
                          <p className="text-sm text-[#16241F]/75 break-words">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* ---------- RIGHT: Items ---------- */}
        <div className="lg:col-span-5 flex flex-col gap-5 order-1 lg:order-2 lg:sticky lg:top-44">
          {/* PRODUCT LIST */}
          <div className="bg-white rounded-3xl border border-[#E4DDCE] p-4 sm:p-5 shadow-sm">
            <SectionTitle icon={faShoppingBag} title="Your Items" />

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {items.map((item) => {
                const hasDiscount = item.originalPrice > item.price;
                const itemDiscountPercent = hasDiscount
                  ? Math.round(
                      ((item.originalPrice - item.price) / item.originalPrice) *
                        100
                    )
                  : 0;
                const maxQty = item.stock > 0 ? item.stock : 100;

                return (
                  <div
                    key={item._id}
                    className="flex gap-3 p-2.5 sm:p-3 rounded-2xl border border-[#E4DDCE]/70 bg-[#FAF6EF]/60"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#FFFFFF_0%,#FAF6EF_70%,#EFE9DC_100%)] border border-[#E4DDCE]/70 flex items-center justify-center p-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                      {itemDiscountPercent > 0 && (
                        <span className="absolute top-1 left-1 bg-[#B08946] text-[#16241F] text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <FontAwesomeIcon icon={faTag} className="text-[8px]" />
                          {itemDiscountPercent}%
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="text-sm sm:text-base font-bold text-[#16241F] leading-snug line-clamp-2">
                            {item.name}
                          </h2>
                          <button
                            type="button"
                            onClick={() => removeItem(item._id)}
                            aria-label="Remove item"
                            className="shrink-0 w-7 h-7 rounded-full text-[#16241F]/35 hover:bg-red-50 hover:text-red-500 transition flex items-center justify-center"
                          >
                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-extrabold text-[#B08946]">
                            ৳{item.price.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-[#16241F]/40 line-through">
                              ৳{item.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {item.stock > 0 && item.stock < 10 && (
                          <span className="text-[11px] text-orange-500 font-semibold">
                            মাত্র {item.stock} টি বাকি
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-white border border-[#E4DDCE] rounded-full overflow-hidden">
                          <button
                            type="button"
                            onClick={() => decreaseQty(item._id)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                            className="w-8 h-8 text-[#16241F] hover:bg-[#16241F] hover:text-[#B08946] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#16241F] transition"
                          >
                            <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
                          </button>
                          <span className="w-7 text-center font-bold text-sm text-[#16241F]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => increaseQty(item._id)}
                            disabled={item.quantity >= maxQty}
                            aria-label="Increase quantity"
                            className="w-8 h-8 text-[#16241F] hover:bg-[#16241F] hover:text-[#B08946] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#16241F] transition"
                          >
                            <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                          </button>
                        </div>

                        <span className="text-sm sm:text-base font-extrabold text-[#16241F]">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {error.field === "quantity" && (
              <FieldError message={error.message} />
            )}
          </div>


        </div>
      </div>
    </div>
  );
};

export default Checkout;