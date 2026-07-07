import { createContext, useEffect, useState } from "react";

export const CountContext = createContext();

export const CountProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  });

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((item) => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const toggleCart = (id) => {
    if (cart.includes(id)) {
      setCart(cart.filter((item) => item !== id));
    } else {
      setCart([...cart, id]);
    }
  };

  return (
    <CountContext.Provider
      value={{
        wishlist,
        cart,
        toggleWishlist,
        toggleCart,
      }}
    >
      {children}
    </CountContext.Provider>
  );
};