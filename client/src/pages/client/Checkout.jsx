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
      <div className="min-h-screen mt-[88px] flex flex-col items-center justify-center bg-[#FAF6EF] gap-4 px-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-2">
          <FontAwesomeIcon icon={faExclamationCircle} size="2x" />
        </div>
        <h2 className="text-xl font-semibold text-[#16241F]">
          No Product Selected
        </h2>
        <p className="text-[#16241F]/70 max-w-md text-sm">
          Please select a product from the shop page to proceed to checkout.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-[#16241F] text-[#FAF6EF] px-6 py-2.5 rounded-xl font-medium hover:bg-[#0F1A16] transition flex items-center gap-2 shadow-md mt-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="sm" />
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[45px] sm:mt-[50px] py-4 sm:py-8 px-3 sm:px-4 md:px-8">
      {/* HEADER */}
      <div className="w-full max-w-none mx-auto flex flex-row items-center justify-between mb-3 sm:pb-4 gap-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#16241F] tracking-tight">
          Checkout
          <span className="ml-2 text-sm font-medium text-[#16241F]/50">
            ({items.length} product{items.length > 1 ? "s" : ""})
          </span>
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm md:text-base text-[#B08946] hover:underline font-medium flex items-center gap-1.5"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="sm" />
          Back
        </button>
      </div>

      {/* SERVER MESSAGE */}
      {serverMessage && (
        <div className="w-full max-w-none mx-auto mb-4 sm:mb-6">
          <div
            className={`p-3 sm:p-4 rounded-xl flex items-center gap-2.5 sm:gap-3 text-sm sm:text-base shadow-sm ${serverMessageType === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-700"
              }`}
          >
            <FontAwesomeIcon
              icon={
                serverMessageType === "success"
                  ? faCircleCheck
                  : faExclamationCircle
              }
            />
            <p className="font-medium">{serverMessage}</p>
          </div>
        </div>
      )}

      {/* MAIN */}
      <div className="w-full max-w-none mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
        {/* LEFT */}
        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5">
          {/* PRODUCT LIST */}
          <div className="bg-white rounded-2xl border border-[#E4DDCE] p-3.5 sm:p-4 shadow-sm space-y-3">
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#16241F]/80 pb-2 border-b border-[#E4DDCE]">
              Your Items
            </h3>

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
                  className="flex gap-3 p-2.5 sm:p-3 rounded-xl border border-[#E4DDCE]/60 bg-[#FAF6EF]/40"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-white border border-[#E4DDCE]/60 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                    {itemDiscountPercent > 0 && (
                      <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <FontAwesomeIcon icon={faTag} className="text-[8px]" />
                        {itemDiscountPercent}%
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-[#16241F] leading-snug line-clamp-2">
                        {item.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm sm:text-base font-extrabold text-[#16241F]">
                          ৳{item.price.toLocaleString()}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-[#16241F]/40 line-through">
                            ৳{item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {item.stock > 0 && item.stock < 10 && (
                        <span className="text-[11px] text-amber-600 font-semibold">
                          Only {item.stock} left
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-white border border-[#E4DDCE] rounded-lg overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() => decreaseQty(item._id)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                          className="px-2.5 py-1 text-[#16241F] hover:bg-[#FAF6EF] disabled:opacity-30 transition"
                        >
                          <FontAwesomeIcon icon={faMinus} size="xs" />
                        </button>
                        <span className="px-3 font-bold text-sm text-[#16241F]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQty(item._id)}
                          disabled={item.quantity >= maxQty}
                          aria-label="Increase quantity"
                          className="px-2.5 py-1 text-[#16241F] hover:bg-[#FAF6EF] disabled:opacity-30 transition"
                        >
                          <FontAwesomeIcon icon={faPlus} size="xs" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#16241F]">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item._id)}
                          aria-label="Remove item"
                          className="text-red-500 hover:text-red-600 transition"
                        >
                          <FontAwesomeIcon icon={faTrash} size="sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {error.field === "quantity" && (
              <p className="text-sm text-red-500">
                <FontAwesomeIcon icon={faExclamationCircle} /> {error.message}
              </p>
            )}
          </div>

          {/* REVIEW (সবসময় দেখাবে) */}
          {reviewProduct && (
            <div className="bg-white rounded-2xl border border-[#E4DDCE] p-4 sm:p-5 shadow-sm space-y-4">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#16241F]/80 pb-2 border-b border-[#E4DDCE]">
                Ratings & Reviews
              </h3>

              {/* Product selector (একাধিক প্রোডাক্ট থাকলে) */}
              {items.length > 1 && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-[#16241F]/60 mb-1.5 uppercase tracking-wider">
                    Select product to review
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {items.map((item) => (
                      <button
                        type="button"
                        key={item._id}
                        onClick={() => handleSelectReviewProduct(item._id)}
                        className={`flex items-center gap-2 shrink-0 px-2 py-1.5 rounded-lg border-2 text-left transition ${reviewProductId === item._id
                            ? "border-[#B08946] bg-[#B08946]/10"
                            : "border-[#E4DDCE] opacity-70 hover:opacity-100"
                          }`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded object-cover bg-white"
                        />
                        <span className="text-xs font-semibold text-[#16241F] max-w-[110px] truncate">
                          {item.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm text-[#16241F]/70">
                Reviewing:{" "}
                <span className="font-semibold text-[#16241F]">
                  {reviewProduct.name}
                </span>
              </p>

              <form
                onSubmit={handleReviewSubmit}
                className="space-y-3 bg-[#FAF6EF]/50 p-3 rounded-xl border border-[#E4DDCE]/60"
              >
                <div>
                  <label className="block text-sm font-semibold text-[#16241F]/80 mb-1">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="p-0.5 focus:outline-none transition-transform hover:scale-110"
                      >
                        <FontAwesomeIcon
                          icon={star <= userRating ? faStar : faStarOutline}
                          className={
                            star <= userRating
                              ? "text-amber-500 text-lg sm:text-xl"
                              : "text-gray-300 text-lg sm:text-xl"
                          }
                        />
                      </button>
                    ))}
                    <span className="text-sm text-[#16241F]/60 ml-2 font-medium">
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
                    className="w-full border border-[#E4DDCE] rounded-lg p-2.5 text-sm outline-none focus:border-[#B08946] bg-white resize-none"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
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
                    className="bg-[#B08946] hover:bg-[#967339] text-white text-sm font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition"
                  >
                    <FontAwesomeIcon
                      icon={reviewLoading ? faSpinner : faPaperPlane}
                      className={reviewLoading ? "animate-spin" : ""}
                      size="sm"
                    />
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                  {reviewSubmitted && (
                    <span className="text-sm text-green-600 font-medium">
                      Review added!
                    </span>
                  )}
                </div>
              </form>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {reviewsList.length === 0 ? (
                  <p className="text-sm text-[#16241F]/50 text-center py-2 italic">
                    No reviews yet. Be the first to review this product!
                  </p>
                ) : (
                  reviewsList.map((review) => (
                    <div
                      key={review._id}
                      className="p-2.5 bg-[#FAF6EF]/30 rounded-lg border border-[#E4DDCE]/40 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FontAwesomeIcon
                              key={star}
                              icon={
                                star <= review.rating ? faStar : faStarOutline
                              }
                              className={
                                star <= review.rating
                                  ? "text-amber-500 text-sm"
                                  : "text-gray-300 text-sm"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[#16241F]/40">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : "Just now"}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#16241F]">
                        {review.user?.fullname || review.user?.name || "Customer"}
                      </p>
                      <p className="text-sm text-[#16241F]/80">
                        {review.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* SHIPPING + PAYMENT */}
          <div className="bg-white rounded-2xl border border-[#E4DDCE] shadow-sm p-3.5 sm:p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3.5 sm:mb-6 pb-2.5 sm:pb-3 border-b border-[#E4DDCE]">
              <FontAwesomeIcon icon={faShoppingBag} className="text-[#B08946]" />
              <h3 className="text-lg sm:text-xl font-bold text-[#16241F]">
                Shipping & Payment Details
              </h3>
            </div>
            <form
              className="space-y-3.5 sm:space-y-5"
              onSubmit={submitHandler}
              id="checkout-form"
            >
              {/* NAME */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#16241F]/80 mb-1 sm:mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formdata.name}
                  onChange={changeHandler}
                  placeholder="Enter your name"
                  className={`w-full border rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base outline-none transition ${error.field === "name"
                      ? "border-red-500 bg-red-50/20 ring-1 ring-red-500"
                      : "border-[#E4DDCE] bg-[#FAF6EF]/30 focus:border-[#B08946] focus:ring-2 focus:ring-[#B08946]/20"
                    }`}
                />
                {error.field === "name" && (
                  <p className="text-sm text-red-500 mt-1">
                    <FontAwesomeIcon icon={faExclamationCircle} />{" "}
                    {error.message}
                  </p>
                )}
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#16241F]/80 mb-1 sm:mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-[#16241F]/50 text-sm sm:text-base font-medium">
                    +880
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formdata.phone}
                    onChange={changeHandler}
                    placeholder="01XXXXXXXXX"
                    maxLength={11}
                    className={`w-full border rounded-xl pl-14 sm:pl-16 pr-3.5 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base outline-none transition ${error.field === "phone"
                        ? "border-red-500 bg-red-50/20 ring-1 ring-red-500"
                        : "border-[#E4DDCE] bg-[#FAF6EF]/30 focus:border-[#B08946] focus:ring-2 focus:ring-[#B08946]/20"
                      }`}
                  />
                </div>
                {error.field === "phone" && (
                  <p className="text-sm text-red-500 mt-1">
                    <FontAwesomeIcon icon={faExclamationCircle} />{" "}
                    {error.message}
                  </p>
                )}
              </div>

              {/* ADDRESS */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#16241F]/80 mb-1 sm:mb-1.5">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  name="address"
                  value={formdata.address}
                  onChange={changeHandler}
                  placeholder="House no, Road no, Area, Thana, District..."
                  className={`w-full border rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base outline-none resize-none transition ${error.field === "address"
                      ? "border-red-500 bg-red-50/20 ring-1 ring-red-500"
                      : "border-[#E4DDCE] bg-[#FAF6EF]/30 focus:border-[#B08946] focus:ring-2 focus:ring-[#B08946]/20"
                    }`}
                />
                {error.field === "address" && (
                  <p className="text-sm text-red-500 mt-1">
                    <FontAwesomeIcon icon={faExclamationCircle} />{" "}
                    {error.message}
                  </p>
                )}
              </div>

              {/* PAYMENT */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#16241F]/80 mb-1.5 sm:mb-2">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
                  {["bkash", "nagad", "cod"].map((method) => (
                    <div key={method}>
                      <div
                        className={`flex items-center justify-between p-2.5 sm:p-3.5 border rounded-xl cursor-pointer transition ${formdata.paymentMethod === method
                            ? "border-[#B08946] bg-[#B08946]/10 ring-1 ring-[#B08946]"
                            : error.field === "paymentMethod"
                              ? "border-red-300 hover:border-red-400 bg-red-50/10"
                              : "border-[#E4DDCE] hover:border-[#B08946]/50 bg-[#FAF6EF]/20"
                          }`}
                        onClick={() => {
                          setFormdata((prev) => ({
                            ...prev,
                            paymentMethod: method,
                          }));
                          if (error.field === "paymentMethod") {
                            setError({ field: "", message: "" });
                          }
                          setServerMessage("");
                        }}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method}
                            checked={formdata.paymentMethod === method}
                            onChange={changeHandler}
                            className="accent-[#B08946] w-4 h-4"
                          />
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <FontAwesomeIcon
                              icon={
                                method === "bkash" || method === "nagad"
                                  ? faMobileAlt
                                  : faStore
                              }
                              className={
                                method === "bkash"
                                  ? "text-pink-600"
                                  : method === "nagad"
                                    ? "text-orange-600"
                                    : "text-emerald-700"
                              }
                            />
                            <span className="font-semibold text-sm sm:text-base text-[#16241F] capitalize">
                              {method === "cod"
                                ? "Cash on Delivery (COD)"
                                : method}
                            </span>
                          </div>
                        </div>
                        {formdata.paymentMethod === method && (
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="text-[#B08946]"
                          />
                        )}
                      </div>

                      {(method === "bkash" || method === "nagad") &&
                        formdata.paymentMethod === method && (
                          <div className="mt-2 sm:mt-2.5 pl-2 sm:pl-4 pr-1">
                            <div className="p-3 sm:p-4 bg-[#FAF6EF] rounded-xl border border-[#E4DDCE] space-y-2.5 sm:space-y-3">
                              <div>
                                <label className="block text-xs sm:text-sm font-medium text-[#16241F]/80 mb-1">
                                  Mobile Number{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="tel"
                                  name="mobileNumber"
                                  value={formdata.mobileNumber}
                                  onChange={changeHandler}
                                  placeholder="01XXXXXXXXX"
                                  maxLength={11}
                                  className={`w-full border rounded-lg px-3 py-1.5 sm:py-2 text-sm sm:text-base outline-none transition ${error.field === "mobileNumber"
                                      ? "border-red-500"
                                      : "border-[#E4DDCE] bg-white focus:border-[#B08946]"
                                    }`}
                                />
                                {error.field === "mobileNumber" && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {error.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs sm:text-sm font-medium text-[#16241F]/80 mb-1">
                                  Transaction ID{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="transactionId"
                                  value={formdata.transactionId}
                                  onChange={changeHandler}
                                  placeholder="Enter Transaction ID"
                                  className={`w-full border rounded-lg px-3 py-1.5 sm:py-2 text-sm sm:text-base outline-none transition ${error.field === "transactionId"
                                      ? "border-red-500"
                                      : "border-[#E4DDCE] bg-white focus:border-[#B08946]"
                                    }`}
                                />
                                {error.field === "transactionId" && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {error.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
                {error.field === "paymentMethod" && (
                  <p className="text-sm text-red-500 mt-1">
                    <FontAwesomeIcon icon={faExclamationCircle} />{" "}
                    {error.message}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-white rounded-2xl border border-[#E4DDCE] p-4 sm:p-5 shadow-sm space-y-2.5 sm:space-y-3">
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#16241F]/80 pb-2 border-b border-[#E4DDCE]">
              Order Summary
            </h3>
            <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              {summary.discount > 0 && (
                <>
                  <div className="flex justify-between text-[#16241F]/70">
                    <span>
                      Original Price ({summary.totalQty}{" "}
                      {summary.totalQty > 1 ? "items" : "item"})
                    </span>
                    <span className="font-medium text-[#16241F]/60 line-through">
                      ৳{summary.originalTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-700 bg-green-50 p-1.5 sm:p-2 rounded-lg border border-green-100">
                    <span className="font-medium">
                      Total Discount ({summary.discountPercent}%)
                    </span>
                    <span className="font-bold">
                      -৳{summary.discount.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-[#16241F]/70">
                <span>
                  Subtotal ({summary.totalQty}{" "}
                  {summary.totalQty > 1 ? "items" : "item"})
                </span>
                <span className="font-medium text-[#16241F]">
                  ৳{summary.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#16241F]/70">
                <span>Delivery Charge</span>
                <span
                  className={`font-medium ${summary.shipping === 0 ? "text-green-600" : "text-[#16241F]"
                    }`}
                >
                  {summary.shipping === 0 ? "Free" : `৳${summary.shipping}`}
                </span>
              </div>
            </div>
            <div className="border-t border-[#E4DDCE] pt-2.5 sm:pt-3 flex justify-between items-baseline">
              <span className="font-bold text-sm sm:text-base text-[#16241F]">
                Total Amount
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#16241F]">
                ৳{summary.total.toLocaleString()}
              </span>
            </div>
            <button
              type="submit"
              form="checkout-form"
              disabled={loading || !accessToken}
              className="w-full bg-[#16241F] hover:bg-[#0F1A16] text-[#FAF6EF] py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-60 transition duration-200 mt-4 shadow-md active:scale-[0.99]"
            >
              <FontAwesomeIcon
                icon={loading ? faSpinner : faCircleCheck}
                className={loading ? "animate-spin" : ""}
              />
              {!accessToken
                ? "Please Login First"
                : loading
                  ? "Placing Order..."
                  : `Confirm Order (৳${summary.total.toLocaleString()})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;