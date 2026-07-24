import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faCartShopping,
  faUsers,
  faBox,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminDashboard() {
  const stats = [
    {
      id: 1,
      title: "Revenue",
      value: "$12,500",
      icon: faDollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      id: 2,
      title: "Orders",
      value: "320",
      icon: faCartShopping,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 3,
      title: "Customers",
      value: "1,240",
      icon: faUsers,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 4,
      title: "Products",
      value: "540",
      icon: faBox,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const orders = [
    { id: 101, customer: "Shimul", amount: "$120", status: "Pending" },
    { id: 102, customer: "Rahim", amount: "$80", status: "Delivered" },
    { id: 103, customer: "Karim", amount: "$200", status: "Processing" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold hidden sm:block">
          Admin Dashboard
        </h1>
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h2 className="text-xl font-bold">{item.value}</h2>
            </div>

            <div className={`p-3 rounded-full ${item.color}`}>
              <FontAwesomeIcon icon={item.icon} />
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-2">#{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.amount}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium
                      ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-600"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}