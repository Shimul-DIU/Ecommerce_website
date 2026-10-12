import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faMinus,
  faCartShopping,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { CountContext } from "../../../context/countContext";
import useProducts from "../../../hooks/useProducts";

const QTY_KEY = "cartQty";
const SHIPPING_FEE = 60;
const FREE_SHIPPING_MIN = 2000;

const readQty = () => {
  try {
    return JSON.parse(localStorage.getItem(QTY_KEY)) || {};
  } catch {
    return {};
  }
};

const CartPage = () => {
  const { cart, toggleCart } = useContext(CountContext);
  const [products, loading, error] = useProducts();
  const navigate = useNavigate();

  // { [productId]: quantity } — রিফ্রেশ করলেও থাকবে
  const [quantities, setQuantities] = useState(readQty);

  useEffect(() => {
    localStorage.setItem(QTY_KEY, JSON.stringify(quantities));
  }, [quantities]);

  // অন্য পেজ (যেমন Products) থেকে cart থেকে সরানো আইটেমের পুরনো quantity মুছে ফেলা
  useEffect(() => {
    const cartIds = new Set(cart.map(String));
    setQuantities((prev) => {
      const staleKeys = Object.keys(prev).filter((id) => !cartIds.has(id));
      if (staleKeys.length === 0) return prev;
      const next = { ...prev };
      staleKeys.forEach((id) => delete next[id]);
      return next;
    });
  }, [cart]);

  // cart ids -> আসল প্রোডাক্ট
  const cartItems = useMemo(() => {
    if (!products) return [];
    return cart
      .map((id) => products.find((p) => String(p._id) === String(id)))
      .filter(Boolean)
      .map((p) => {
        const id = String(p._id);
        const stock = Number(p.stock ?? 0);
        const price = Number(p.price || 0);
        const originalPrice = Number(p.originalPrice || 0);
        const saved = quantities[id] || 1;
        const quantity = stock > 0 ? Math.min(Math.max(1, saved), stock) : 1;
        return {
          id,
          name: p.name,
          image: p.image || p.images?.[0] || "/images/placeholder.jpg",
          price,
          // originalPrice শুধু তখনই ধরা হবে যখন সেটা আসল দামের চেয়ে বেশি
          originalPrice: originalPrice > price ? originalPrice : price,
          stock,
          quantity,
          raw: p,
        };
      });
  }, [products, cart, quantities]);

  const handleIncrease = (id, stock) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      return { ...prev, [id]: Math.min(current + 1, stock) };
    });
  };

  const handleDecrease = (id) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      return { ...prev, [id]: Math.max(1, current - 1) };
    });
  };

  const handleRemove = (id) => {
    toggleCart(id);
    setQuantities((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // stock নেই এমন প্রোডাক্ট হিসাবে ধরা হবে না
  const payableItems = useMemo(
    () => cartItems.filter((item) => item.stock > 0),
    [cartItems]
  );

  const outOfStockCount = cartItems.length - payableItems.length;

  // ================= ORDER SUMMARY হিসাব =================
  const summary = useMemo(() => {
    const totalQty = payableItems.reduce((sum, i) => sum + i.quantity, 0);
    const originalTotal = payableItems.reduce(
      (sum, i) => sum + i.originalPrice * i.quantity,
      0
    );
    const subtotal = payableItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const discount = originalTotal - subtotal;
    const shipping =
      subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;
    const remainingForFree =
      subtotal > 0 && subtotal < FREE_SHIPPING_MIN
        ? FREE_SHIPPING_MIN - subtotal
        : 0;

    return {
      totalQty,
      originalTotal,
      subtotal,
      discount,
      shipping,
      total,
      remainingForFree,
    };
  }, [payableItems]);

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        items: payableItems.map((item) => ({
          ...item.raw,
          quantity: item.quantity,
        })),
        summary: {
          subtotal: summary.subtotal,
          shipping: summary.shipping,
          total: summary.total,
        },
      },
    });
  };

  // ================= ERROR =================
  if (error) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-red-500 font-semibold text-lg">{String(error)}</h2>
      </div>
    );
  }

  // ================= LOADING =================
  if (loading && cart.length > 0) {
    return (
      <div className="w-full">
        <div className="h-7 w-48 rounded bg-slate-200 mb-6 animate-pulse" />
        <div className="flex flex-col gap-3">
          {[...Array(Math.min(cart.length, 3))].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 animate-pulse"
            >
              <div className="w-24 h-24 rounded-xl bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded bg-slate-200" />
                <div className="h-4 w-1/4 rounded bg-slate-200" />
                <div className="h-7 w-28 rounded-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ================= EMPTY CART STATE =================
  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-slate-100 flex items-center justify-center">
          <FontAwesomeIcon
            icon={faCartShopping}
            className="text-3xl text-slate-400"
          />
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
    <div className="w-full max-w-none mx-auto">
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
          {cartItems.map((item) => {
            const outOfStock = item.stock <= 0;
            const hasDiscount = item.originalPrice > item.price;

            return (
              <div
                key={item.id}
                className={`flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-3 sm:p-4 shadow-sm ${outOfStock ? "opacity-70" : ""
                  }`}
              >
                {/* Image */}
                <Link to={`/product/${item.id}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-slate-50"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-800 truncate hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-blue-600 font-bold">
                      ৳{item.price.toLocaleString()}
                    </p>
                    {hasDiscount && (
                      <p className="text-xs text-slate-400 line-through">
                        ৳{item.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {outOfStock && (
                    <p className="text-xs font-semibold text-red-500 mt-1">
                      Out of stock — not included in total
                    </p>
                  )}

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-2.5">
                    {!outOfStock && (
                      <div className="flex items-center border border-slate-200 rounded-full overflow-hidden">
                        <button
                          onClick={() => handleDecrease(item.id)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <FontAwesomeIcon
                            icon={faMinus}
                            className="text-[10px]"
                          />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrease(item.id, item.stock)}
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="text-[10px]"
                          />
                        </button>
                      </div>
                    )}

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
                {!outOfStock && (
                  <div className="hidden sm:block text-right shrink-0">
                    <p className="text-xs text-slate-400 mb-1">Total</p>
                    <p className="text-sm font-bold text-slate-800">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sticky top-24">
            <h2 className="text-base font-bold text-slate-800 mb-4">
              Order Summary
            </h2>

            <div className="flex flex-col gap-2.5 text-sm">
              {/* discount থাকলেই শুধু আসল দাম ও discount দেখাবে */}
              {summary.discount > 0 && (
                <>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>
                      Items ({summary.totalQty} pc
                      {summary.totalQty !== 1 ? "s" : ""})
                    </span>
                    <span className="text-slate-700 font-medium">
                      ৳{summary.originalTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Discount</span>
                    <span className="text-green-600 font-medium">
                      -৳{summary.discount.toLocaleString()}
                    </span>
                  </div>
                </>
              )}

              {/* pcs সংখ্যা Subtotal-এর লেখাতেই থাকবে */}
              <div className="flex items-center justify-between text-slate-500">
                <span>
                  Subtotal ({summary.totalQty} pc
                  {summary.totalQty !== 1 ? "s" : ""})
                </span>
                <span className="text-slate-700 font-medium">
                  ৳{summary.subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-500">
                <span>Delivery charge</span>
                <span
                  className={`font-medium ${summary.shipping === 0 ? "text-green-600" : "text-slate-700"
                    }`}
                >
                  {summary.shipping === 0 ? "Free" : `৳${summary.shipping}`}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 mt-3 pt-3">
              <span className="text-sm font-semibold text-slate-800">
                Total
              </span>
              <span className="text-lg font-bold text-blue-600">
                ৳{summary.total.toLocaleString()}
              </span>
            </div>

            {outOfStockCount > 0 && (
              <p className="text-[11px] text-red-500 mt-3">
                {outOfStockCount} out-of-stock item
                {outOfStockCount > 1 ? "s are" : " is"} not included.
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={payableItems.length === 0}
              className="w-full mt-5 bg-blue-600 text-white text-sm font-semibold py-3 rounded-full hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>

            <p className="text-[11px] text-slate-400 text-center mt-3">
              {summary.remainingForFree > 0
                ? `Add ৳${summary.remainingForFree.toLocaleString()} more for free delivery`
                : summary.subtotal > 0
                  ? "You got free delivery 🎉"
                  : `Free delivery on orders over ৳${FREE_SHIPPING_MIN}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;