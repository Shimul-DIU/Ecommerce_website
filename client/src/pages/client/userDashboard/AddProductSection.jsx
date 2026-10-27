import React, { useState } from "react";
import { PlusCircle, ImagePlus, X, ChevronDown, ChevronUp } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";

const initialForm = {
  name: "",
  price: "",
  category: "",
  stock: "",
  description: "",
};

export default function AddProductSection({ onProductAdded }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!form.name || !form.price) {
      setMessage({ type: "error", text: "Product name আর price দিতে হবে।" });
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (image) data.append("image", image);

      const res = await axiosInstance.post("/api/products/add-product", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ type: "success", text: "Product সফলভাবে add হয়েছে!" });
      setForm(initialForm);
      removeImage();
      onProductAdded?.(res.data.product);
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Product add করা যায়নি, আবার চেষ্টা করো।",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header (click করলে open/close হবে) */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-50 p-2">
            <PlusCircle className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-slate-900">Add Product</h2>
            <p className="text-xs text-slate-500">তোমার নিজের product এখানে add করো</p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="border-t border-slate-100 p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="যেমন: Wireless Headphone"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Price (৳) *
              </label>
              <input
                type="number"
                name="price"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="1500"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Electronics"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="10"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="Product সম্পর্কে কিছু লেখো..."
                className={inputClass}
              />
            </div>

            {/* Image upload */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Product Image
              </label>

              {preview ? (
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-28 w-28 rounded-lg border border-slate-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-500">
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {message.text && (
            <p
              className={`mt-4 text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
            >
              {message.text}
            </p>
          )}

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}