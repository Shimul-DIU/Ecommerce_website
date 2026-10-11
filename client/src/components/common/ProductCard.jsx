import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { CountContext } from '../../context/countContext'; // নিজের ফোল্ডার অনুযায়ী পাথ ঠিক করুন

const ProductCard = ({ product }) => {
  const { wishlist, cart, toggleWishlist, toggleCart } = useContext(CountContext);

  const productId = String(product._id || product.id);
  const isWished = wishlist.includes(productId);
  const inCart = cart.includes(productId);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };

  const handleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCart(productId);
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <Link to={`/product/${productId}`}>
        <div className="relative">
          <img
            src={product.image || '/images/placeholder.jpg'}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              New
            </span>
          )}
          {product.discount && (
            <span className="absolute top-14 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-gray-900">৳{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">৳{product.originalPrice}</span>
            )}
          </div>

          {product.rating && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600">{product.rating}</span>
              <span className="text-sm text-gray-400">({product.reviews})</span>
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist হার্ট বাটন (Link-এর বাইরে) */}
      <button
        type="button"
        onClick={handleWishlist}
        aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:scale-110 transition-transform"
      >
        <FontAwesomeIcon
          icon={isWished ? faHeart : faHeartRegular}
          className={isWished ? 'text-red-500' : 'text-gray-500'}
        />
      </button>

      {/* Add to Cart */}
      <button
        type="button"
        className={`absolute bottom-4 left-4 right-4 text-white py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${inCart ? 'bg-green-600' : 'bg-blue-600'
          }`}
        onClick={handleCart}
      >
        {inCart ? 'Added ✓' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;