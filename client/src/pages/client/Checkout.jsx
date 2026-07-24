import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faLock,
  faTruck,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

const Checkout = () => {
  const [formdata,setFormdata]=useState({
    name:'',
    phone:'',
    address:'',



  })
  const changeHandler=(e)=>{
    setFormdata((prev)=>({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  const submitHandler=(e)=>{
    e.preventDefault();

  }
  const [count, setCount] = useState(1);
  const { state } = useLocation();
  const product = state?.product;

  if (!product) {
    return (
      <div
        className="flex justify-center items-center h-[60vh] bg-[#FAF6EF]"
        style={{ fontFamily: FONT_BODY }}
      >
        <h2 className="text-2xl font-semibold text-red-500">
          Product not found!
        </h2>
      </div>
    );
  }

  const { name, image, price, stock, description } = product;
  const deliveryCharge = 60;
  const subtotal = price * count;
  const total = subtotal + deliveryCharge;

  return (
    <div
      className="min-h-screen bg-[#FAF6EF] py-10 px-4"
      style={{ fontFamily: FONT_BODY }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Shipping Information */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E4DDCE] p-8 sm:p-10">
            <h2
              className="text-3xl mb-1 text-[#16241F]"
              style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}
            >
              Shipping details
            </h2>
            <p className="text-[#16241F]/50 mb-8 text-sm">
              We'll use this to get your order to you.
            </p>

            <form className="space-y-6" onSubmit={submitHandler}>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-[#16241F]"
                >
                  Full name
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  onChange={changeHandler}
                  placeholder="e.g. Md. Shimul"
                  className="w-full border border-[#E4DDCE] bg-[#FAF6EF]/40 rounded-lg px-4 py-3 text-[#16241F] placeholder:text-[#16241F]/30 outline-none focus:ring-2 focus:ring-[#B08946] focus:border-[#B08946] transition"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-[#16241F]"
                >
                  Phone number
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="01XXXXXXXXX"
                  className="w-full border border-[#E4DDCE] bg-[#FAF6EF]/40 rounded-lg px-4 py-3 text-[#16241F] placeholder:text-[#16241F]/30 outline-none focus:ring-2 focus:ring-[#B08946] focus:border-[#B08946] transition"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block mb-2 text-sm font-medium text-[#16241F]"
                >
                  Delivery address
                </label>
                <textarea
                  rows="4"
                  name="address"
                  placeholder="House no, Road no, Area, Thana, District"
                  className="w-full border border-[#E4DDCE] bg-[#FAF6EF]/40 rounded-lg px-4 py-3 text-[#16241F] placeholder:text-[#16241F]/30 outline-none focus:ring-2 focus:ring-[#B08946] focus:border-[#B08946] transition resize-none"
                />
              </div>
              <div className="flex flex-col">
                <h2>Payment method </h2>
                <div className="flex flex-col">
                  <div>
                    <input type="radio" name="payment" required  />
                    <label htmlFor="bkash">Bkash</label>
                  </div>
                  <div>
                    <input type="radio" name="payment" required />
                    <label htmlFor="nagad">Nagad</label>
                  </div>
                  <div>
                    <input type="radio" name="payment" required />
                    <label htmlFor="cash on delivery">Cash on Delivery</label>
                  </div>
                </div>
              </div>
            </form>

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
          </div>

          {/* Order Summary — receipt style */}
          <div className="lg:col-span-2 lg:sticky lg:top-10">
            <div
              className="bg-white rounded-2xl border border-[#E4DDCE] overflow-hidden"
              style={{
                boxShadow: "0 1px 0 rgba(22,36,31,0.03)",
              }}
            >
              {/* perforated top edge */}
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
                <p
                  className="text-xs tracking-[0.15em] uppercase text-[#16241F]/40 mb-4"
                  style={{ fontFamily: FONT_MONO }}
                >
                  Order Summary
                </p>

                <div className="flex gap-4">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${image}`}
                    alt={name}
                    className="w-20 h-20 object-cover rounded-lg border border-[#E4DDCE]"
                  />
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-lg text-[#16241F] truncate"
                      style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}
                    >
                      {name}
                    </h3>
                    <p className="text-sm text-[#16241F]/50 line-clamp-2 mt-1">
                      {description}
                    </p>
                    <p
                      className="mt-2 text-[#16241F]"
                      style={{ fontFamily: FONT_MONO }}
                    >
                      ৳{price}
                    </p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex justify-between items-center mt-6">
                  <span className="text-sm font-medium text-[#16241F]">
                    Quantity
                  </span>
                  <div className="flex items-center border border-[#E4DDCE] rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        setCount((prev) => (prev > 1 ? prev - 1 : 1))
                      }
                      className="px-3 py-2 text-[#16241F] hover:bg-[#FAF6EF] transition"
                    >
                      <FontAwesomeIcon icon={faMinus} size="xs" />
                    </button>
                    <span
                      className="px-5 font-medium"
                      style={{ fontFamily: FONT_MONO }}
                    >
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCount((prev) => (prev < stock ? prev + 1 : stock))
                      }
                      className="px-3 py-2 text-[#16241F] hover:bg-[#FAF6EF] transition"
                    >
                      <FontAwesomeIcon icon={faPlus} size="xs" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#16241F]/40 mt-2">
                  {stock} in stock
                </p>

                {/* dashed receipt divider */}
                <div className="border-t border-dashed border-[#D8CFB8] my-6" />

                <div
                  className="space-y-2.5 text-sm text-[#16241F]/70"
                  style={{ fontFamily: FONT_MONO }}
                >
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
                  <span
                    className="text-[#16241F]"
                    style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}
                  >
                    Total
                  </span>
                  <span
                    className="text-2xl text-[#16241F]"
                    style={{ fontFamily: FONT_MONO, fontWeight: 500 }}
                  >
                    ৳{total}
                  </span>
                </div>

                <Link
                  to="/orders"
                  className="w-full mt-8 bg-[#16241F] hover:bg-[#0F1A16] duration-200 text-[#FAF6EF] py-3.5 rounded-xl font-medium text-base flex items-center justify-center gap-2 group"
                >
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-[#B08946] group-hover:text-[#c9a25c] transition"
                  />
                  Confirm &amp; Place Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
