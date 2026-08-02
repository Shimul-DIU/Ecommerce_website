import { useEffect, useState } from "react";
import { CheckCircle2, Package, Home, Receipt,  Check } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
 const location=useLocation()
 console.log(location)
 console.log(location.state.order)
  const [visible, setVisible] = useState(false);
  const order = location.state.order
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);


  const subtotal = order.subtotal

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Success header */}
        <div className="bg-emerald-50 px-6 pt-8 pb-6 text-center border-b border-slate-100">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Order Placed Successfully</h1>
          <p className="text-sm text-slate-500 mt-1">
            Thank you! We've received your order and will process it shortly.
          </p>
        </div>

        {/* Order details */}
        <div className="px-6 py-6 space-y-5">
          <div className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
            <div>
              <p className="text-xs text-slate-500">Order ID</p>
              <p className="text-sm font-medium text-slate-900">{order.productSnapshot.productId}</p>
            </div>
            <button

              className="p-2 rounded-md hover:bg-slate-200 transition-colors"
              aria-label="Copy order ID"
            >

                <Check className="w-4 h-4 text-emerald-600" />

            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-500">Order Date</p>
              <p className="font-medium text-slate-900">{order.createdAt}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Payment Method</p>
              <p className="font-medium text-slate-900">{order.paymentMethod}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-slate-500">Estimated Delivery</p>
              <p className="font-medium text-slate-900 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-slate-400" />
                {order.estimatedDelivery}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
              Items
            </p>
            <div className="space-y-2">

                <div  className="flex justify-between text-sm">
                  <span className="text-slate-700">
                    {order.productSnapshot.name} <span className="text-slate-400">x{order.quantity}</span>
                  </span>
                  <span className="text-slate-900 font-medium">
                  ৳{(order.productSnapshot.price * order.quantity).toLocaleString()}
                  </span>
                </div>

            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-900">Total</span>
            <span className="text-lg font-bold text-slate-900">
              ৳{(order.total || subtotal).toLocaleString()}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5 pt-2">
            <Link to='/userDashboard/user-orders'
               state={order}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Receipt className="w-4 h-4" />
              View Order Details
            </Link>
            <button

              className="w-full flex items-center justify-center gap-2 bg-white text-slate-700 text-sm font-medium py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Home className="w-4 h-4" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
