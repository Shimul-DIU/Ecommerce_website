import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../../utils/axiosInstance";
import { CountContext } from "../../../context/CountContext";
import { useTranslation } from "../../../utils/translations";
import getProductPricing from "../../../utils/getProductPricing";

export default function Wishlist() {
  const { t } = useTranslation();
  const { wishlist, cart, toggleWishlist, toggleCart } =
    useContext(CountContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get("/api/wishlist");
        setItems(response.data.items || []);
        setError("");
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setError("Could not load your wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // context-এর ids দিয়ে ফিল্টার, তাই Remove চাপলেই সাথে সাথে কার্ড চলে যাবে
  const visibleItems = items.filter((w) => wishlist.includes(String(w._id)));

  const handleRemove = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  const handleCart = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCart(id);
  };

  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-slate-900">{t("Your Wishlist")}</h2>

      {loading ? (
        <p className="text-sm text-slate-500">{t("Loading...")}</p>
      ) : error ? (
        <p role="alert" className="text-sm text-rose-600">{t(error)}</p>
      ) : visibleItems.length === 0 ? (
        <p className="text-slate-500">
          {t("Nothing saved yet. Items you love will show up here.")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((w) => {
            const productId = String(w._id);
            const inCart = cart.includes(productId);
            const { price, originalPrice, discountPercent } =
              getProductPricing(w);
            const imageSrc =
              w.image || w.images?.[0] || "/images/placeholder.jpg";

            return (
              <div
                key={productId}
                className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <Link to={`/product/${productId}`}>
                  <div className="relative">
                    <img
                      src={imageSrc}
                      alt={w.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {w.isNew && (
                      <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {t("New")}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="absolute top-14 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
                      {w.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-gray-900">
                        ৳{price.toLocaleString()}
                      </span>
                      {originalPrice > price && (
                        <span className="text-sm text-gray-400 line-through">
                          ৳{originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {w.rating ? (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600">
                            {w.rating}
                          </span>
                          <span className="text-sm text-gray-400">
                            ({w.reviews})
                          </span>
                        </div>
                      ) : (
                        <span />
                      )}
                      <span
                        className={`text-xs ${w.inStock !== false
                            ? "text-emerald-600"
                            : "text-rose-600"
                          }`}
                      >
                        {w.inStock !== false ? t("In stock") : t("Out of stock")}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Remove (filled heart) — Link-এর বাইরে */}
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, productId)}
                  aria-label={t("Remove from wishlist")}
                  className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:scale-110 transition-transform"
                >
                  <FontAwesomeIcon icon={faHeart} className="text-red-500" />
                </button>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={(e) => handleCart(e, productId)}
                  className={`absolute bottom-4 left-4 right-4 text-white py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${inCart ? "bg-green-600" : "bg-blue-600"
                    }`}
                >
                  {inCart ? t("Added ✓") : t("Add to Cart")}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}