import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import {
  faGoogle,
  faFacebook,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6">
          Login
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
          />

          {/* Password */}
          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>

          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <span className="text-sm text-blue-600 cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          {/* Login Button */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Login
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">

          <button className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100">
            <FontAwesomeIcon icon={faGoogle} />
            Continue with Google
          </button>

          <button className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100">
            <FontAwesomeIcon icon={faFacebook} />
            Continue with Facebook
          </button>

          <button className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100">
            <FontAwesomeIcon icon={faGithub} />
            Continue with GitHub
          </button>

        </div>

        {/* Register */}
        <p className="text-center text-sm mt-5 text-gray-600">
          Don’t have an account?{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">
            Register
          </span>
        </p>

      </div>

    </div>
  );
};

export default Login;