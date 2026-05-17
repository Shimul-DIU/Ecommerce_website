import React, { useState } from "react";
import { app } from "../firebase/firebase.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEye,faEyeSlash,} from "@fortawesome/free-solid-svg-icons";
import {faGoogle,faFacebook,faGithub,} from "@fortawesome/free-brands-svg-icons";



import SignWithGoogle from "./SignInWithGoogle";
import SignWithFacebook from "./SignInWithFacebook";


const Login = () => {

const [showPassword, setShowPassword] = useState(false);
const [user,setUser]=useState(null)


  const handleGoogleLogin=async()=>{
        await SignWithGoogle();

    }
  const handleFacebookLogin=async()=>{
    await SignWithFacebook();
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-1">
        <div>

        </div>
      {/* Login Card */}
      <div className="w-full max-w-md h-auto bg-white rounded-2xl shadow-xl p-8">

        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Login to your account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4"  >

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 lg:py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="flex border rounded-lg justify-between items-center  focus-within:ring-2 focus-within:ring-blue-500">
              <div className="w-11/12">
                <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-2 lg:py-3  border-gray-300 rounded-lg outline-none "
              />
              </div>
              <div className="mr-3">
                  <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className=" text-gray-500"
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                />
              </button>
              </div>



            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" />
              Remember me
            </label>

            <a
              href="/"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <input type="checkbox" className="mt-1" />

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
            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white py-2 lg:py-3 rounded-lg font-semibold"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-1 bg-gray-300"></div>

          <p className="text-sm text-gray-500">
            OR
          </p>

          <div className="flex-1 h-1 bg-gray-300"></div>
        </div>

        {/* Social Login */}
        <div className="space-y-2">

          {/* Google */}
          <button onClick={handleGoogleLogin} className="w-full border border-gray-300 hover:bg-gray-100 transition py-2 lg:py-3 rounded-lg flex items-center justify-center gap-3 font-medium">
            <FontAwesomeIcon
              icon={faGoogle}
              className="text-red-500 text-lg"
            />

            Continue with Google
          </button>

          {/* Facebook */}
          <button onClick={handleFacebookLogin} className="w-full border border-gray-300 hover:bg-gray-100 transition py-2 lg:py-3 rounded-lg flex items-center justify-center gap-3 font-medium">
            <FontAwesomeIcon
              icon={faFacebook}
              className="text-blue-600 text-lg"
            />

            Continue with Facebook
          </button>

          {/* Github */}
          <button className="w-full border border-gray-300 hover:bg-gray-100 transition py-2 lg:py-3 rounded-lg flex items-center justify-center gap-3 font-medium">
            <FontAwesomeIcon
              icon={faGithub}
              className="text-black text-lg"
            />

            Continue with GitHub
          </button>
        </div>

        {/* Bottom */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
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