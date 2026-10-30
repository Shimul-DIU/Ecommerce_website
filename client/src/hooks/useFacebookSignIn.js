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
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;

      const res = await axiosInstance.post("/api/auth/user/facebook-login", {
        fullname: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        firebaseId: user.uid,
        provider: "facebook",
      });

      googleLogin(res.data.accessToken, res.data.user);
      navigate("/userDashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return signInWithFacebook;
};

export default useFacebookSignIn;