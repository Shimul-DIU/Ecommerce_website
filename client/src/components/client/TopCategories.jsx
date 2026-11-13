import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import useProducts from "../../hooks/useProducts";
import normalizeProductCategory from "../../utils/normalizeProductCategory";
import { useTranslation } from "../../utils/translations";

const CATEGORY_META = {
  men: { name: "Men's", bgColor: "bg-[#F4F1EA]" },
  women: { name: "Women's", bgColor: "bg-[#FDF6F0]" },
  jewellery: { name: "Jewellery", bgColor: "bg-[#F5F0E8]" },
  electronics: { name: "Electronics", bgColor: "bg-[#EEF2F6]" },
  fishing: { name: "Fishing", bgColor: "bg-[#E8F0EE]" },
  deal: { name: "Deal of Day", bgColor: "bg-[#FDF4E6]" },
  perfume: { name: "Perfume", bgColor: "bg-[#F5F0E8]" },
  bags: { name: "Bags & Luggage", bgColor: "bg-[#F4F1EA]" },
  glasses: { name: "Glasses", bgColor: "bg-[#EEF2F6]" },
  "new-arrival": { name: "New Arrival", bgColor: "bg-[#FDF6F0]" },
};

const TopCategories = () => {
  const { t } = useTranslation();
  const [products, loading, error] = useProducts();

  const categories = Object.values(
    (products || []).reduce((groups, product) => {
      if (String(product.status).toLowerCase() !== "active") return groups;

      const id = normalizeProductCategory(product.category);
      if (!id) return groups;

      if (!groups[id]) {
        groups[id] = {
          id,
          name: CATEGORY_META[id]?.name || product.category,
          bgColor: CATEGORY_META[id]?.bgColor || "bg-[#F4F1EA]",
          image: product.image,
          itemsCount: 0,
          soldCount: 0,
        };
      }

      groups[id].itemsCount += 1;
      groups[id].soldCount += Number(product.sold) || 0;
      return groups;
    }, {})
  )
    .sort(
      (a, b) =>
        b.soldCount - a.soldCount || b.itemsCount - a.itemsCount
    )
    .slice(0, 6);

  return (
    <section className="w-full mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-[#16241F] md:text-xl lg:text-2xl">
          {t("Top Categories")}
        </h2>
        <Link
          to="/products"
          className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
        >
          {t("View All")} →
        </Link>
      </div>

      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="flex h-16 animate-pulse overflow-hidden rounded-lg border border-[#E4DDCE] bg-white sm:h-20"
            >
              <div className="w-14 shrink-0 bg-[#E4DDCE]/60 sm:w-20" />
              <div className="flex flex-1 flex-col justify-center gap-2 p-2">
                <div className="h-3 w-3/4 rounded bg-[#E4DDCE]/60" />
                <div className="h-2 w-1/2 rounded bg-[#E4DDCE]/40" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <p className="rounded-xl border border-dashed border-[#E4DDCE] bg-white/70 px-4 py-8 text-center text-sm text-[#16241F]/55">
          No product categories available yet.
        </p>
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${encodeURIComponent(category.id)}`}
              className="group block w-full overflow-hidden rounded-lg border border-[#E4DDCE] bg-white transition-all duration-300 hover:border-blue-400 hover:shadow-md"
            >
              <div className="flex h-16 w-full sm:h-20">
                <div
                  className={`${category.bgColor} flex w-14 shrink-0 items-center justify-center p-1 sm:w-20`}
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faTag}
                      className="text-xl text-[#B08946]"
                    />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between p-1.5 sm:p-2">
                  <div>
                    <h3 className="truncate text-xs font-bold text-[#16241F] sm:text-sm">
                      {t(category.name)}
                    </h3>
                    <p className="truncate text-[10px] text-[#16241F]/60">
                      {category.itemsCount.toLocaleString()} {t("items")}
                    </p>
                  </div>

                  <span className="inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-semibold text-blue-700 sm:text-[10px]">
                    <FontAwesomeIcon icon={faTag} className="text-[8px]" />
                    {category.soldCount.toLocaleString()} {t("sold")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default TopCategories;
