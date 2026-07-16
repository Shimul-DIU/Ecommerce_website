import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {faEye, faEyeSlash,} from "@fortawesome/free-solid-svg-icons";

import{faGoogle,faFacebook,faGithub,} from "@fortawesome/free-brands-svg-icons";
import axiosInstance from "../utils/axiosInstance";

const Register = () => {
  const navigate=useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const[message,setMessage]=useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error,setError]=useState({
    fullname:'',
    email:'',
    password:'',
    confirmPassword:''
  })
  const [user,setUser]=useState({
    fullname:"",
    email:"",
    password:"",
    confirmPassword: ""
  })
  const formHandler=async(e)=>{
    e.preventDefault();
    setMessage('');

    if (user.password !== user.confirmPassword) {
      setError((prev)=>({
        ...prev,
        confirmPassword:'Password not matched'
      }));
      return;
    }
    setError({
      fullname:"",
      email:"",
      password:"",
      confirmPassword: '',

    })

    // transfer form data to backend
    try {

        await axiosInstance.post("/api/user/register", user);

      navigate('/login')

    } catch (error) {
        const serverError=error.response?.data?.error;
        if (serverError){
            setError((prev)=>({
                ...prev,
                ...serverError
            }));
        }
        setMessage(error.response?.data?.message || 'Registration failed. Please try again.');

    }
  }
  const changeHandler=(e)=>{
    setUser((prev)=>({
      ...prev,
      [e.target.name]:e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-1">

      {/* Register Card */}
      <div className="w-full max-w-md h-auto bg-white rounded-2xl shadow-xl p-8">

        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold text-gray-800">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Register your new account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={formHandler}>

          {/* Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              name="fullname" required
              onChange={changeHandler}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 lg:py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error.fullname  && <p className="text-red-500 text-sm">{error.fullname}</p>}


          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email" required
              onChange={changeHandler}
              placeholder="Enter your email"
              className="w-full px-4 py-2 lg:py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
                    {error.email  && <p className="text-red-500 text-sm">{error.email}</p>}


          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="flex border border-gray-300 rounded-lg justify-between items-center focus-within:ring-2 focus-within:ring-blue-500">


              <div className="w-11/12">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" required
                  onChange={changeHandler}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 lg:py-3 rounded-lg outline-none"
                />
              </div>

              <div className="mr-3">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500"
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEye:faEyeSlash }
                  />
                </button>
              </div>

            </div>
          </div>
                    {error.password  && <p className="text-red-500 text-sm">{error.password}</p>}


          {/* Confirm Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="flex border border-gray-300 rounded-lg justify-between items-center focus-within:ring-2 focus-within:ring-blue-500">

              <div className="w-11/12">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name='confirmPassword' required
                  onChange={changeHandler}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 lg:py-3 rounded-lg outline-none"
                />
              </div>

              <div className="mr-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="text-gray-500"
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEye:faEyeSlash }
                  />
                </button>
              </div>

            </div>
          </div>
                    {error.confirmPassword  && <p className="text-red-500 text-sm">{error.confirmPassword}</p>}


          {message && (
            <div className={`text-center text-sm ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </div>
          )}
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

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white py-2 lg:py-3 rounded-lg font-semibold"
          >
            Register
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
          <button className="w-full border border-gray-300 hover:bg-gray-100 transition py-2 lg:py-3 rounded-lg flex items-center justify-center gap-3 font-medium">
            <FontAwesomeIcon
              icon={faGoogle}
              className="text-red-500 text-lg"
            />

            Continue with Google
          </button>

          {/* Facebook */}
          <button className="w-full border border-gray-300 hover:bg-gray-100 transition py-2 lg:py-3 rounded-lg flex items-center justify-center gap-3 font-medium">
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