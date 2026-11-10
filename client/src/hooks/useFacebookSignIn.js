// hooks/useFacebookSignIn.js
import { useContext } from "react";
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase.config";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";

const useFacebookSignIn = () => {
  const navigate = useNavigate();
  const { googleLogin } = useContext(AuthContext);

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    provider.addScope("email");
    const response = await signInWithPopup(auth, provider);
    const user = response.user;

    if (!user.email) {
      const error = new Error("Facebook did not provide an email address");
      error.code = "auth/missing-email";
      throw error;
    }

    const res = await axiosInstance.post("/api/auth/user/facebook-login", {
      fullname: user.displayName || "Social user",
      email: user.email,
      photoURL: user.photoURL,
      firebaseId: user.uid,
      provider: "facebook",
    });

    if (!res.data?.accessToken || !res.data?.user) {
      throw new Error("Social login response is incomplete");
    }

    googleLogin(res.data.accessToken, res.data.user);
    navigate("/userDashboard");
  };

  return signInWithFacebook;
};

export default useFacebookSignIn;