import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import {
  faGoogle,
  faFacebook,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import axiosInstance from "../utils/axiosInstance";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const formHandler = async (e) => {
    e.preventDefault();
    setMessage("");

    if (user.password !== user.confirmPassword) {
      setError((prev) => ({
        ...prev,
        confirmPassword: "Password not matched",
      }));
      return;
    }
    setError({
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    try {
      await axiosInstance.post("/api/auth/user/register", user);
      navigate("/login");
    } catch (error) {
      const serverError = error.response?.data?.error;
      if (serverError) {
        setError((prev) => ({
          ...prev,
          ...serverError,
        }));
      }
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const changeHandler = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="mt-20 sm:mt-24 min-h-[calc(100vh-6rem)] bg-gray-100 flex items-center justify-center px-4 py-6">
      {/* Register Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-7">
        {/* Heading */}
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 mt-1.5 text-sm sm:text-base">
            Register your new account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-3.5" onSubmit={formHandler}>
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              required
              onChange={changeHandler}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error.fullname && (
              <p className="text-red-500 text-xs mt-1">{error.fullname}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              onChange={changeHandler}
              placeholder="Enter your email"
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error.email && (
              <p className="text-red-500 text-xs mt-1">{error.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex border border-gray-300 rounded-lg items-center focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                onChange={changeHandler}
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
            {error.password && (
              <p className="text-red-500 text-xs mt-1">{error.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="flex border border-gray-300 rounded-lg items-center focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                onChange={changeHandler}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 text-base rounded-lg outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="px-3 text-gray-500"
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
              </button>
            </div>
            {error.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {error.confirmPassword}
              </p>
            )}
          </div>

          {message && (
            <div
              className={`text-center text-sm ${
                message.includes("successful")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          {/* Terms */}
          <div className="flex items-start gap-2 text-sm text-gray-600 pt-1">
            <input type="checkbox" className="mt-1 rounded cursor-pointer" />
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

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white py-2.5 rounded-lg font-semibold text-base"
          >
            Register
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
          <button className="w-full border border-gray-300 hover:bg-gray-50 transition py-2 rounded-lg flex items-center justify-center gap-3 text-sm font-medium text-gray-700">
            <FontAwesomeIcon icon={faGoogle} className="text-red-500 text-lg" />
            Continue with Google
          </button>

          <button className="w-full border border-gray-300 hover:bg-gray-50 transition py-2 rounded-lg flex items-center justify-center gap-3 text-sm font-medium text-gray-700">
            <FontAwesomeIcon icon={faFacebook} className="text-blue-600 text-lg" />
            Continue with Facebook
          </button>

          <button className="w-full border border-gray-300 hover:bg-gray-50 transition py-2 rounded-lg flex items-center justify-center gap-3 text-sm font-medium text-gray-700">
            <FontAwesomeIcon icon={faGithub} className="text-black text-lg" />
            Continue with GitHub
          </button>
        </div>

        {/* Bottom */}
        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;