import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  faArrowLeft,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const AddProduct = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "Active",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError(null);

     const response= await axios.post(
        "http://localhost:5000/api/admin/add-product",
        form
      );
      setError(response.data)
      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <div className="px-2">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className="text-lg font-semibold">Add Product</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* Left: main fields */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-medium mb-4">Product Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Nike Air Max"
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? "border-red-400" : ""
                  }`}
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? "border-red-400" : ""
                  }`}
                >
                  <option value="">Select Category</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Men Fashion">Men Fashion</option>
                  <option value="Electronics">Electronics</option>
                </select>

                {error && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? "border-red-400" : ""
                  }`}
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? "border-red-400" : ""
                  }`}
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Short product description..."
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: image + actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-medium mb-4">Product Image</h2>

            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg h-48 cursor-pointer text-gray-400 hover:bg-gray-50">
              <FontAwesomeIcon icon={faCloudArrowUp} className="text-2xl" />
              <span className="text-sm">Click to upload image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>

          <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
            >
              Save Product
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="border py-2 rounded-lg font-medium hover:bg-gray-100"
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