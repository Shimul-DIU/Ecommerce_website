import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const { logout, token } = useContext(authContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/api/user/profile", {
          headers: {
            Authorization: token,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.log(err);
        setError("Couldn't load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const getInitials = (name = "") =>
    name
      .trim()
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center text-gray-500">
            Loading your profile...
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          user && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Cover / Banner */}
              <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-700" />

              {/* Avatar */}
              <div className="flex justify-center -mt-12">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullname}
                    className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold shadow-md">
                    {getInitials(user.fullname)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center mt-4 px-8">
                <h1 className="text-2xl font-bold text-gray-800">
                  {user.fullname}
                </h1>
                {user.role && (
                  <span className="inline-block mt-1 text-xs font-medium uppercase tracking-wide text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {user.role}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="mt-6 px-8 pb-8 space-y-4">
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 rounded-lg px-4 py-3">
                  <FontAwesomeIcon icon={faEnvelope} className="text-blue-500" />
                  <span className="text-sm">{user.email}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 rounded-lg px-4 py-3">
                  <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                  <span className="text-sm">User ID: {user.id}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition duration-300 text-white py-3 rounded-lg font-semibold mt-4"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Logout
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Profile;