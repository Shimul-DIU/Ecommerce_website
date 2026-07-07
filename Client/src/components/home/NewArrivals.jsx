import useProducts from "../../hooks/useProducts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHeart,faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useContext,  } from "react";
import { CountContext } from "../../context/countContext";
import { Link } from "react-router-dom";
const NewArrivals = () => {
 const { wishlist, cart, toggleWishlist, toggleCart } =
useContext(CountContext);
  const [products, loading, error] = useProducts();

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <h2 className="text-red-500 text-lg">{error}</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-pulse">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="h-48 rounded-xl bg-gray-200"></div>
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-4 w-1/2 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <>

        <h2 className="text-2xl font-bold mb-4">New Arrivals</h2>
        <div className="grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((item) => (
            <div
              key={item._id}
              className="bg-white relative rounded-xl shadow-md hover:shadow-xl transition-all  hover:scale-[102%] overflow-hidden"
            >
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.name}
                className="h-24 "
              />

              <div>
                <FontAwesomeIcon
                    icon={faShoppingCart}
                    onClick={() => toggleCart(item._id)}
                    className={`absolute top-2 right-2 text-xl cursor-pointer transition
                    ${
                      cart.includes(item._id)
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-blue-600"
                    }`}
                />
                              <FontAwesomeIcon
                    icon={faHeart}
                    onClick={() => toggleWishlist(item._id)}
                    className={`absolute top-10 right-2 text-xl cursor-pointer transition
                    ${
                      wishlist.includes(item._id)
                        ? "text-red-500"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                />
              </div>

              <div className="p-2">
                <h2 className="text-lg font-bold line-clamp-1">
                  {item.name}
                </h2>

                {/* <p className="text-sm text-gray-500">
                  Category: {item.category}
                </p> */}

                  <div className="flex justify-between">
                  <span className="text-xl font-bold text-purple-600">
                    ৳{item.price}
                  </span>

                  {/* <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.status === "In Stock"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span> */}


                <p className="text-sm ">
                  Stock: {item.stock}
                </p>
                    </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>
                <Link to='/checkout' className="flex justify-center">
                    <button className="p-1 hover:bg-cyan-500 text-white bg-green-500 rounded-lg">Order now</button>
                </Link>

              </div>
            </div>
          ))}
        </div>
         </>
      )}
    </div>

  );

};

export default NewArrivals;