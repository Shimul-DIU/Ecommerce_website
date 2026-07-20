import { useEffect, useState } from "react";
import axios from "axios";

// TODO: adjust this to match your actual backend route
// e.g. `${import.meta.env.VITE_API_URL}/orders?email=${user.email}`
const ORDERS_API_URL = "/api/orders";

const statusStyles = {
  pending: "bg-yellow-50 text-yellow-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const MyOrders = ({ userEmail }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!userEmail) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(ORDERS_API_URL, {
          params: { email: userEmail },
        });
        // Newest orders first
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setOrders(sorted);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Could not load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userEmail]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto py-16 px-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-4xl mx-auto py-16 px-6 text-center">
        <p className="text-red-600">{error}</p>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="max-w-4xl mx-auto py-20 px-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          No orders yet
        </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven&apos;t placed any orders yet.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-all duration-300"
        >
          Start Shopping
        </a>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        My Orders
      </h2>

      <div className="space-y-5">
        {orders.map((order) => {
          const isExpanded = expandedId === order._id;
          const status = (order.status || "pending").toLowerCase();

          return (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Summary row */}
              <button
                onClick={() => toggleExpand(order._id)}
                className="w-full flex flex-wrap items-center justify-between gap-3 p-5 text-left"
              >
                <div>
                  <p className="text-sm text-gray-500">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                    statusStyles[status] || "bg-gray-50 text-gray-700"
                  }`}
                >
                  {status}
                </span>

                <p className="text-sm font-semibold text-gray-800">
                  ${Number(order.total).toFixed(2)}
                </p>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-5 bg-gray-50">
                  <ul className="divide-y divide-gray-200">
                    {order.items?.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between py-3 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.name}
                            </p>
                            <p className="text-gray-500 text-xs">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 font-medium">
                          ${Number(item.price * item.quantity).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>

                  {order.shippingAddress && (
                    <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                      <p className="font-medium text-gray-800 mb-1">
                        Shipping Address
                      </p>
                      <p>{order.shippingAddress}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MyOrders;
