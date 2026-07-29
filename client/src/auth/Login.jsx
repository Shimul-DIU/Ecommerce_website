import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook, faGithub } from "@fortawesome/free-brands-svg-icons";
import axiosInstance from "../utils/axiosInstance";

import SignWithFacebook from "./SignInWithFacebook";
import { useNavigate } from "react-router-dom";
import { authContext } from "../context/AuthContext";
import useGoogleSignIn from "../hooks/useGoogleSignIn";

const Login = () => {
  const navigate = useNavigate();
  const signInWithGoogle = useGoogleSignIn();
  const { login } = useContext(authContext);

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  const handleFacebookLogin = async () => {
    await SignWithFacebook();
  };

  const changeHandler = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
      const response = await axiosInstance.post("/api/user/forgot-password", {
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
      const response = await axiosInstance.post("/api/user/login", user);
      setMessage(response.data.message);
      login(response.data.token);
      navigate("/userDashboard", { replace: true });
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-1">

      <div className="w-full max-w-md h-auto bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Login to your account</p>
        </div>


        <form className="space-y-4" onSubmit={handleLogin}>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
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
              className="w-full px-4 py-2 lg:py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex border rounded-lg justify-between items-center focus-within:ring-2 focus-within:ring-blue-500">
              <div className="w-11/12">
                <input
                  type={showPassword ? "text" : "password"}
                  value={user.password}
                  name="password"
                  required
                  onChange={changeHandler}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 lg:py-3 border-gray-300 rounded-lg outline-none"
                />
              </div>
              <div className="mr-3">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500"
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              </div>
            </div>
          </div>

          {message && <p className="text-red-500 text-sm">{message}</p>}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" />
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
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              className="mt-1"
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


          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white py-2 lg:py-3 rounded-lg font-semibold"
          >
            Login
          </button>
        </form>


        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-1 bg-gray-300"></div>
          <p className="text-sm text-gray-500">OR</p>
          <div className="flex-1 h-1 bg-gray-300"></div>
        </div>


        <div className="space-y-2">

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full border border-gray-300 hover:bg-gray-100 transition py-2 lg:py-3 rounded-lg flex items-center justify-center gap-3 font-medium"
          >
            <FontAwesomeIcon icon={faGoogle} className="text-red-500 text-lg" />
            Continue with Google
          </button>


          <button
            onClick={handleFacebookLogin}
            type="button"
            className="w-full border border-gray-300 hover:bg-gray-100 transition py-2 lg:py-3 rounded-lg flex items-center justify-center gap-3 font-medium"
          >
            <FontAwesomeIcon icon={faFacebook} className="text-blue-600 text-lg" />
            Continue with Facebook
          </button>


          <button
            type="button"
            className="w-full border border-gray-300 hover:bg-gray-100 transition py-2 lg:py-3 rounded-lg flex items-center justify-center gap-3 font-medium"
          >
            <FontAwesomeIcon icon={faGithub} className="text-black text-lg" />
            Continue with GitHub
          </button>
        </div>


        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;