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
      <div className="flex justify-center items-center py-20 bg-[#FAF6EF]">
        <h2 className="text-red-500 text-lg">{error}</h2>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 animate-pulse">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="h-40 rounded-xl bg-[#E4DDCE]" />
                <div className="h-4 w-3/4 rounded bg-[#E4DDCE]" />
                <div className="h-4 w-1/2 rounded bg-[#E4DDCE]" />
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <>
            <div className="flex items-baseline justify-between mb-8">
              <h2
                className="text-3xl text-[#16241F]"
                style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}
              >
                New Arrivals
              </h2>
              <span
                className="text-sm text-[#16241F]/40"
                style={{ fontFamily: FONT_MONO }}
              >
                {products.length} items
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4   gap-5">
              {products.map((item) => {
                const inCart = cart.includes(item._id);
                const inWishlist = wishlist.includes(item._id);

                return (
                  <div
                    key={item._id}
                    className="group bg-white rounded-2xl border border-[#E4DDCE] overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {/* Image */}
                    <div className="relative">
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.name}
                        className="w-full h-40 object-cover"
                      />

                      {/* Wishlist toggle */}
                      <button
                        type="button"
                        onClick={() => toggleWishlist(item._id)}
                        aria-label={
                          inWishlist
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition
                          ${
                            inWishlist
                              ? "bg-[#16241F] text-[#B08946]"
                              : "bg-white/90 text-[#16241F]/50 hover:text-[#16241F]"
                          }`}
                      >
                        <FontAwesomeIcon icon={faHeart} size="sm" />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="p-3.5">
                      <h3
                        className="text-[#16241F] font-medium line-clamp-1 leading-snug"
                        style={{ fontFamily: FONT_DISPLAY }}
                      >
                        {item.name}
                      </h3>

                      <p className="text-xs text-[#16241F]/45 line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <span
                          className="text-lg text-[#16241F]"
                          style={{ fontFamily: FONT_MONO, fontWeight: 500 }}
                        >
                          ৳{item.price}
                        </span>
                        <span className="text-xs text-[#16241F]/40">
                          Stock: {item.stock}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-3.5">
                        <button
                          type="button"
                          onClick={() => toggleCart(item._id)}
                          aria-label={
                            inCart ? "Remove from cart" : "Add to cart"
                          }
                          className={`w-10 h-10 shrink-0 rounded-lg border flex items-center justify-center transition
                            ${
                              inCart
                                ? "bg-[#16241F] border-[#16241F] text-[#B08946]"
                                : "border-[#E4DDCE] text-[#16241F]/60 hover:border-[#16241F] hover:text-[#16241F]"
                            }`}
                        >
                          <FontAwesomeIcon icon={faShoppingCart} size="sm" />
                        </button>

                        <Link
                          to="/checkout"
                          state={{ product: item }}
                          className="flex-1"
                        >
                          <button className="w-full h-10 rounded-lg bg-[#16241F] hover:bg-[#0F1A16] text-[#FAF6EF] text-sm font-medium transition">
                            Buy Now
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
