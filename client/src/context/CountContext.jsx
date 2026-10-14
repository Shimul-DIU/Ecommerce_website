import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import axiosInstance from "../utils/axiosInstance";

// Default value is a no-op fallback so a component rendered outside
// CountProvider fails gracefully (empty cart/wishlist) instead of crashing.
const noop = () => {};

export const CountContext = createContext({
  wishlist: [],
  cart: [],
  toggleWishlist: noop,
  toggleCart: noop,
});

const readLocal = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

export const CountProvider = ({ children }) => {
  const { accessToken } = useContext(AuthContext);

  const [wishlist, setWishlist] = useState(() => readLocal("wishlist"));
  const [cart, setCart] = useState(() => readLocal("cart"));
  const prevToken = useRef(accessToken);

  console.log("CountProvider NEW VERSION loaded");

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // লগইন হলে server-এর সাথে merge, লগআউট হলে wishlist খালি
  useEffect(() => {
    if (!accessToken) {
      if (prevToken.current) {
        // আগে টোকেন ছিল, এখন নেই = logout
        setWishlist([]);
        localStorage.removeItem("wishlist");
      }
      prevToken.current = accessToken;
      return;
    }

    prevToken.current = accessToken;

    const syncWishlist = async () => {
      try {
        const localIds = readLocal("wishlist");
        const res = await axiosInstance.post("/api/wishlist/merge", { ids: localIds });
        setWishlist(res.data.ids);
      } catch (error) {
        if (error?.response?.status !== 401) {
          console.error("Wishlist sync failed:", error);
        }
      }
    };

    syncWishlist();
  }, [accessToken]);

  const toggleWishlist = async (id) => {
    console.log("1. toggleWishlist called, id =", id);
    const exists = wishlist.includes(id);

    // আগে UI আপডেট (optimistic)
    setWishlist((prev) => (exists ? prev.filter((i) => i !== id) : [...prev, id]));

    try {
      console.log("2. sending request...");
      const res = await axiosInstance.post("/api/wishlist/toggle", { productId: id });
      console.log("3. success:", res.data);
    } catch (error) {
      console.log("4. FAILED:", error?.response?.status, error?.response?.data, error.message);
      // 401 (guest) হলে localStorage-এই থাকবে, বাকি এরর হলে ফেরত
      if (error?.response?.status !== 401) {
        setWishlist((prev) => (exists ? [...prev, id] : prev.filter((i) => i !== id)));
      }
    }
  };

  const toggleCart = (id) => {
    setCart((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <CountContext.Provider value={{ wishlist, cart, toggleWishlist, toggleCart }}>
      {children}
    </CountContext.Provider>
  );
};