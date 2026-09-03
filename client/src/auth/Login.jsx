import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook, faGithub } from "@fortawesome/free-brands-svg-icons";
import axiosInstance from "../utils/axiosInstance";

import SignWithFacebook from "./SignInWithFacebook";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import useGoogleSignIn from "../hooks/useGoogleSignIn";

const Login = () => {
  const navigate = useNavigate();
  const signInWithGoogle = useGoogleSignIn();
  const { login, loading } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [user, setUser] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  const handleFacebookLogin = async () => {
    await SignWithFacebook();
  };

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setMessage("");
  };

  const forgetPasswordHandler = async () => {
    const email = user.email;

    if (!email) {
      setMessage("Please enter your email first");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/auth/user/forgot-password", {
        email,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      setMessage("Please agree to the Terms & Conditions");
      return;
    }

    try {
      await login(
        user.email,
        user.password,
        user.rememberMe,
        agreedToTerms
      );

      navigate("/userDashboard", {
        replace: true,
      });
    } catch (error) {
      console.log("Login error:", error);

      setMessage(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
    <div className="mt-3  min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-6rem)]  flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-4 sm:p-7">

        {/* Skeleton Loader State */}
        {loading ? (
          <div className="animate-pulse space-y-4">
            {/* Header Skeleton */}
            <div className="text-center space-y-2 mb-6">
              <div className="h-7 sm:h-8 bg-gray-200 rounded-md w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/3 mx-auto"></div>
            </div>

            {/* Inputs Skeleton */}
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-11 sm:h-12 bg-gray-200 rounded-lg w-full"></div>
              </div>

              <div className="space-y-1.5">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-11 sm:h-12 bg-gray-200 rounded-lg w-full"></div>
              </div>

              {/* Checkbox & Forgot Password Skeleton */}
              <div className="flex items-center justify-between pt-1">
                <div className="h-4 bg-gray-200 rounded w-28"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>

              {/* Terms Skeleton */}
              <div className="flex items-center gap-2 pt-1">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>

              {/* Login Button Skeleton */}
              <div className="h-10 sm:h-11 bg-gray-300 rounded-lg w-full mt-2"></div>
            </div>

            {/* Divider Skeleton */}
            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-[1px] bg-gray-200"></div>
              <div className="h-3 w-6 bg-gray-200 rounded"></div>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            {/* Social Buttons Skeleton */}
            <div className="space-y-2.5">
              <div className="h-9 sm:h-10 bg-gray-200 rounded-lg w-full"></div>
              <div className="h-9 sm:h-10 bg-gray-200 rounded-lg w-full"></div>
              <div className="h-9 sm:h-10 bg-gray-200 rounded-lg w-full"></div>
            </div>

            {/* Bottom Text Skeleton */}
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-4"></div>
          </div>
        ) : (
          /* Actual Form Content */
          <>
            {/* Heading */}
            <div className="text-center mb-3 sm:mb-5">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome Back</h1>
              <p className="text-gray-500 mt-0.5 sm:mt-1.5 text-sm sm:text-base">
                Login to your account
              </p>
            </div>

            {/* Form */}
            <form className="space-y-2.5 sm:space-y-3.5" onSubmit={handleLogin}>
              {/* Email */}
              <div>
                <label className="block mb-0.5 sm:mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  name="email"
                  required
                  onChange={changeHandler}
                  autoComplete="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 sm:px-5 sm:py-3 text-base sm:text-lg border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block mb-0.5 sm:mb-1 text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="flex border border-gray-300 rounded-lg items-center focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={user.password}
                    name="password"
                    required
                    onChange={changeHandler}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 sm:px-5 sm:py-3 text-base sm:text-lg rounded-lg outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-3 sm:px-4 text-gray-500 text-lg"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </button>
                </div>
              </div>

              {message && <p className="text-red-500 text-sm mt-0.5">{message}</p>}

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm pt-0.5">
                <label className="flex items-center gap-1.5 text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={user.rememberMe}
                    onChange={changeHandler}
                    name="rememberMe"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={forgetPasswordHandler}
                  className="text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-1.5 text-sm text-gray-600 pt-0.5">
                <input
                  type="checkbox"
                  className="mt-0.5 rounded cursor-pointer"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <p className="leading-tight">
                  I agree to the{" "}
                  <span className="text-blue-600 cursor-pointer hover:underline">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-blue-600 cursor-pointer hover:underline">
                    Privacy Policy
                  </span>
                </p>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base mt-1"
              >
                Login
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-2 my-2.5 sm:my-3.5">
              <div className="flex-1 h-[1px] bg-gray-300"></div>
              <p className="text-xs sm:text-sm text-gray-400 font-medium">OR</p>
              <div className="flex-1 h-[1px] bg-gray-300"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-2 sm:space-y-2.5">
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full border border-gray-300 hover:bg-gray-50 transition py-1.5 sm:py-2 rounded-lg flex items-center justify-center gap-2.5 text-sm font-medium text-gray-700"
              >
                <FontAwesomeIcon icon={faGoogle} className="text-red-500 text-lg" />
                Continue with Google
              </button>

              <button
                onClick={handleFacebookLogin}
                type="button"
                className="w-full border border-gray-300 hover:bg-gray-50 transition py-1.5 sm:py-2 rounded-lg flex items-center justify-center gap-2.5 text-sm font-medium text-gray-700"
              >
                <FontAwesomeIcon icon={faFacebook} className="text-blue-600 text-lg" />
                Continue with Facebook
              </button>

              <button
                type="button"
                className="w-full border border-gray-300 hover:bg-gray-50 transition py-1.5 sm:py-2 rounded-lg flex items-center justify-center gap-2.5 text-sm font-medium text-gray-700"
              >
                <FontAwesomeIcon icon={faGithub} className="text-black text-lg" />
                Continue with GitHub
              </button>
            </div>

            {/* Bottom Link */}
            <p className="text-center text-sm text-gray-600 mt-3 sm:mt-5">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;