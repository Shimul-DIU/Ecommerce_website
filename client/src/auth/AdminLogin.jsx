import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const AdminLogin = () => {
  const [message,setMessage]=useState('')
  const [formData,setFormData]=useState({
    email:'',

  })
    const navigate=useNavigate()

    const handleChange = (e) => {
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));

  if (e.target.name === "email" && e.target.value.trim() !== "") {
    setMessage("");
  }
};

  const handleForgotPassword = async() => {
  try {
    if (!formData.email.trim()) {
    setMessage("Email is required");
    return;
  }

  setMessage("");
  const response = await axiosInstance.post("/api/auth/admin/forgot-password",
    formData,
  );
  // console.log(`response send serer ${response}`)
  setMessage(response.data.message)

  }catch (error) {
    console.log(error);
  setMessage(

    error.response?.data?.message || "Something went wrong"
  );
}

};

  const submitHandler = async (e) => {
    try {
       e.preventDefault();
       const res = await axiosInstance.post("/api/admin/login",
         formData,
       );
       console.log(res)
       localStorage.setItem('adminToken',res.data.token)
     navigate("/admin", { replace: true });
      console.log(res.data);
    }
    catch (error) {
  setMessage(
    error.response?.data?.message || "Login failed"
  );
}


  };

  return (
    <div className="min-h-screen w-full bg-gray-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-4 sm:p-6 rounded">

        <form onSubmit={submitHandler}>

          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Admin Login</h1>
            <h3 className="text-sm sm:text-base text-gray-600">
              Sign in to access dashboard
            </h3>
          </div>

          {/* EMAIL */}
          <label htmlFor="email" className="text-sm sm:text-base">Email :</label>
          <input

            type="email"
            name="email"
            id="email"

            required
            onChange={handleChange}
            placeholder="admin@gmail.com"
            className="w-full p-2 text-sm sm:text-base border border-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded mb-3"
          />
            { message && (
            <p className="text-red-600">{message}</p>
          )}

          {/* PASSWORD */}
          <label htmlFor="password" className="text-sm sm:text-base">Password :</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            onChange={handleChange}
            placeholder="******"
            className="w-full p-2 text-sm sm:text-base border border-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 rounded mb-4"
          />

          {/* extra options */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <input type="checkbox" />
              <p>Remember me</p>
            </div>


            <button type="button" className="text-blue-600 cursor-pointer" onClick={handleForgotPassword}>
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="bg-black text-white w-full p-2 text-sm sm:text-base rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;