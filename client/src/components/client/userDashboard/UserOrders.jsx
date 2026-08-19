import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { Package, MapPin, Phone, User, CreditCard, Truck } from "lucide-react";

const paymentLabels = {
  bkash: "bKash",
  nagad: "Nagad",
  Cash_on_delivery: "Cash on Delivery",
};

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const res = await axiosInstance.get("/api/orders/order-details");

        setOrders(res.data.orders);
      } catch (error) {
        console.log(error);
        setError("অর্ডার লোড করতে সমস্যা হয়েছে।");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Orders</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Track and review all your past orders
          </p>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center">
            <p className="text-red-600 text-sm sm:text-base">{error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium text-base sm:text-lg">No Orders Found</p>
            <p className="text-sm sm:text-base text-slate-400 mt-1">
              Your placed orders will show up here.
            </p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Header strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-slate-50 border-b border-slate-100">
                  <span className="text-xs sm:text-sm text-slate-500 truncate">
                    Order ID: <span className="font-medium text-slate-700">{order._id}</span>
                  </span>
                  {order.status && (
                    <span
                      className={`text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full border capitalize ${statusStyles[order.status] ||
                        "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                    >
                      {order.status}
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col sm:flex-row gap-5">
                  {/* Product */}
                  <div className="flex gap-4 flex-1 min-w-0">
                    <img
                      src={order.productSnapshot?.image}
                      alt={order.productSnapshot?.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex flex-col justify-center">
                      <p className="font-semibold text-slate-900 text-base sm:text-lg truncate">
                        {order.productSnapshot?.name}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                        ID: {order.productSnapshot?.productId}
                      </p>
                      <p className="text-sm sm:text-base text-slate-600 mt-2">
                        ৳{order.productSnapshot?.price?.toLocaleString()} ×{" "}
                        {order.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="sm:w-52 shrink-0 sm:border-l sm:border-slate-100 sm:pl-5 space-y-1.5 sm:space-y-2">
                    <div className="flex justify-between text-sm sm:text-base text-slate-500">
                      <span>Subtotal</span>
                      <span>৳{order.subtotal?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base text-slate-500">
                      <span>Delivery</span>
                      <span>৳{order.deliveryCharge?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-slate-100">
                      <span className="text-sm sm:text-base font-semibold text-slate-900">Total</span>
                      <span className="text-lg sm:text-xl font-bold text-slate-900">
                        ৳{order.total?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer + payment */}
                <div className="border-t border-slate-100 px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/50">
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center gap-2 text-sm sm:text-base text-slate-700">
                      <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-400 shrink-0" />
                      <span>{order.customer?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm sm:text-base text-slate-700">
                      <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-400 shrink-0" />
                      <span>{order.customer?.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm sm:text-base text-slate-700">
                      <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-400 shrink-0" />
                      <span className="truncate">{order.customer?.address}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center gap-2 text-sm sm:text-base text-slate-700">
                      <CreditCard className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-400 shrink-0" />
                      <span>
                        {paymentLabels[order.payment?.method] || order.payment?.method}
                      </span>
                    </div>
                    {order.payment?.mobileNumber && (
                      <div className="flex items-center gap-2 text-sm sm:text-base text-slate-700">
                        <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-400 shrink-0" />
                        <span>{order.payment.mobileNumber}</span>
                      </div>
                    )}
                    {order.payment?.transactionId && (
                      <div className="flex items-center gap-2 text-sm sm:text-base text-slate-700">
                        <Truck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          TrxID: {order.payment.transactionId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
