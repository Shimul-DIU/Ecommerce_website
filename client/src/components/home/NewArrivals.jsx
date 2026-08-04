import useProducts from "../../hooks/useProducts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { CountContext } from "../../context/countContext";
import { Link } from "react-router-dom";

const FONT_DISPLAY = "'Fraunces', serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

const NewArrivals = () => {
  const { wishlist, cart, toggleWishlist, toggleCart } =
    useContext(CountContext);
  const [products, loading, error] = useProducts();

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <h2 className="text-red-500 text-lg">{error}</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-4 min-h-screen">
      <div className="py-4 sm:py-6">
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5 animate-pulse">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="aspect-square rounded-xl bg-[#E4DDCE]" />
                <div className="h-3 w-3/4 rounded bg-[#E4DDCE]" />
                <div className="h-3 w-1/2 rounded bg-[#E4DDCE]" />
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <>
            <div className=" max-w-7xl mx-auto px-4 flex items-baseline justify-between mb-4 sm:mb-6">
              <h2
                className="text-xl sm:text-2xl md:text-3xl text-[#16241F]"
                style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}
              >
                New Arrivals
              </h2>
              <span
                className="text-xs sm:text-sm text-[#16241F]/40"
                style={{ fontFamily: FONT_MONO }}
              >
                {products?.length || 0} items
              </span>
            </div>

            {/* Grid layout with tight gap */}
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
              {products?.map((item) => {
                const inWishlist = wishlist?.includes(item._id);
                const inCart = cart?.includes(item._id);

                return (
                  <div
                    key={item._id}
                    className="group flex flex-col bg-white border border-[#E4DDCE] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
                  >
                    {/* Compact Image Box */}
                    <div className="relative w-full  aspect-square bg-[#F4F1EA] overflow-hidden flex items-center justify-center p-1 sm:p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full rounded-lg h-full object-contain sm:object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Small Overlay Action Buttons */}
                      <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 z-10">
                        <button
                          type="button"
                          onClick={() => toggleWishlist(item._id)}
                          aria-label={
                            inWishlist
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-sm transition
                            ${inWishlist
                              ? "bg-[#16241F] text-[#B08946]"
                              : "bg-white/90 text-[#16241F]/50 hover:text-[#16241F]"
                            }`}
                        >
                          <FontAwesomeIcon icon={faHeart} className="text-[10px] sm:text-xs" />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleCart(item._id)}
                          aria-label={
                            inCart ? "Remove from cart" : "Add to cart"
                          }
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-sm transition
                            ${inCart
                              ? "bg-[#16241F] text-[#B08946]"
                              : "bg-white/90 text-[#16241F]/50 hover:text-[#16241F]"
                            }`}
                        >
                          <FontAwesomeIcon icon={faShoppingCart} className="text-[10px] sm:text-xs" />
                        </button>
                      </div>

                      {item.stock <= 0 && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center p-1 z-10">
                          <span
                            className="text-[9px] sm:text-[10px] tracking-wide uppercase text-[#16241F]/70 bg-white px-2 py-0.5 rounded-full border border-[#E4DDCE] font-medium"
                            style={{ fontFamily: FONT_MONO }}
                          >
                            Out of stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Compact Details Area */}
                    <div className="p-2 sm:p-2.5 flex flex-col flex-grow justify-between">
                      <div>
                        <h3
                          className="text-[#16241F] text-xs sm:text-sm font-medium line-clamp-1 leading-tight"
                          style={{ fontFamily: FONT_DISPLAY }}
                        >
                          {item.name}
                        </h3>
                      </div>

                      <div className="mt-1.5 sm:mt-2">
                        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                          <span
                            className="text-xs sm:text-sm md:text-base text-[#16241F]"
                            style={{ fontFamily: FONT_MONO, fontWeight: 600 }}
                          >
                            ৳{item.price}
                          </span>
                          <span
                            className="text-[9px] sm:text-[10px] text-[#16241F]/40"
                            style={{ fontFamily: FONT_MONO }}
                          >
                            Stock: {item.stock}
                          </span>
                        </div>

                        <Link
                          to="/checkout"
                          state={{ product: item }}
                          className="block"
                        >
                          <button
                            disabled={item.stock <= 0}
                            className="w-full h-7 sm:h-8 rounded-md bg-[#16241F] hover:bg-[#0F1A16] disabled:bg-[#16241F]/30 disabled:cursor-not-allowed text-[#FAF6EF] text-[11px] sm:text-xs font-medium transition"
                          >
                            {item.stock <= 0 ? "Unavailable" : "Buy Now"}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;