import React, {
  useState,
  useEffect,
  useContext,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPlus,
  faMinus,
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

import {
  faStar as faStarOutline,
} from "@fortawesome/free-regular-svg-icons";

import axiosInstance from "../../utils/axiosInstance";

import { AuthContext } from "../../context/AuthContext";


const Checkout = () => {

  const { state } = useLocation();
  const navigate = useNavigate();

  const product = state?.product;


  // =========================================================
  // AUTH CONTEXT
  // =========================================================

  const {
    accessToken,
    user,
  } = useContext(AuthContext);


  // =========================================================
  // CHECKOUT FORM
  // =========================================================

  const [formdata, setFormdata] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "",
    transactionId: "",
    mobileNumber: "",
  });


  // =========================================================
  // ERROR
  // =========================================================

  const [error, setError] = useState({
    field: "",
    message: "",
  });


  // =========================================================
  // ORDER
  // =========================================================

  const [count, setCount] = useState(1);

  const [serverMessage, setServerMessage] =
    useState("");

  const [serverMessageType, setServerMessageType] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // =========================================================
  // REVIEW
  // =========================================================

  const [userRating, setUserRating] =
    useState(0);

  const [reviewComment, setReviewComment] =
    useState("");

  const [reviewsList, setReviewsList] =
    useState([]);

  const [reviewLoading, setReviewLoading] =
    useState(false);

  const [reviewSubmitted, setReviewSubmitted] =
    useState(false);

  const [reviewError, setReviewError] =
    useState("");


  // =========================================================
  // IMAGES
  // =========================================================

  const productImages =
    product?.images?.length
      ? product.images
      : product?.image
        ? [product.image]
        : [];


  const [selectedImage, setSelectedImage] =
    useState(product?.image || "");


  // =========================================================
  // SET IMAGE
  // =========================================================

  useEffect(() => {

    if (product?.image) {
      setSelectedImage(product.image);
    }

  }, [product]);


  // =========================================================
  // SET USER NAME
  // =========================================================

  useEffect(() => {

    if (!user) return;

    setFormdata((prev) => ({
      ...prev,

      name:
        prev.name ||
        user.fullname ||
        user.name ||
        "",
    }));

  }, [user]);


  // =========================================================
  // FETCH REVIEWS
  // =========================================================

  useEffect(() => {

    const fetchReviews = async () => {

      if (!product?._id) return;

      try {

        const response =
          await axiosInstance.get(
            `/api/reviews/product/${product._id}`
          );

        setReviewsList(
          response.data.reviews || []
        );

      } catch (error) {

        console.error(
          "Fetch reviews error:",
          error.response?.data ||
          error.message
        );

        setReviewsList([]);

      }
    };


    fetchReviews();

  }, [product?._id]);


  // =========================================================
  // NO PRODUCT
  // =========================================================

  if (!product) {

    return (
      <div className="min-h-screen mt-[88px] flex flex-col items-center justify-center bg-[#FAF6EF] gap-4 px-4 text-center">

        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-2">

          <FontAwesomeIcon
            icon={faExclamationCircle}
            size="2x"
          />

        </div>


        <h2 className="text-xl font-semibold text-[#16241F]">
          No Product Selected
        </h2>


        <p className="text-[#16241F]/70 max-w-md text-sm">
          Please select a product from the shop page
          to proceed to checkout.
        </p>


        <button
          onClick={() => navigate("/shop")}
          className="bg-[#16241F] text-[#FAF6EF] px-6 py-2.5 rounded-xl font-medium hover:bg-[#0F1A16] transition flex items-center gap-2 shadow-md mt-2"
        >

          <FontAwesomeIcon
            icon={faArrowLeft}
            size="sm"
          />

          Return to Shop

        </button>

      </div>
    );
  }


  // =========================================================
  // PRICE
  // =========================================================

  const originalUnitPrice =
    product.originalPrice ||
    Math.round(product.price * 1.2);


  const discountedUnitPrice =
    product.price;


  const discountPercent =
    product.discountPercent ||
    Math.round(
      (
        (originalUnitPrice -
          discountedUnitPrice) /
        originalUnitPrice
      ) * 100
    );


  const deliveryCharge = 100;


  const subtotal =
    discountedUnitPrice * count;


  const totalOriginalSubtotal =
    originalUnitPrice * count;


  const discountAmount =
    totalOriginalSubtotal - subtotal;


  const finalTotal =
    subtotal + deliveryCharge;


  // =========================================================
  // FORM CHANGE
  // =========================================================

  const changeHandler = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));


    if (error.field === name) {

      setError({
        field: "",
        message: "",
      });

    }


    setServerMessage("");
  };


  // =========================================================
  // REVIEW SUBMIT
  // =========================================================

  const handleReviewSubmit = async (e) => {

    e.preventDefault();

    setReviewError("");
    setReviewSubmitted(false);


    // -------------------------------------------------------
    // LOGIN CHECK
    // -------------------------------------------------------

    if (!accessToken) {

      setReviewError(
        "Please login first to submit a review."
      );

      return;
    }


    // -------------------------------------------------------
    // RATING
    // -------------------------------------------------------

    if (
      userRating < 1 ||
      userRating > 5
    ) {

      setReviewError(
        "Please select a rating."
      );

      return;
    }


    // -------------------------------------------------------
    // COMMENT
    // -------------------------------------------------------

    const comment =
      reviewComment.trim();


    if (!comment) {

      setReviewError(
        "Please write your review."
      );

      return;
    }


    if (comment.length > 500) {

      setReviewError(
        "Review cannot be more than 500 characters."
      );

      return;
    }


    try {

      setReviewLoading(true);


      // -----------------------------------------------------
      // REVIEW PAYLOAD
      // -----------------------------------------------------

      const payload = {
        productId: product._id,
        rating: userRating,
        comment: comment,
      };


      // -----------------------------------------------------
      // CREATE REVIEW
      // -----------------------------------------------------

      const response =
        await axiosInstance.post(
          "/api/reviews",
          payload,
          {
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          }
        );


      // -----------------------------------------------------
      // ADD REVIEW TO UI
      // -----------------------------------------------------

      if (response.data.review) {

        setReviewsList((prev) => [
          response.data.review,
          ...prev,
        ]);

      }


      // -----------------------------------------------------
      // RESET
      // -----------------------------------------------------

      setUserRating(0);
      setReviewComment("");

      setReviewSubmitted(true);


      setTimeout(() => {

        setReviewSubmitted(false);

      }, 3000);


    } catch (error) {

      console.error(
        "Review submit error:",
        error.response?.data ||
        error.message
      );


      setReviewError(
        error.response?.data?.message ||
        "Failed to submit review."
      );


    } finally {

      setReviewLoading(false);

    }
  };


  // =========================================================
  // VALIDATE CHECKOUT
  // =========================================================

  const validate = () => {

    // NAME
    if (!formdata.name.trim()) {

      setError({
        field: "name",
        message:
          "Please enter your full name.",
      });

      return false;
    }


    // PHONE
    if (!formdata.phone.trim()) {

      setError({
        field: "phone",
        message:
          "Please enter your phone number.",
      });

      return false;
    }


    if (
      !/^01\d{9}$/.test(
        formdata.phone.trim()
      )
    ) {

      setError({
        field: "phone",
        message:
          "Please enter a valid 11-digit phone number.",
      });

      return false;
    }


    // ADDRESS
    if (!formdata.address.trim()) {

      setError({
        field: "address",
        message:
          "Please enter your delivery address.",
      });

      return false;
    }


    // PAYMENT
    if (!formdata.paymentMethod) {

      setError({
        field: "paymentMethod",
        message:
          "Please select a payment method.",
      });

      return false;
    }


    // BKASH / NAGAD
    if (
      formdata.paymentMethod === "bkash" ||
      formdata.paymentMethod === "nagad"
    ) {

      if (
        !formdata.mobileNumber.trim()
      ) {

        setError({
          field: "mobileNumber",
          message:
            "Please enter your payment mobile number.",
        });

        return false;
      }


      if (
        !/^01\d{9}$/.test(
          formdata.mobileNumber.trim()
        )
      ) {

        setError({
          field: "mobileNumber",
          message:
            "Please enter a valid 11-digit mobile number.",
        });

        return false;
      }


      if (
        !formdata.transactionId.trim()
      ) {

        setError({
          field: "transactionId",
          message:
            "Please enter your Transaction ID.",
        });

        return false;
      }
    }


    // QUANTITY
    if (
      count < 1 ||
      count > (product.stock || 100)
    ) {

      setError({
        field: "quantity",
        message:
          "Invalid product quantity.",
      });

      return false;
    }


    setError({
      field: "",
      message: "",
    });


    return true;
  };


  // =========================================================
  // ORDER SUBMIT
  // =========================================================

  const submitHandler = async (e) => {

    e.preventDefault();


    const isValid = validate();

    if (!isValid) return;


    // -------------------------------------------------------
    // AUTH
    // -------------------------------------------------------

    if (!accessToken) {

      setServerMessage(
        "Please login before placing an order."
      );

      setServerMessageType("error");

      return;
    }


    try {

      setLoading(true);

      setServerMessage("");


      // -----------------------------------------------------
      // ORDER PAYLOAD
      // -----------------------------------------------------

      const payload = {

        productId: product._id,

        quantity: count,

        subtotal: subtotal,

        deliveryCharge: deliveryCharge,

        total: finalTotal,


        customer: {

          name:
            formdata.name.trim(),

          phone:
            formdata.phone.trim(),

          address:
            formdata.address.trim(),

        },


        payment: {

          method:
            formdata.paymentMethod,

          mobileNumber:
            formdata.mobileNumber.trim() ||
            null,

          transactionId:
            formdata.transactionId.trim() ||
            null,

        },

      };


      // -----------------------------------------------------
      // CREATE ORDER
      // -----------------------------------------------------

      const response =
        await axiosInstance.post(
          "/api/orders",
          payload,
          {
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          }
        );


      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

      setServerMessage(
        "Order placed successfully!"
      );

      setServerMessageType("success");


      setTimeout(() => {

        navigate(
          "/order-success",
          {
            state: {
              order:
                response.data.order,
            },
          }
        );

      }, 1000);


    } catch (error) {

      console.error(
        "Order submit error:",
        error.response?.data ||
        error.message
      );


      setServerMessage(
        error.response?.data?.message ||
        "Failed to place order. Please try again."
      );

      setServerMessageType("error");


    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // JSX
  // =========================================================

  return (

    <div className="min-h-screen mt-[77px] sm:mt-[88px] py-4 sm:py-8 px-3 sm:px-4 md:px-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="max-w-6xl mx-auto w-full flex flex-row items-center justify-between mb-3 sm:pb-4 gap-2">

        <div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#16241F] tracking-tight">
            Checkout
          </h1>

        </div>


        <button
          onClick={() => navigate(-1)}
          className="text-xs md:text-sm text-[#B08946] hover:underline font-medium"
        >

          <FontAwesomeIcon
            icon={faArrowLeft}
            size="xs"
          />

          {" "}Back to Product

        </button>

      </div>


      {/* =====================================================
          SERVER MESSAGE
      ===================================================== */}

      {serverMessage && (

        <div className="max-w-6xl mx-auto w-full mb-4 sm:mb-6">

          <div
            className={`p-3 sm:p-4 rounded-xl flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm shadow-sm ${serverMessageType === "success"
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

            <p className="font-medium">
              {serverMessage}
            </p>

          </div>

        </div>

      )}


      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">


        {/* ===================================================
            LEFT
        =================================================== */}

        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5">


          {/* =================================================
              PRODUCT
          ================================================= */}

          <div className="bg-white rounded-2xl border border-[#E4DDCE] p-3.5 sm:p-4 shadow-sm hover:shadow-md transition">


            {/* IMAGE */}

            <div className="relative bg-[#FAF6EF]/60 rounded-xl border border-[#E4DDCE]/60 overflow-hidden p-3 sm:p-4 flex justify-center items-center h-56 sm:h-72 mb-3 sm:mb-4 group">

              <img
                src={selectedImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              />


              {/* STOCK */}

              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1 items-start">

                <span className="bg-[#B08946] text-white text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold px-2 sm:px-2.5 py-0.5 rounded-full shadow-sm">
                  In Stock
                </span>


                {product.stock < 10 &&
                  product.stock > 0 && (

                    <span className="bg-amber-500 text-white text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold px-2 sm:px-2.5 py-0.5 rounded-full shadow-sm">

                      Only {product.stock} Left

                    </span>

                  )}

              </div>


              {/* DISCOUNT */}

              {discountPercent > 0 && (

                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-red-600 text-white text-[11px] sm:text-xs font-extrabold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-md flex items-center gap-1">

                  <FontAwesomeIcon
                    icon={faTag}
                    size="xs"
                  />

                  <span>
                    {discountPercent}% OFF
                  </span>

                </div>

              )}

            </div>


            {/* THUMBNAILS */}

            {productImages.length > 0 && (

              <div className="mb-4">

                <p className="text-[11px] font-medium text-[#16241F]/60 mb-1.5 uppercase tracking-wider">
                  Select Image View
                </p>


                <div className="flex gap-2 overflow-x-auto pb-1">

                  {productImages.map(
                    (img, idx) => (

                      <button
                        type="button"
                        key={idx}
                        onClick={() =>
                          setSelectedImage(img)
                        }
                        className={`w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 bg-[#FAF6EF]/30 transition ${selectedImage === img
                            ? "border-[#B08946] ring-2 ring-[#B08946]/20"
                            : "border-[#E4DDCE] opacity-70 hover:opacity-100"
                          }`}
                      >

                        <img
                          src={img}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                      </button>

                    )
                  )}

                </div>

              </div>

            )}


            {/* PRODUCT INFO */}

            <div className="space-y-2.5 sm:space-y-3 pt-3 border-t border-[#E4DDCE]/60">

              <div className="flex justify-between items-start gap-2">

                <div>

                  <h2 className="text-base sm:text-lg font-bold text-[#16241F] leading-snug">
                    {product.name}
                  </h2>


                  {product._id && (

                    <span className="text-[11px] sm:text-xs text-[#16241F]/50">

                      SKU: #
                      {product._id
                        .slice(-6)
                        .toUpperCase()}

                    </span>

                  )}

                </div>


                <div className="text-right">

                  <div className="flex items-center gap-1.5 sm:gap-2 justify-end">

                    {originalUnitPrice >
                      discountedUnitPrice && (

                        <span className="text-xs sm:text-sm text-[#16241F]/40 line-through font-medium">

                          ৳{originalUnitPrice*count}

                        </span>


                      )}


                    <span className="text-lg sm:text-xl font-extrabold text-[#16241F]">

                      ৳{discountedUnitPrice*count}

                    </span>

                  </div>


                  {discountPercent > 0 && (

                    <span className="text-[10px] sm:text-[11px] text-green-600 font-semibold block">

                      You Save ৳
                      {(originalUnitPrice -
                        discountedUnitPrice)*count}

                    </span>

                  )}

                </div>

              </div>


              {product.description && (

                <p className="text-xs text-[#16241F]/70 leading-relaxed line-clamp-2">

                  {product.description}

                </p>

              )}


              {/* QUANTITY */}

              <div className="pt-1.5 sm:pt-2">

                <div className="flex justify-between items-center py-1.5 sm:py-2 px-2.5 sm:px-3 bg-[#FAF6EF] rounded-xl border border-[#E4DDCE]">

                  <span className="text-[11px] sm:text-xs font-semibold uppercase text-[#16241F]/80 tracking-wider">
                    Quantity
                  </span>


                  <div className="flex items-center bg-white border border-[#E4DDCE] rounded-lg overflow-hidden shadow-sm">

                    <button
                      type="button"
                      onClick={() =>
                        setCount((prev) =>
                          prev > 1
                            ? prev - 1
                            : 1
                        )
                      }
                      className="px-2.5 sm:px-3 py-1 text-[#16241F] hover:bg-[#FAF6EF] transition"
                    >

                      <FontAwesomeIcon
                        icon={faMinus}
                        size="xs"
                      />

                    </button>


                    <span className="px-3 sm:px-4 font-bold text-xs sm:text-sm text-[#16241F]">
                      {count}
                    </span>


                    <button
                      type="button"
                      onClick={() =>
                        setCount((prev) =>
                          prev <
                            (product.stock || 100)
                            ? prev + 1
                            : prev
                        )
                      }
                      className="px-2.5 sm:px-3 py-1 text-[#16241F] hover:bg-[#FAF6EF] transition"
                    >

                      <FontAwesomeIcon
                        icon={faPlus}
                        size="xs"
                      />

                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              REVIEW
          ================================================= */}

          <div className="bg-white rounded-2xl border border-[#E4DDCE] p-4 sm:p-5 shadow-sm space-y-4">

            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#16241F]/80 pb-2 border-b border-[#E4DDCE]">

              Ratings & Reviews

            </h3>


            {/* REVIEW FORM */}

            <form
              onSubmit={handleReviewSubmit}
              className="space-y-3 bg-[#FAF6EF]/50 p-3 rounded-xl border border-[#E4DDCE]/60"
            >

              {/* RATING */}

              <div>

                <label className="block text-xs font-semibold text-[#16241F]/80 mb-1">

                  Your Rating

                </label>


                <div className="flex items-center gap-1">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (

                      <button
                        type="button"
                        key={star}
                        onClick={() =>
                          setUserRating(star)
                        }
                        className="p-0.5 focus:outline-none transition-transform hover:scale-110"
                      >

                        <FontAwesomeIcon
                          icon={
                            star <= userRating
                              ? faStar
                              : faStarOutline
                          }
                          className={
                            star <= userRating
                              ? "text-amber-500 text-base sm:text-lg"
                              : "text-gray-300 text-base sm:text-lg"
                          }
                        />

                      </button>

                    )
                  )}


                  <span className="text-xs text-[#16241F]/60 ml-2 font-medium">

                    {userRating}/5

                  </span>

                </div>

              </div>


              {/* COMMENT */}

              <div>

                <textarea
                  rows="3"
                  value={reviewComment}
                  onChange={(e) =>
                    setReviewComment(
                      e.target.value
                    )
                  }
                  maxLength={500}
                  placeholder="Write your honest review here..."
                  className="w-full border border-[#E4DDCE] rounded-lg p-2.5 text-xs outline-none focus:border-[#B08946] bg-white resize-none"
                />


                <div className="text-right text-[10px] text-gray-400 mt-1">

                  {reviewComment.length}/500

                </div>

              </div>


              {/* ERROR */}

              {reviewError && (

                <p className="text-xs text-red-500 font-medium">

                  {reviewError}

                </p>

              )}


              {/* BUTTON */}

              <div className="flex items-center justify-between">

                <button
                  type="submit"
                  disabled={
                    reviewLoading ||
                    !reviewComment.trim() ||
                    userRating === 0
                  }
                  className="bg-[#B08946] hover:bg-[#967339] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition"
                >

                  <FontAwesomeIcon
                    icon={
                      reviewLoading
                        ? faSpinner
                        : faPaperPlane
                    }
                    className={
                      reviewLoading
                        ? "animate-spin"
                        : ""
                    }
                    size="xs"
                  />


                  {reviewLoading
                    ? "Submitting..."
                    : "Submit Review"}

                </button>


                {reviewSubmitted && (

                  <span className="text-xs text-green-600 font-medium">

                    Review added!

                  </span>

                )}

              </div>

            </form>


            {/* REVIEW LIST */}

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">

              {reviewsList.length === 0 ? (

                <p className="text-xs text-[#16241F]/50 text-center py-2 italic">

                  No reviews yet. Be the first to review this product!

                </p>

              ) : (

                reviewsList.map((review) => (

                  <div
                    key={review._id}
                    className="p-2.5 bg-[#FAF6EF]/30 rounded-lg border border-[#E4DDCE]/40 space-y-1"
                  >

                    {/* STARS */}

                    <div className="flex items-center justify-between">

                      <div className="flex gap-0.5">

                        {[1, 2, 3, 4, 5].map(
                          (star) => (

                            <FontAwesomeIcon
                              key={star}
                              icon={
                                star <= review.rating
                                  ? faStar
                                  : faStarOutline
                              }
                              className={
                                star <= review.rating
                                  ? "text-amber-500 text-xs"
                                  : "text-gray-300 text-xs"
                              }
                            />

                          )
                        )}

                      </div>


                      <span className="text-[10px] text-[#16241F]/40">

                        {review.createdAt
                          ? new Date(
                            review.createdAt
                          ).toLocaleDateString()
                          : "Just now"}

                      </span>

                    </div>


                    {/* USER */}

                    <p className="text-xs font-semibold text-[#16241F]">

                      {review.user?.fullname ||
                        review.user?.name ||
                        "Customer"}

                    </p>


                    {/* COMMENT */}

                    <p className="text-xs text-[#16241F]/80">

                      {review.comment}

                    </p>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>


        {/* ===================================================
            RIGHT
        =================================================== */}

        <div className="lg:col-span-7 flex flex-col gap-5">


          {/* =================================================
              SHIPPING + PAYMENT
          ================================================= */}

          <div className="bg-white rounded-2xl border border-[#E4DDCE] shadow-sm p-3.5 sm:p-6 md:p-8">

            <div className="flex items-center gap-2 mb-3.5 sm:mb-6 pb-2.5 sm:pb-3 border-b border-[#E4DDCE]">

              <FontAwesomeIcon
                icon={faShoppingBag}
                className="text-[#B08946]"
              />


              <h3 className="text-base sm:text-lg font-bold text-[#16241F]">

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

                <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#16241F]/80 mb-1 sm:mb-1.5">

                  Full Name{" "}

                  <span className="text-red-500">
                    *
                  </span>

                </label>


                <input
                  type="text"
                  name="name"
                  value={formdata.name}
                  onChange={changeHandler}
                  placeholder="e.g. Md. Shimul"
                  className={`w-full border rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm outline-none transition ${error.field === "name"
                      ? "border-red-500 bg-red-50/20 ring-1 ring-red-500"
                      : "border-[#E4DDCE] bg-[#FAF6EF]/30 focus:border-[#B08946] focus:ring-2 focus:ring-[#B08946]/20"
                    }`}
                />


                {error.field === "name" && (

                  <p className="text-xs text-red-500 mt-1">

                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                    />

                    {" "}
                    {error.message}

                  </p>

                )}

              </div>


              {/* PHONE */}

              <div>

                <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#16241F]/80 mb-1 sm:mb-1.5">

                  Phone Number{" "}

                  <span className="text-red-500">
                    *
                  </span>

                </label>


                <div className="relative">

                  <span className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-[#16241F]/50 text-xs sm:text-sm font-medium">

                    +880

                  </span>


                  <input
                    type="tel"
                    name="phone"
                    value={formdata.phone}
                    onChange={changeHandler}
                    placeholder="01XXXXXXXXX"
                    maxLength={11}
                    className={`w-full border rounded-xl pl-14 sm:pl-16 pr-3.5 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm outline-none transition ${error.field === "phone"
                        ? "border-red-500 bg-red-50/20 ring-1 ring-red-500"
                        : "border-[#E4DDCE] bg-[#FAF6EF]/30 focus:border-[#B08946] focus:ring-2 focus:ring-[#B08946]/20"
                      }`}
                  />

                </div>


                {error.field === "phone" && (

                  <p className="text-xs text-red-500 mt-1">

                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                    />

                    {" "}
                    {error.message}

                  </p>

                )}

              </div>


              {/* ADDRESS */}

              <div>

                <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#16241F]/80 mb-1 sm:mb-1.5">

                  Delivery Address{" "}

                  <span className="text-red-500">
                    *
                  </span>

                </label>


                <textarea
                  rows="3"
                  name="address"
                  value={formdata.address}
                  onChange={changeHandler}
                  placeholder="House no, Road no, Area, Thana, District..."
                  className={`w-full border rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm outline-none resize-none transition ${error.field === "address"
                      ? "border-red-500 bg-red-50/20 ring-1 ring-red-500"
                      : "border-[#E4DDCE] bg-[#FAF6EF]/30 focus:border-[#B08946] focus:ring-2 focus:ring-[#B08946]/20"
                    }`}
                />


                {error.field === "address" && (

                  <p className="text-xs text-red-500 mt-1">

                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                    />

                    {" "}
                    {error.message}

                  </p>

                )}

              </div>


              {/* PAYMENT */}

              <div>

                <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#16241F]/80 mb-1.5 sm:mb-2">

                  Payment Method{" "}

                  <span className="text-red-500">
                    *
                  </span>

                </label>


                <div className="grid grid-cols-1 gap-2 sm:gap-2.5">

                  {[
                    "bkash",
                    "nagad",
                    "cod",
                  ].map((method) => (

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


                          if (
                            error.field ===
                            "paymentMethod"
                          ) {

                            setError({
                              field: "",
                              message: "",
                            });

                          }


                          setServerMessage("");

                        }}
                      >

                        <div className="flex items-center gap-2.5 sm:gap-3">

                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method}
                            checked={
                              formdata.paymentMethod ===
                              method
                            }
                            onChange={changeHandler}
                            className="accent-[#B08946] w-3.5 h-3.5 sm:w-4 sm:h-4"
                          />


                          <div className="flex items-center gap-1.5 sm:gap-2">

                            <FontAwesomeIcon
                              icon={
                                method === "bkash" ||
                                  method === "nagad"
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


                            <span className="font-semibold text-xs sm:text-sm text-[#16241F] capitalize">

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


                      {/* BKASH / NAGAD */}

                      {(method === "bkash" ||
                        method === "nagad") &&
                        formdata.paymentMethod === method && (

                          <div className="mt-2 sm:mt-2.5 pl-2 sm:pl-4 pr-1">

                            <div className="p-3 sm:p-4 bg-[#FAF6EF] rounded-xl border border-[#E4DDCE] space-y-2.5 sm:space-y-3">

                              {/* MOBILE */}

                              <div>

                                <label className="block text-[11px] sm:text-xs font-medium text-[#16241F]/80 mb-1">

                                  Mobile Number{" "}

                                  <span className="text-red-500">
                                    *
                                  </span>

                                </label>


                                <input
                                  type="tel"
                                  name="mobileNumber"
                                  value={
                                    formdata.mobileNumber
                                  }
                                  onChange={changeHandler}
                                  placeholder="01XXXXXXXXX"
                                  maxLength={11}
                                  className={`w-full border rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none transition ${error.field === "mobileNumber"
                                      ? "border-red-500"
                                      : "border-[#E4DDCE] bg-white focus:border-[#B08946]"
                                    }`}
                                />


                                {error.field ===
                                  "mobileNumber" && (

                                    <p className="text-xs text-red-500 mt-1">

                                      {error.message}

                                    </p>

                                  )}

                              </div>


                              {/* TRANSACTION */}

                              <div>

                                <label className="block text-[11px] sm:text-xs font-medium text-[#16241F]/80 mb-1">

                                  Transaction ID{" "}

                                  <span className="text-red-500">
                                    *
                                  </span>

                                </label>


                                <input
                                  type="text"
                                  name="transactionId"
                                  value={
                                    formdata.transactionId
                                  }
                                  onChange={changeHandler}
                                  placeholder="Enter Transaction ID"
                                  className={`w-full border rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none transition ${error.field === "transactionId"
                                      ? "border-red-500"
                                      : "border-[#E4DDCE] bg-white focus:border-[#B08946]"
                                    }`}
                                />


                                {error.field ===
                                  "transactionId" && (

                                    <p className="text-xs text-red-500 mt-1">

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

                  <p className="text-xs text-red-500 mt-1">

                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                    />

                    {" "}
                    {error.message}

                  </p>

                )}

              </div>

            </form>

          </div>


          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div className="bg-white rounded-2xl border border-[#E4DDCE] p-4 sm:p-5 shadow-sm space-y-2.5 sm:space-y-3">

            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#16241F]/80 pb-2 border-b border-[#E4DDCE]">

              Order Summary

            </h3>


            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">

              <div className="flex justify-between text-[#16241F]/70">

                <span>
                  Original Price ({count}{" "}
                  {count > 1 ? "items" : "item"})
                </span>


                <span className="font-medium text-[#16241F]/60 line-through">

                  ৳{totalOriginalSubtotal}

                </span>

              </div>


              {discountAmount > 0 && (

                <div className="flex justify-between text-green-700 bg-green-50 p-1.5 sm:p-2 rounded-lg border border-green-100">

                  <span className="font-medium">

                    Total Discount (
                    {discountPercent}%)

                  </span>


                  <span className="font-bold">

                    -৳{discountAmount}

                  </span>

                </div>

              )}


              <div className="flex justify-between text-[#16241F]/70">

                <span>
                  Subtotal
                </span>


                <span className="font-medium text-[#16241F]">

                  ৳{subtotal}

                </span>

              </div>


              <div className="flex justify-between text-[#16241F]/70">

                <span>
                  Delivery Charge
                </span>


                <span className="font-medium text-[#16241F]">

                  ৳{deliveryCharge}

                </span>

              </div>

            </div>


            {/* TOTAL */}

            <div className="border-t border-[#E4DDCE] pt-2.5 sm:pt-3 flex justify-between items-baseline">

              <span className="font-bold text-xs sm:text-sm text-[#16241F]">

                Total Amount

              </span>


              <span className="text-xl sm:text-2xl font-black text-[#16241F]">

                ৳{finalTotal}

              </span>

            </div>


            {/* ORDER BUTTON */}

            <button
              type="submit"
              form="checkout-form"
              disabled={
                loading ||
                !accessToken
              }
              className="w-full bg-[#16241F] hover:bg-[#0F1A16] text-[#FAF6EF] py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition duration-200 mt-4 shadow-md active:scale-[0.99]"
            >

              <FontAwesomeIcon
                icon={
                  loading
                    ? faSpinner
                    : faCircleCheck
                }
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />


              {!accessToken
                ? "Please Login First"
                : loading
                  ? "Placing Order..."
                  : `Confirm Order (৳${finalTotal})`}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};


export default Checkout;