import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiLock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await axiosInstance.post(
        `/api/auth/user/reset-password/${token}`,
        { password }
      );

      setMessage(response.data.message);
      setIsSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FiLock className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-500 text-sm">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({ ...errors, password: "" });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
              <p className="mt-1.5 text-xs text-gray-400">
                Must be at least 8 characters
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors({ ...errors, confirmPassword: "" });
                  }
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${errors.confirmPassword
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                  }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Strength Indicator */}
            {password && password.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${password.length < 4
                          ? "w-1/4 bg-red-500"
                          : password.length < 8
                            ? "w-2/4 bg-yellow-500"
                            : "w-full bg-green-500"
                        }`}
                    />
                  </div>
                  <span className="text-xs text-gray-500 min-w-[60px]">
                    {password.length < 4
                      ? "Weak"
                      : password.length < 8
                        ? "Medium"
                        : "Strong"}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              value={ResetPassword}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-[1.02] ${isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating Password...
                </div>
              ) : (
                "Update Password"
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                ← Back to Login
              </button>
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${isSuccess
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                  }`}
              >
                {isSuccess ? (
                  <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Secure password reset • Token expires in 1 hour
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;