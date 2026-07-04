import { useEffect, useState } from "react";
import {
  faPlus,
  faPen,
  faTrash,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminProducts = () => {
  const [message,setMessage]=useState('')
  const [products,setProducts]=useState([])
  useEffect(()=>{
    const fetchProducts=async()=>{
           try {
        const response=await axios.get('http://localhost:5000/api/products')
    await setProducts(response.data.data)
   
    }catch (error) {
      setMessage(error.response.message)
    }

    }
     fetchProducts()

  },[])

  return (
    <div className="px-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-6">
        <h1 className="text-lg font-semibold">Products</h1>

        <Link to='/admin/products/add'  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-3 mb-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 ">
          <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400" />
          </div>

          <input
            type="text"
            placeholder="Search Product..."
            className="w-full pl-11 pr-4 py-1 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>


          <select className="border rounded-lg px-4 p-1">
            <option>All Categories</option>
            <option>Shoes</option>
            <option>Men Fashion</option>
            <option>Electronics</option>
          </select>

          <select className="border rounded-lg px-4 py-1">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>


      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((item) => (
              <tr key={item._id} className="border-t hover:bg-gray-50">
                <td className="p-2">
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                </td>

                <td className=" font-medium">{item.name}</td>

                <td className="">{item.category}</td>

                <td className="">${item.price}</td>

                <td className="">{item.stock}</td>

                <td className="">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="p-2">
                  <div className="flex justify-center gap-3">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg">
                      <FontAwesomeIcon icon={faPen} />
                    </button>

                    <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {message && <p className="text-red-500">{message}</p>}

        {/* Pagination */}
        <div className="flex justify-between mt-3 items-center p-3 border-t">
          <p className="text-gray-500">Showing 1-3 of 3 Products</p>

          <div className="flex gap-2">
            <button className="border px-3 py-1 rounded-lg hover:bg-gray-100">
              Previous
            </button>

            <button className="bg-blue-600 text-white px-4 py-1 rounded-lg">
              1
            </button>

            <button className="border px-4 py-1 rounded-lg hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;