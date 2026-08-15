//
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faEnvelope,

  faShoppingCart,
  faHeart,
  faHistory,
  faChartLine,
  faBell,
  faCog,
  faHome,
  faBox,
  faTruck,
  faWallet,
  faStar,
  faEdit,
  faCamera,
  faSpinner,
  faCheckCircle,
  faPhone,
  faMapMarkerAlt,
  faCalendarAlt,
  faUserCog
} from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const { logout, token } = useContext(authContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    reviews: 0,
    totalSpent: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profileRes, statsRes, ordersRes] = await Promise.all([
          axiosInstance.get("/api/auth/user/profile", {
            headers: { Authorization: token }
          }),
          axiosInstance.get("/api/auth/user/stats", {
            headers: { Authorization: token }
          }),
          axiosInstance.get("/api/auth/user/orders/recent", {
            headers: { Authorization: token }
          })
        ]);

        setUser(profileRes.data);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Couldn't load dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDashboardData();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name = "") => {
    if (!name) return "U";
    return name
      .trim()
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-blue-600 text-4xl animate-spin" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                E
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">E-Shop</span>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <FontAwesomeIcon icon={faBell} className="text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faCog} className="text-xl" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Welcome back, {user?.fullname}!</h1>
              <p className="text-blue-100 mt-1">Here's what's happening with your account today.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm">
                View Profile
              </button>
              <button className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                Start Shopping
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faShoppingCart} className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faHeart} className="text-red-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Wishlist</p>
                <p className="text-2xl font-bold text-gray-900">{stats.wishlist}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.reviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faWallet} className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalSpent}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-500" />

              <div className="px-6 pb-6">
                <div className="flex justify-center -mt-10">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullname}
                      className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full border-4 border-white bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                      {getInitials(user?.fullname)}
                    </div>
                  )}
                </div>

                <div className="text-center mt-3">
                  <h2 className="text-lg font-bold text-gray-900">{user?.fullname}</h2>
                  <span className="inline-block mt-1 text-xs font-medium uppercase tracking-wide text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {user?.role || "Customer"}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FontAwesomeIcon icon={faEnvelope} className="text-blue-500 w-4" />
                    <span>{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FontAwesomeIcon icon={faPhone} className="text-blue-500 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user?.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 w-4" />
                    <span>Joined {formatDate(user?.createdAt)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/profile")}
                  className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors">
                  <FontAwesomeIcon icon={faShoppingCart} className="text-blue-600 text-2xl mb-2" />
                  <p className="text-sm font-medium text-gray-700">New Order</p>
                </button>
                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors">
                  <FontAwesomeIcon icon={faBox} className="text-purple-600 text-2xl mb-2" />
                  <p className="text-sm font-medium text-gray-700">Track Order</p>
                </button>
                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">
                  <FontAwesomeIcon icon={faHeart} className="text-green-600 text-2xl mb-2" />
                  <p className="text-sm font-medium text-gray-700">Wishlist</p>
                </button>
                <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl text-center transition-colors">
                  <FontAwesomeIcon icon={faTruck} className="text-orange-600 text-2xl mb-2" />
                  <p className="text-sm font-medium text-gray-700">Returns</p>
                </button>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <FontAwesomeIcon icon={faShoppingCart} className="text-gray-300 text-4xl mb-3" />
                  <p className="text-gray-500">No orders yet</p>
                  <button className="mt-2 text-blue-600 hover:underline">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <FontAwesomeIcon icon={faBox} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.id?.slice(0, 8)}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-900">${order.total}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;