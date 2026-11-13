import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  faArrowLeft,
  faCloudArrowUp,
  faBoxOpen,
  faImage,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosInstance from "../../../utils/axiosInstance";
import PRODUCT_SUBCATEGORIES from "../../../utils/productSubcategories.js";

const inputClass = (hasError) =>
  `w-full rounded-xl border bg-[#FAF6EF]/50 px-4 py-2.5 text-sm text-[#16241F] outline-none transition placeholder:text-[#16241F]/35 focus:border-[#B08946] focus:bg-white focus:ring-2 focus:ring-[#B08946]/25 ${
    hasError ? "border-red-400" : "border-[#E4DDCE]"
  }`;

const labelClass =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#16241F]/55";

const FieldError = ({ msg }) =>
  msg ? <p className="mt-1 text-xs font-medium text-red-500">{msg}</p> : null;

const SectionTitle = ({ icon, title, subtitle }) => (
  <div className="mb-5 flex items-center gap-3">
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16241F] text-[#B08946] shadow-md">
      <FontAwesomeIcon icon={icon} />
    </span>
    <div>
      <h2 className="text-base font-extrabold text-[#16241F]">{title}</h2>
      <p className="text-xs text-[#16241F]/50">{subtitle}</p>
    </div>
  </div>
);

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [prevImg, setPrevImg] = useState(null);
  const [error, setError] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEditing);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    subCategory: "",
    subcategoryCategory: "",
    price: "",
    discountPercent: 0,
    oldPrice: "",
    stock: "",
    dealEndsAt: "",
    status: "Active",
    homepageSection: "none",
    description: "",
    image: null,
  });

  useEffect(() => {
    if (!id) return undefined;

    let active = true;
    const controller = new AbortController();
    const loadProduct = async () => {
      try {
        const response = await axiosInstance.get(`/api/admin/products/${id}`, {
          signal: controller.signal,
        });
        if (!active) return;

        const product = response.data.data;
        const isDealProduct = product.category === "deal";
        const dealEndsAt = product.dealEndsAt
          ? new Date(
              new Date(product.dealEndsAt).getTime() -
                new Date(product.dealEndsAt).getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 16)
          : "";

        setForm({
          name: product.name || "",
          category: product.category || "",
          subCategory: product.subCategory || "",
          subcategoryCategory:
            product.subcategoryCategory || product.category || "",
          price: String(
            isDealProduct
              ? product.price
              : product.originalPrice ?? product.price
          ),
          discountPercent: Number(product.discountPercent || 0),
          oldPrice: product.oldPrice ?? "",
          stock: String(product.stock ?? ""),
          dealEndsAt,
          status: product.status || "Active",
          homepageSection: product.homepageSection || "none",
          description: product.description || "",
          image: null,
        });
        setPrevImg(product.image || null);
      } catch (loadProductError) {
        if (active && !controller.signal.aborted) {
          console.error("Load product error:", loadProductError);
          setLoadError(
            loadProductError.response?.data?.message ||
              "Failed to load product"
          );
        }
      } finally {
        if (active) setLoadingProduct(false);
      }
    };

    loadProduct();
    return () => {
      active = false;
      controller.abort();
    };
  }, [id]);

  const isDeal = form.category === "deal";
  const subcategoryGroups =
    form.category === "new-arrival"
      ? Object.entries(PRODUCT_SUBCATEGORIES)
      : [[form.category, PRODUCT_SUBCATEGORIES[form.category] || []]];
  const hasSubCategory = subcategoryGroups.some(([, items]) => items.length > 0);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    // File input
    if (type === "file") {
      const file = files?.[0];
      setForm((prev) => ({ ...prev, [name]: file || null }));
      if (file) setPrevImg(URL.createObjectURL(file));
      setError({});
      return;
    }

    // Category change → subCategory ও deal ফিল্ড reset
    if (name === "category") {
      setForm((prev) => ({
        ...prev,
        category: value,
        subCategory: "",
        subcategoryCategory: value === "new-arrival" ? "" : value,
        price:
          prev.category === "deal" && value !== "deal" && prev.oldPrice
            ? String(prev.oldPrice)
            : prev.price,
        oldPrice: value === "deal" ? prev.oldPrice : "",
        discountPercent:
          value === "deal" || prev.category === "deal"
            ? 0
            : prev.discountPercent,
        dealEndsAt: value === "deal" ? prev.dealEndsAt : "",
      }));
      setError({});
      return;
    }

    if (name === "subCategory") {
      const [subcategoryCategory, subCategory] = JSON.parse(value);
      setForm((prev) => ({
        ...prev,
        subcategoryCategory,
        subCategory,
      }));
      setError({});
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setError({});
      setSubmitting(true);

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          (value !== "" || key === "description")
        ) {
          formData.append(key, value);
        }
      });

      if (isEditing) {
        await axiosInstance.patch(`/api/admin/products/${id}`, formData);
      } else {
        await axiosInstance.post("/api/admin/add-product", formData);
      }
      navigate("/admin/products");
    } catch (err) {
      console.error("Add product error:", err);

      if (err.response) {
        setError(
          err.response.data.error || {
            server: err.response.data.message || "Something went wrong",
          }
        );
      } else {
        setError({ server: err.message || "Something went wrong" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return <p className="p-6 text-sm text-slate-500">Loading product...</p>;
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-600">
        <p>{loadError}</p>
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="mt-4 rounded-full bg-[#16241F] px-4 py-2 font-semibold text-white"
        >
          Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER BANNER ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-[#16241F] p-5 shadow-lg sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#B08946]/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 right-24 h-32 w-32 rounded-full bg-[#B08946]/10 blur-2xl" />

        <div className="relative flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FAF6EF]/20 bg-white/5 text-[#FAF6EF] transition-colors hover:border-[#B08946] hover:text-[#B08946]"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
          </button>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#B08946]">
              Products
            </p>
            <h1 className="mt-0.5 text-xl font-extrabold text-[#FAF6EF] sm:text-2xl">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="mt-0.5 text-sm text-[#FAF6EF]/60">
              {isEditing
                ? "Update the product details in your store."
                : "Fill in the details below to add a product to your store."}
            </p>
          </div>
        </div>
      </div>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
      >
        {/* LEFT */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-[#E4DDCE] bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle
              icon={faBoxOpen}
              title="Product Information"
              subtitle="Basic details about your product"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* NAME */}
              <div className="md:col-span-2">
                <label className={labelClass}>Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={inputClass(error.name)}
                />
                <FieldError msg={error.name} />
              </div>

              {/* CATEGORY */}
              <div>
                <label className={labelClass}>Category</label>
                <select
                  name="category"
                  required
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass(error.category)}
                >
                  <option value="">Select a category</option>
                  <option value="perfume">Perfume</option>
                  <option value="jewellery">Jewellery</option>
                  <option value="women">Women Fashion</option>
                  <option value="men">Men Fashion</option>
                  <option value="bags">Bags & Luggage</option>
                  <option value="glasses">Glasses & Eyewear</option>
                  <option value="fishing">Fishing</option>
                  <option value="electronics">Electronics</option>
                  <option value="deal">Deal of the Day</option>
                  <option value="new-arrival">New Arrival (New Arrivals section)</option>
                </select>
                <FieldError msg={error.category} />
                <label className={`${labelClass} mt-4`}>Homepage Section</label>
                <select
                  name="homepageSection"
                  value={form.homepageSection}
                  onChange={handleChange}
                  className={inputClass(error.homepageSection)}
                >
                  <option value="none">None</option>
                  <option value="latest-products">Latest Products</option>
                </select>
                <FieldError msg={error.homepageSection} />
                <p className="mt-1 text-xs text-[#16241F]/50">
                  Category “New Arrival” controls the New Arrivals section.
                  Latest Products only controls its own homepage section;
                  Best Sellers updates automatically based on sales.
                </p>
              </div>

              {/* SUB CATEGORY */}
              <div>
                <label className={labelClass}>Sub Category</label>
                <select
                  name="subCategory"
                  required={hasSubCategory}
                  value={
                    form.subCategory
                      ? JSON.stringify([
                          form.subcategoryCategory || form.category,
                          form.subCategory,
                        ])
                      : ""
                  }
                  onChange={handleChange}
                  disabled={!form.category || !hasSubCategory}
                  className={`${inputClass(
                    error.subCategory
                  )} disabled:cursor-not-allowed disabled:bg-[#E4DDCE]/40 disabled:text-[#16241F]/35`}
                >
                  <option value="">
                    {!form.category
                      ? "Select category first"
                      : !hasSubCategory
                      ? "No sub category"
                      : "Select a sub category"}
                  </option>
                  {subcategoryGroups.map(([category, items]) =>
                    items.length > 0 ? (
                      <optgroup
                        key={category}
                        label={
                          form.category === "new-arrival"
                            ? `${category[0].toUpperCase()}${category.slice(1)}`
                            : undefined
                        }
                      >
                        {items.map((item) => (
                          <option
                            key={`${category}-${item}`}
                            value={JSON.stringify([category, item])}
                          >
                            {item}
                          </option>
                        ))}
                      </optgroup>
                    ) : null
                  )}
                </select>
                <FieldError msg={error.subCategory} />
              </div>

              {/* PRICE */}
              <div>
                <label className={labelClass}>
                  {isDeal ? "Deal Price" : "Regular Price"}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#B08946]">
                    ৳
                  </span>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    placeholder={isDeal ? "Deal price" : "Regular price"}
                    className={`${inputClass(error.price)} pl-9`}
                  />
                </div>
                <FieldError msg={error.price} />
              </div>

              {!isDeal && (
                <div>
                  <label className={labelClass}>Discount (%)</label>
                  <input
                    type="number"
                    name="discountPercent"
                    min="0"
                    max="99"
                    step="1"
                    value={form.discountPercent}
                    onChange={handleChange}
                    className={inputClass(error.discountPercent)}
                  />
                  <FieldError msg={error.discountPercent} />
                  {Number(form.discountPercent) > 0 &&
                    Number(form.price) > 0 && (
                      <p className="mt-1 text-xs text-[#16241F]/60">
                        Customer pays ৳
                        {Math.round(
                          Number(form.price) *
                            (100 - Number(form.discountPercent)) /
                            100
                        ).toLocaleString()}
                      </p>
                    )}
                </div>
              )}

              {/* DEAL ONLY: OLD PRICE */}
              {isDeal && (
                <div>
                  <label className={labelClass}>Old Price (আগের দাম)</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#B08946]">
                      ৳
                    </span>
                    <input
                      type="number"
                      name="oldPrice"
                      required
                      min="0"
                      value={form.oldPrice}
                      onChange={handleChange}
                      placeholder="Old price"
                      className={`${inputClass(error.oldPrice)} pl-9`}
                    />
                  </div>
                  <FieldError msg={error.oldPrice} />
                </div>
              )}

              {/* STOCK */}
              <div>
                <label className={labelClass}>Stock</label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className={inputClass(error.stock)}
                />
                <FieldError msg={error.stock} />
              </div>

              {/* DEAL ONLY: ENDS AT */}
              {isDeal && (
                <div>
                  <label className={labelClass}>Deal Ends At</label>
                  <input
                    type="datetime-local"
                    name="dealEndsAt"
                    required
                    value={form.dealEndsAt}
                    onChange={handleChange}
                    className={inputClass(error.dealEndsAt)}
                  />
                  <FieldError msg={error.dealEndsAt} />
                </div>
              )}

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea
                  rows={5}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short product description..."
                  className={`${inputClass(error.description)} resize-none`}
                />
                <FieldError msg={error.description} />
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* IMAGE */}
          <div className="rounded-2xl border border-[#E4DDCE] bg-white p-5 shadow-sm">
            <SectionTitle
              icon={faImage}
              title="Product Image"
              subtitle="PNG, JPG or WEBP"
            />

            <label className="group relative flex min-h-56 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-[#E4DDCE] bg-[#FAF6EF]/50 text-[#16241F]/40 transition hover:border-[#B08946] hover:bg-[#FAF6EF]">
              {!prevImg && (
                <>
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#16241F] text-[#B08946] shadow-md transition-colors group-hover:bg-[#B08946] group-hover:text-[#16241F]">
                    <FontAwesomeIcon icon={faCloudArrowUp} className="text-xl" />
                  </span>
                  <span className="text-sm font-semibold text-[#16241F]/70">
                    Click to upload image
                  </span>
                  <span className="text-xs">Max size 5MB</span>
                </>
              )}

              {prevImg && (
                <>
                  <img
                    src={prevImg}
                    alt="Preview"
                    className="h-56 w-full object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-[#16241F]/80 py-2 text-center text-xs font-bold uppercase tracking-wider text-[#B08946] opacity-0 transition-opacity group-hover:opacity-100">
                    Change image
                  </span>
                </>
              )}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>

            <FieldError msg={error.image} />
          </div>

          {/* STATUS + ACTIONS */}
          <div className="rounded-2xl border border-[#E4DDCE] bg-white p-5 shadow-sm">
            <SectionTitle
              icon={faTag}
              title="Publish"
              subtitle="Status and save"
            />

            <div className="mb-4">
              <label className={labelClass}>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass(error.status)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <FieldError msg={error.status} />
            </div>

            {error.server && (
              <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-center text-sm font-medium text-red-500">
                {error.server}
              </p>
            )}

            <div className="flex flex-col gap-2.5">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-[#B08946] px-4 py-2.5 text-sm font-bold text-[#16241F] transition-colors hover:bg-[#C49A52] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Saving..."
                  : isEditing
                    ? "Update Product"
                    : "Save Product"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="rounded-full border border-[#E4DDCE] px-4 py-2.5 text-sm font-semibold text-[#16241F] transition-colors hover:border-[#B08946] hover:text-[#B08946]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;