import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faArrowLeft, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosInstance from "../../../utils/axiosInstance";

const categoryItems = {
  perfume: ["Men's Perfume", "Women's Perfume", "Attar", "Body Spray"],
  jewellery: ["Ring", "Necklace", "Earring", "Bracelet"],
  women: ["Dress", "Saree", "Bag", "Shoes"],
  men: ["T-Shirt", "Shirt", "Pant", "Shoes", "Watch"],
  fishing: [
    "Fishing Rods",
    "Fishing Reels",
    "Fishing Lines",
    "Fishing Hooks",
    "Fishing Lures",
    "Fishing Accessories",
  ],
  electronics: ["Mobile", "Laptop", "Headphone", "Keyboard", "Mouse"],
};

const inputClass = (hasError) =>
  `w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100 ${hasError ? "border-red-500" : ""
  }`;

const FieldError = ({ msg }) =>
  msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;

const AddProduct = () => {
  const navigate = useNavigate();

  const [prevImg, setPrevImg] = useState(null);
  const [error, setError] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    subCategory: "",
    price: "",
    oldPrice: "",
    stock: "",
    dealEndsAt: "",
    status: "Active",
    description: "",
    image: null,
  });

  const isDeal = form.category === "deal";
  const hasSubCategory = !!categoryItems[form.category];

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
        oldPrice: value === "deal" ? prev.oldPrice : "",
        dealEndsAt: value === "deal" ? prev.dealEndsAt : "",
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
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value);
        }
      });

      await axiosInstance.post("/api/admin/add-product", formData);
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

  return (
    <div className="px-2">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border hover:bg-gray-100 transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className="text-lg font-semibold">Add Product</h1>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-medium mb-4">Product Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NAME */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Product Name
                </label>
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
                <label className="block text-sm text-gray-600 mb-1">
                  Category
                </label>
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
                  <option value="fishing">Fishing</option>
                  <option value="electronics">Electronics</option>
                  <option value="deal">Deal of the Day</option>
                  <option value="new-arrival">New Arrival</option>
                </select>
                <FieldError msg={error.category} />
              </div>

              {/* SUB CATEGORY */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Sub Category
                </label>
                <select
                  name="subCategory"
                  required={hasSubCategory}
                  value={form.subCategory}
                  onChange={handleChange}
                  disabled={!form.category || !hasSubCategory}
                  className={`${inputClass(error.subCategory)} disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
                >
                  <option value="">
                    {!form.category
                      ? "Select category first"
                      : !hasSubCategory
                        ? "No sub category"
                        : "Select a sub category"}
                  </option>
                  {hasSubCategory &&
                    categoryItems[form.category].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
                <FieldError msg={error.subCategory} />
              </div>

              {/* STATUS */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Status
                </label>
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

              {/* PRICE */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {isDeal ? "Deal Price" : "Price"}
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Product price"
                  className={inputClass(error.price)}
                />
                <FieldError msg={error.price} />
              </div>

              {/* DEAL ONLY: OLD PRICE */}
              {isDeal && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Old Price (আগের দাম)
                  </label>
                  <input
                    type="number"
                    name="oldPrice"
                    required
                    min="0"
                    value={form.oldPrice}
                    onChange={handleChange}
                    placeholder="Old price"
                    className={inputClass(error.oldPrice)}
                  />
                  <FieldError msg={error.oldPrice} />
                </div>
              )}

              {/* STOCK */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Stock
                </label>
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
                  <label className="block text-sm text-gray-600 mb-1">
                    Deal Ends At
                  </label>
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
                <label className="block text-sm text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
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
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-medium mb-6">Product Image</h2>

            <label className="flex flex-col items-center justify-center gap-2 rounded-lg min-h-48 cursor-pointer mb-2 text-gray-400 hover:bg-gray-50 overflow-hidden border border-dashed">
              {!prevImg && (
                <>
                  <FontAwesomeIcon icon={faCloudArrowUp} className="text-2xl" />
                  <span className="text-sm">Click to upload image</span>
                </>
              )}

              {prevImg && (
                <img
                  src={prevImg}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
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

          <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
            {error.server && (
              <p className="text-red-500 text-sm text-center">
                {error.server}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium transition"
            >
              {submitting ? "Saving..." : "Save Product"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="border py-2 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;