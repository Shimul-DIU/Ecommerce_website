import { useState } from "react";

// ডেমো ডাটা — পরে API/Firebase থেকে আনলে এই array বদলে ফেলো
const products = [
  { id: 1, name: "Wireless Headphones", price: 2490, oldPrice: 3200, image: "https://picsum.photos/seed/p1/400/400", rating: 4.5, isNew: true },
  { id: 2, name: "Smart Watch Series 5", price: 3990, oldPrice: 4800, image: "https://picsum.photos/seed/p2/400/400", rating: 4.2, isNew: true },
  { id: 3, name: "Leather Backpack", price: 1850, image: "https://picsum.photos/seed/p3/400/400", rating: 4.7, isNew: true },
  { id: 4, name: "Bluetooth Speaker", price: 1590, oldPrice: 1990, image: "https://picsum.photos/seed/p4/400/400", rating: 4.0, isNew: true },
  { id: 5, name: "Running Sneakers", price: 2750, image: "https://picsum.photos/seed/p5/400/400", rating: 4.6, isNew: true },
  { id: 6, name: "Mechanical Keyboard", price: 3290, oldPrice: 3900, image: "https://picsum.photos/seed/p6/400/400", rating: 4.8, isNew: true },
  { id: 7, name: "Sunglasses", price: 990, image: "https://picsum.photos/seed/p7/400/400", rating: 4.1, isNew: true },
  { id: 8, name: "Power Bank 20000mAh", price: 1450, oldPrice: 1800, image: "https://picsum.photos/seed/p8/400/400", rating: 4.4, isNew: true },
];

const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5" aria-label={`Rating ${rating} out of 5`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <svg
        key={s}
        className={`h-4 w-4 ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ))}
    <span className="ml-1 text-xs text-gray-500">{rating}</span>
  </div>
);

const ProductCard = ({ product, onAddToCart }) => {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white">
            New
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-medium text-white">
            -{discount}%
          </span>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="truncate text-sm font-semibold text-gray-900">{product.name}</h3>
        <Stars rating={product.rating} />
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">৳{product.price.toLocaleString()}</span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">৳{product.oldPrice.toLocaleString()}</span>
          )}
        </div>
        <button
          onClick={() => onAddToCart(product)}
          className="w-full rounded-lg bg-gray-900 py-2 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default function LatestProducts({ items = products, limit = 8 }) {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
    // এখানে তোমার Redux dispatch বা Context function বসাতে পারো
    console.log("Added:", product.name, "| Cart items:", cart.length + 1);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Latest products</h2>
          <p className="mt-1 text-sm text-gray-500">এই সপ্তাহে যোগ হওয়া নতুন প্রোডাক্ট</p>
        </div>
        <a href="/shop" className="text-sm font-medium text-gray-900 underline-offset-4 hover:underline">
          View all
        </a>
      </div>

      {/* মোবাইলে 2 কলাম, ট্যাবলেটে 3, ডেস্কটপে 4 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {items.slice(0, limit).map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </section>
  );
}
