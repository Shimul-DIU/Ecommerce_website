import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <Link to={`/product/${product._id || product.id}`}>
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
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
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

      <button
        className="absolute bottom-4 left-4 right-4 bg-blue-600 text-white py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={(e) => {
          e.preventDefault();
          console.log('Added to cart:', product._id || product.id);
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;