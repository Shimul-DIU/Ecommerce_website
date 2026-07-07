import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faTruck,
  faMoneyBillWave,
  faCreditCard,
  faTag,
} from '@fortawesome/free-solid-svg-icons';

// Replace with real cart data (from context/redux/props) later.
const orderItems = [
  {
    id: 1,
    name: "Men's Classic T-Shirt",
    variant: 'Black / L',
    price: 650,
    quantity: 2,
    image: 'https://via.placeholder.com/80x80.png?text=T-Shirt',
  },
  {
    id: 2,
    name: 'Women\'s Perfume - Bloom',
    variant: '50ml',
    price: 1450,
    quantity: 1,
    image: 'https://via.placeholder.com/80x80.png?text=Perfume',
  },
];

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', icon: faMoneyBillWave },
  { id: 'card', label: 'Credit / Debit Card', icon: faCreditCard },
];

const shippingCost = 60;

const Checkout = () => {
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [promoCode, setPromoCode] = useState('');
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
  });

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + shippingCost;

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = () => {
    // Hook up real order submission logic here.
    console.log('Order confirmed:', { address, selectedPayment, orderItems, total });
  };

  return (
    <section className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Address + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faLocationDot} className="text-[#CF15D4]" />
                <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={address.name}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#CF15D4]/40 focus:border-[#CF15D4]"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#CF15D4]/40 focus:border-[#CF15D4]"
                />
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#CF15D4]/40 focus:border-[#CF15D4]"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#CF15D4]/40 focus:border-[#CF15D4]"
                />
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faTruck} className="text-[#CF15D4]" />
                <h2 className="text-lg font-bold text-gray-900">
                  Order Items ({orderItems.length})
                </h2>
              </div>

              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.variant}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900 whitespace-nowrap">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faCreditCard} className="text-[#CF15D4]" />
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors duration-150 ${
                      selectedPayment === method.id
                        ? 'border-[#CF15D4] bg-[#CF15D4]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPayment === method.id}
                      onChange={() => setSelectedPayment(method.id)}
                      className="w-4 h-4 text-[#CF15D4] focus:ring-[#CF15D4]"
                    />
                    <FontAwesomeIcon icon={method.icon} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-800">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Order Summary
              </h2>

              {/* Promo code */}
              <div className="flex items-center gap-2 mb-5">
                <div className="relative flex-1">
                  <FontAwesomeIcon
                    icon={faTag}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#CF15D4]/40 focus:border-[#CF15D4]"
                  />
                </div>
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:border-[#CF15D4] hover:text-[#CF15D4] transition-colors duration-150"
                >
                  Apply
                </button>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>৳{shippingCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-t border-gray-100 mb-6">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#CF15D4] to-[#7B14F9]">
                  ৳{total.toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={handleConfirmOrder}
                className="w-full bg-gradient-to-r from-[#CF15D4] to-[#7B14F9] text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-[#CF15D4]/40 hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
