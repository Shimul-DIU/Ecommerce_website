import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCloudArrowUp, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

export default function AddProduct() {
  const [images, setImages] = useState([]);

  const handleImage = (e) => {
    setImages([...e.target.files]);
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto p-6 bg-gray-100">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-3xl font-bold">Add Product</h1>
          <p className="text-gray-500 mt-1">
            Create a new product
          </p>
        </div>

        <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>

      </div>

      {/* Form */}

      <div className="bg-white rounded-xl shadow p-6">

        <form className="space-y-6">

          {/* Basic Information */}

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block font-medium mb-2">
                Product Name
              </label>

              <input
                type="text"
                placeholder="Enter product name"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                SKU
              </label>

              <input
                type="text"
                placeholder="SKU"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

          </div>

          {/* Category */}

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="block font-medium mb-2">
                Category
              </label>

              <select className="w-full border rounded-lg px-4 py-3">

                <option>Select Category</option>

                <option>Men Fashion</option>

                <option>Women Fashion</option>

                <option>Electronics</option>

                <option>Shoes</option>

              </select>

            </div>

            <div>

              <label className="block font-medium mb-2">
                Brand
              </label>

              <input
                type="text"
                placeholder="Brand Name"
                className="w-full border rounded-lg px-4 py-3"
              />

            </div>

          </div>

          {/* Price */}

          <div className="grid md:grid-cols-3 gap-6">

            <div>

              <label className="block font-medium mb-2">
                Price
              </label>

              <input
                type="number"
                className="w-full border rounded-lg px-4 py-3"
              />

            </div>

            <div>

              <label className="block font-medium mb-2">
                Discount Price
              </label>

              <input
                type="number"
                className="w-full border rounded-lg px-4 py-3"
              />

            </div>

            <div>

              <label className="block font-medium mb-2">
                Stock
              </label>

              <input
                type="number"
                className="w-full border rounded-lg px-4 py-3"
              />

            </div>

          </div>

          {/* Description */}

          <div>

            <label className="block font-medium mb-2">
              Description
            </label>

            <textarea
              rows="5"
              placeholder="Product description..."
              className="w-full border rounded-lg px-4 py-3"
            ></textarea>

          </div>

          {/* Image Upload */}

          <div>

            <label className="block font-medium mb-2">
              Product Images
            </label>

            <label className="border-2 border-dashed rounded-xl h-52 flex flex-col justify-center items-center cursor-pointer hover:border-blue-500">

              <FontAwesomeIcon
                icon={faCloudArrowUp}
                className="text-5xl text-gray-400 mb-3"
              />

              <p className="text-gray-500">
                Click to upload product images
              </p>

              <input
                type="file"
                multiple
                hidden
                onChange={handleImage}
              />

            </label>

            {images.length > 0 && (

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-5">

                {images.map((img, index) => (

                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    alt=""
                    className="h-24 w-full rounded-lg object-cover"
                  />

                ))}

              </div>

            )}

          </div>

          {/* Status */}

          <div>

            <label className="block font-medium mb-2">
              Status
            </label>

            <select className="w-full border rounded-lg px-4 py-3">

              <option>Active</option>

              <option>Inactive</option>

            </select>

          </div>

          {/* Button */}

          <div className="flex justify-end">

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2"
            >

              <FontAwesomeIcon icon={faFloppyDisk} />

              Save Product

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}