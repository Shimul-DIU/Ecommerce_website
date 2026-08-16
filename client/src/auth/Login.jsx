import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook, faGithub } from "@fortawesome/free-brands-svg-icons";
import axiosInstance from "../utils/axiosInstance";

import SignWithFacebook from "./SignInWithFacebook";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import useGoogleSignIn from "../hooks/useGoogleSignIn";

const Login = () => {
  const navigate = useNavigate();
  const signInWithGoogle = useGoogleSignIn();
  const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [user, setUser] = useState({
    email: "",
    password: "",
    rememberMe:false
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
    <div className="mt-20 sm:mt-24 min-h-[calc(100vh-6rem)] bg-gray-100 flex items-center justify-center px-4 py-6">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-7">
        {/* Heading */}
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-1.5 text-sm sm:text-base">
            Login to your account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-3.5" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
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
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
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
                className="w-full px-4 py-2 text-base rounded-lg outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 text-gray-500"
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </button>
            </div>
          </div>

          {message && <p className="text-red-500 text-xs mt-1">{message}</p>}

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded" checked={user.rememberMe}
              onChange={changeHandler} name="rememberMe" />
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
          <div className="flex items-start gap-2 text-sm text-gray-600 pt-0.5">
            <input
              type="checkbox"
              className="mt-1 rounded cursor-pointer"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <p>
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
            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white py-2.5 rounded-lg font-semibold text-base"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 my-3.5">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <p className="text-xs text-gray-400 font-medium">OR</p>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        {/* Social Login */}
        <div className="space-y-2.5">
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full border border-gray-300 hover:bg-gray-50 transition py-2 rounded-lg flex items-center justify-center gap-3 text-sm font-medium text-gray-700"
          >
            <FontAwesomeIcon icon={faGoogle} className="text-red-500 text-lg" />
            Continue with Google
          </button>

          <button
            onClick={handleFacebookLogin}
            type="button"
            className="w-full border border-gray-300 hover:bg-gray-50 transition py-2 rounded-lg flex items-center justify-center gap-3 text-sm font-medium text-gray-700"
          >
            <FontAwesomeIcon icon={faFacebook} className="text-blue-600 text-lg" />
            Continue with Facebook
          </button>

          <button
            type="button"
            className="w-full border border-gray-300 hover:bg-gray-50 transition py-2 rounded-lg flex items-center justify-center gap-3 text-sm font-medium text-gray-700"
          >
            <FontAwesomeIcon icon={faGithub} className="text-black text-lg" />
            Continue with GitHub
          </button>
        </div>

        {/* Bottom */}
        <p className="text-center text-sm text-gray-600 mt-5">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;