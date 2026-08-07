import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";

const CATEGORIES = [
  {
    id: "men",
    name: "Men's",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=600&fit=crop&crop=center",
    itemsCount: 240,
    soldCount: "12.5K",
    bgColor: "bg-[#F4F1EA]"
  },
  {
    id: "women",
    name: "Women's",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=600&fit=crop&crop=center",
    itemsCount: 320,
    soldCount: "18.2K",
    bgColor: "bg-[#FDF6F0]"
  },
  {
    id: "jewellery",
    name: "Jewellery",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&crop=center",
    itemsCount: 180,
    soldCount: "8.7K",
    bgColor: "bg-[#F5F0E8]"
  },
  {
    id: "electronics",
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop&crop=center",
    itemsCount: 150,
    soldCount: "6.3K",
    bgColor: "bg-[#EEF2F6]"
  },
  {
    id: "fishing",
    name: "Fishing",
    image: "https://images.unsplash.com/photo-1525815732237-469cdd9874ab?w=600&h=600&fit=crop&crop=center",
    itemsCount: 95,
    soldCount: "3.1K",
    bgColor: "bg-[#E8F0EE]"
  },
  {
    id: "deal",
    name: "Deal of Day",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop&crop=center",
    itemsCount: 45,
    soldCount: "2.8K",
    bgColor: "bg-[#FDF4E6]"
  }
];

const TopCategories = () => {
  return (
    <section className=" px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl text-[#16241F]]">
          Top Categories
        </h2>
        <Link
          to="/products"
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
        >
          View All →
        </Link>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to="/products"
            state={{ filter: cat.id }}
            className="group bg-white border border-[#E4DDCE] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-400 block w-full"
          >
            {/* Inner container */}
            <div className="flex h-16 sm:h-20 w-full">
              {/* Left: Image (Width reduced for small screens) */}
              <div className={`${cat.bgColor} w-14 sm:w-20 shrink-0 flex items-center justify-center p-1`}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Right: Information */}
              <div className="flex-1 flex flex-col justify-between p-1.5 sm:p-2 min-w-0">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#16241F] truncate">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-[#16241F]/60 truncate">
                    {cat.itemsCount} items
                  </p>
                </div>

                {/* Sold Badge Fix */}
                <div className="flex items-center">
                  <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-blue-50 px-1 sm:px-1.5 py-0.5 rounded-full text-blue-700 font-semibold text-[9px] sm:text-[10px] whitespace-nowrap">
                    <FontAwesomeIcon icon={faTag} className="text-[7px] sm:text-[8px] shrink-0" />
                    <span>{cat.soldCount} sold</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TopCategories;