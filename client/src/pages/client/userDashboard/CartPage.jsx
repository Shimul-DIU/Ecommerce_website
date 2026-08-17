import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faMinus,
  faCartShopping,
  faArrowLeft,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

const initialCartItems = [
  {
    id: 1,
    name: "Men's Classic Leather Wallet",
    image: "https://via.placeholder.com/120x120.png?text=Wallet",
    price: 950,
    quantity: 1,
    stock: 12,
  },
  {
    id: 2,
    name: "Women's Floral Summer Dress",
    image: "https://via.placeholder.com/120x120.png?text=Dress",
    price: 1450,
    quantity: 2,
    stock: 5,
  },
  {
    id: 3,
    name: "Elegant Pearl Necklace",
    image: "https://via.placeholder.com/120x120.png?text=Necklace",
    price: 2200,
    quantity: 1,
    stock: 3,
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleIncrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            quantity:
              item.quantity < item.stock ? item.quantity + 1 : item.quantity,
          }
          : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 60;
  const total = subtotal + shipping;

  // ================= EMPTY CART STATE =================
  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-slate-100 flex items-center justify-center">
          <FontAwesomeIcon icon={faCartShopping} className="text-3xl text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          No products added yet. Start shopping.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-blue-700 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          Shopping Cart
          <span className="ml-2 text-sm font-medium text-slate-400">
            ({cartItems.length} item{cartItems.length > 1 ? "s" : ""})
          </span>
        </h1>
        <Link
          to="/products"
          className="hidden sm:flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= CART ITEMS LIST ================= */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-3 sm:p-4 shadow-sm"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 bg-slate-50"
              />

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 truncate">
                  {item.name}
                </h3>
                <p className="text-sm text-blue-600 font-bold mt-1">
                  ৳{item.price.toLocaleString()}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-2.5">
                  <div className="flex items-center border border-slate-200 rounded-full overflow-hidden">
                    <button
                      onClick={() => handleDecrease(item.id)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrease(item.id)}
                      disabled={item.quantity >= item.stock}
                      aria-label="Increase quantity"
                      className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-xs" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>

              {/* Line Total (desktop) */}
              <div className="hidden sm:block text-right shrink-0">
                <p className="text-xs text-slate-400 mb-1">Total</p>
                <p className="text-sm font-bold text-slate-800">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sticky top-24">
            <h2 className="text-base font-bold text-slate-800 mb-4">
              Order Summary
            </h2>

            {/* Promo Code */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-full px-3.5 h-10 bg-slate-50">
                <FontAwesomeIcon icon={faTag} className="text-slate-400 text-xs" />
                <input
                  type="text"
                  placeholder="Promo code"
                  className="flex-1 h-full outline-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400"
                />
              </div>
              <button className="h-10 px-4 rounded-full bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition-colors shrink-0">
                Apply
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-sm border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-700 font-medium">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-slate-700 font-medium">
                  {shipping === 0 ? "Free" : `৳${shipping}`}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 mt-3 pt-3">
              <span className="text-sm font-semibold text-slate-800">Total</span>
              <span className="text-lg font-bold text-blue-600">
                ৳{total.toLocaleString()}
              </span>
            </div>

            <button className="w-full mt-5 bg-blue-600 text-white text-sm font-semibold py-3 rounded-full hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
              Proceed to Checkout
            </button>

            <p className="text-[11px] text-slate-400 text-center mt-3">
              Free delivery on orders over ৳2000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;