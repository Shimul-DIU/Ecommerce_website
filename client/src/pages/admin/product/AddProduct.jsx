import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  faArrowLeft,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axiosInstance from "../../../utils/axiosInstance";


// ============================================================
// CATEGORY → SUB CATEGORY
// ============================================================

const categoryItems = {
  perfume: [
    "Men's Perfume",
    "Women's Perfume",
    "Attar",
    "Body Spray",
  ],

  jewellery: [
    "Ring",
    "Necklace",
    "Earring",
    "Bracelet",
  ],

  women: [
    "Dress",
    "Saree",
    "Bag",
    "Shoes",
  ],

  men: [
    "T-Shirt",
    "Shirt",
    "Pant",
    "Shoes",
    "Watch",
  ],

  fishing: [
    "Fishing Rods",
    "Fishing Reels",
    "Fishing Lines",
    "Fishing Hooks",
    "Fishing Lures",
    "Fishing Accessories",
  ],

  electronics: [
    "Mobile",
    "Laptop",
    "Headphone",
    "Keyboard",
    "Mouse",
  ],
};


const AddProduct = () => {
  const navigate = useNavigate();

  // ============================================================
  // IMAGE PREVIEW
  // ============================================================

  const [prevImg, setPrevImg] = useState(null);

  // ============================================================
  // ERROR STATE
  // ============================================================

  const [error, setError] = useState({});


  // ============================================================
  // FORM STATE
  // ============================================================

  const [form, setForm] = useState({
    name: "",
    category: "",
    subCategory: "",
    price: "",
    stock: "",
    status: "Active",
    description: "",
    image: null,
  });


  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      files,
      type,
    } = e.target;


    // ==========================================================
    // FILE INPUT
    // ==========================================================

    if (type === "file") {
      const file = files?.[0];

      setForm((prev) => ({
        ...prev,
        [name]: file || null,
      }));


      // Image preview
      if (file) {
        setPrevImg(URL.createObjectURL(file));
      }

      setError({});

      return;
    }


    // ==========================================================
    // CATEGORY CHANGE
    // ==========================================================

    if (name === "category") {
      setForm((prev) => ({
        ...prev,
        category: value,

        // Category change করলে পুরোনো subCategory reset হবে
        subCategory: "",
      }));

      setError({});

      return;
    }


    // ==========================================================
    // OTHER INPUTS
    // ==========================================================

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError({});
  };


  // ============================================================
  // HANDLE SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Clear previous errors
      setError({});


      // ========================================================
      // FORM DATA
      // ========================================================

      const formData = new FormData();


      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });


      // ========================================================
      // API REQUEST
      // ========================================================

      const response = await axiosInstance.post(
        "/api/admin/add-product",
        formData
      );


      console.log("Product added:", response.data);


      // ========================================================
      // SUCCESS
      // ========================================================

      navigate("/admin/products");

    } catch (err) {

      console.error("Add product error:", err);


      // ========================================================
      // BACKEND ERROR
      // ========================================================

      if (err.response) {

        setError(
          err.response.data.error || {
            server: err.response.data.message || "Something went wrong",
          }
        );

      } else {

        setError({
          server: err.message || "Something went wrong",
        });

      }
    }
  };


  return (
    <div className="px-2">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center gap-3 mb-6">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="
            w-9 h-9
            flex items-center justify-center
            rounded-lg
            border
            hover:bg-gray-100
            transition
          "
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>


        <h1 className="text-lg font-semibold">
          Add Product
        </h1>

      </div>


      {/* ======================================================
          FORM
      ====================================================== */}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >


        {/* ====================================================
            LEFT SIDE
        ==================================================== */}

        <div className="lg:col-span-2 space-y-4">


          {/* ==================================================
              PRODUCT INFORMATION
          ================================================== */}

          <div className="bg-white rounded-xl shadow p-5">

            <h2 className="font-medium mb-4">
              Product Information
            </h2>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


              {/* =================================================
                  PRODUCT NAME
              ================================================= */}

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
                  className={`
                    w-full
                    px-4 py-2
                    border
                    rounded-lg
                    outline-none
                    focus:ring-2
                    focus:ring-blue-100
                    ${error.name
                      ? "border-red-500"
                      : ""
                    }
                  `}
                />


                {error.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.name}
                  </p>
                )}

              </div>


              {/* =================================================
                  CATEGORY
              ================================================= */}

              <div>

                <label className="block text-sm text-gray-600 mb-1">
                  Category
                </label>


                <select
                  name="category"
                  required
                  value={form.category}
                  onChange={handleChange}
                  className={`
                    w-full
                    px-4 py-2
                    border
                    rounded-lg
                    outline-none
                    ${error.category
                      ? "border-red-500"
                      : ""
                    }
                  `}
                >

                  <option value="">
                    Select a category
                  </option>


                  <option value="perfume">
                    Perfume
                  </option>


                  <option value="jewellery">
                    Jewellery
                  </option>


                  <option value="women">
                    Women Fashion
                  </option>


                  <option value="men">
                    Men Fashion
                  </option>


                  <option value="fishing">
                    Fishing
                  </option>


                  <option value="electronics">
                    Electronics
                  </option>


                  <option value="deal">
                    Deal of the Day
                  </option>


                  <option value="new-arrival">
                    New Arrival
                  </option>

                </select>


                {error.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.category}
                  </p>
                )}

              </div>


              {/* =================================================
                  SUB CATEGORY
              ================================================= */}

              <div>

                <label className="block text-sm text-gray-600 mb-1">
                  Sub Category
                </label>


                <select
                  name="subCategory"
                  required
                  value={form.subCategory}
                  onChange={handleChange}
                  disabled={
                    !form.category ||
                    !categoryItems[form.category]
                  }
                  className={`
                    w-full
                    px-4 py-2
                    border
                    rounded-lg
                    outline-none

                    disabled:bg-gray-100
                    disabled:text-gray-400
                    disabled:cursor-not-allowed

                    ${error.subCategory
                      ? "border-red-500"
                      : ""
                    }
                  `}
                >

                  <option value="">
                    {!form.category
                      ? "Select category first"
                      : !categoryItems[form.category]
                        ? "No sub category"
                        : "Select a sub category"}
                  </option>


                  {/* ============================================
                      DYNAMIC SUB CATEGORY
                  ============================================ */}

                  {form.category &&
                    categoryItems[form.category]?.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}

                </select>


                {error.subCategory && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.subCategory}
                  </p>
                )}

              </div>


              {/* =================================================
                  STATUS
              ================================================= */}

              <div>

                <label className="block text-sm text-gray-600 mb-1">
                  Status
                </label>


                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={`
                    w-full
                    px-4 py-2
                    border
                    rounded-lg
                    outline-none
                    ${error.status
                      ? "border-red-500"
                      : ""
                    }
                  `}
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>


                {error.status && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.status}
                  </p>
                )}

              </div>


              {/* =================================================
                  PRICE
              ================================================= */}

              <div>

                <label className="block text-sm text-gray-600 mb-1">
                  Price
                </label>


                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Product price"
                  className={`
                    w-full
                    px-4 py-2
                    border
                    rounded-lg
                    outline-none
                    ${error.price
                      ? "border-red-500"
                      : ""
                    }
                  `}
                />


                {error.price && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.price}
                  </p>
                )}

              </div>


              {/* =================================================
                  STOCK
              ================================================= */}

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
                  className={`
                    w-full
                    px-4 py-2
                    border
                    rounded-lg
                    outline-none
                    ${error.stock
                      ? "border-red-500"
                      : ""
                    }
                  `}
                />


                {error.stock && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.stock}
                  </p>
                )}

              </div>


              {/* =================================================
                  DESCRIPTION
              ================================================= */}

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
                  className={`
                    w-full
                    px-4 py-2
                    border
                    rounded-lg
                    resize-none
                    outline-none
                    ${error.description
                      ? "border-red-500"
                      : ""
                    }
                  `}
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


        {/* ====================================================
            RIGHT SIDE
        ==================================================== */}

        <div className="space-y-4">


          {/* ==================================================
              PRODUCT IMAGE
          ================================================== */}

          <div className="bg-white rounded-xl shadow p-5">

            <h2 className="font-medium mb-6">
              Product Image
            </h2>


            <label
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-2
                rounded-lg
                min-h-48
                cursor-pointer
                mb-2
                text-gray-400
                hover:bg-gray-50
                overflow-hidden
                border
                border-dashed
              "
            >

              {/* ==============================================
                  NO IMAGE
              ============================================== */}

              {!prevImg && (
                <>
                  <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    className="text-2xl"
                  />

                  <span className="text-sm">
                    Click to upload image
                  </span>
                </>
              )}


              {/* ==============================================
                  IMAGE PREVIEW
              ============================================== */}

              {prevImg && (
                <img
                  src={prevImg}
                  alt="Preview"
                  className="
                    w-full
                    h-48
                    object-cover
                    rounded-lg
                  "
                />
              )}


              {/* ==============================================
                  FILE INPUT
              ============================================== */}

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


          {/* ==================================================
              BUTTONS
          ================================================== */}

          <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">


            {/* SERVER ERROR */}

            {error.server && (
              <p className="text-red-500 text-sm text-center">
                {error.server}
              </p>
            )}


            {/* SAVE */}

            <button
              type="submit"
              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                py-2
                rounded-lg
                font-medium
                transition
              "
            >
              Save Product
            </button>


            {/* CANCEL */}

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="
                border
                py-2
                rounded-lg
                font-medium
                hover:bg-gray-100
                transition
              "
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