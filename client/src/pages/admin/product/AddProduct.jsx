import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  faArrowLeft,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axiosInstance from "../../../utils/axiosInstance";
const AddProduct = () => {
  const navigate = useNavigate();
  const [prevImg,setPrevImg]=useState(null)
  const [error, setError] = useState({});

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "Active",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    console.log(e.target)
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
    if (type === "file" && files[0]){
    setPrevImg(URL.createObjectURL(e.target.files[0]));
    }
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError({});

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await axiosInstance.post("/api/admin/add-product",
        formData,
      );

      console.log(response.data);

      navigate("/admin/products");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || {});
      } else {
        setError({
          server: err.message,
        });
      }
    }
  };

  return (
    <div className="px-2">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <h1 className="text-lg font-semibold">
          Add Product
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow p-5">

            <h2 className="font-medium mb-4">
              Product Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Product Name */}

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
                  className={`w-full px-4 py-2 border rounded-lg outline-none ${
                    error.name ? "border-red-500" : ""
                  }`}
                />

                {error.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.name}
                  </p>
                )}
              </div>

              {/* Category */}

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Category
                </label>

                <select
                  name="category"
                  required
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    error.category ? "border-red-500" : ""
                  }`}
                >
                  <option value="">
                    Select a category
                  </option>
                  <option value="deal">
                    Deal of the Day
                  </option>

                  <option value="new-arrival">
                    New Arrival
                  </option>

                  <option value="men">
                    Men Fashion
                  </option>
                  <option value="women">
                    Women Fashion
                  </option>

                  <option value="fishing">
                    Fishing
                  </option>

                  <option value="electronics">
                    Electronics
                  </option>
                </select>

                {error.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.category}
                  </p>
                )}
              </div>
                            {/* Status */}

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    error.status ? "border-red-500" : ""
                  }`}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                {error.status && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.status}
                  </p>
                )}
              </div>

              {/* Price */}

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  required
                  value={form.price}
                  onChange={handleChange}
                  placeholder='Product price'
                  className={`w-full px-4 py-2 border rounded-lg outline-none ${
                    error.price ? "border-red-500" : ""
                  }`}
                />

                {error.price && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.price}
                  </p>
                )}
              </div>

              {/* Stock */}

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  required
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full px-4 py-2 border rounded-lg outline-none ${
                    error.stock ? "border-red-500" : ""
                  }`}
                />

                {error.stock && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.stock}
                  </p>
                )}
              </div>

              {/* Description */}

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
                  className={`w-full px-4 py-2 border rounded-lg resize-none outline-none ${
                    error.description ? "border-red-500" : ""
                  }`}
                />

                {error.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.description}
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="space-y-4">

          <div className="bg-white rounded-xl shadow p-5">

            <h2 className="font-medium mb-6">
              Product Image
            </h2>

            <label className="flex flex-col items-center justify-center gap-2  rounded-lg h-48 cursor-pointer mb-2 text-gray-400 hover:bg-gray-50">

              {!prevImg &&(
                <FontAwesomeIcon
                icon={faCloudArrowUp}
                className="text-2xl"
              />
              )}
              {prevImg ? (
              <img
                src={prevImg}
                alt="Preview"
                className="min-w-full object-cover rounded-lg"
              />
            ):<span className="text-sm">
                Click to upload image
              </span>}


              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />

            </label>

            {error.image && (
              <p className="text-red-500 text-xs mt-2">
                {error.image}
              </p>
            )}



          </div>
                    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">

            {error.server && (
              <p className="text-red-500 text-sm text-center">
                {error.server}
              </p>
            )}

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
            >
              Save Product
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