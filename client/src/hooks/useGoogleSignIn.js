// hooks/useGoogleSignIn.js
import { useContext } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase.config";
import axiosInstance from "../utils/axiosInstance";
import { authContext } from "../context/AuthContext";

const useGoogleSignIn = () => {
  const navigate = useNavigate();
  const { login } = useContext(authContext);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;

      const res = await axiosInstance.post("/api/user/google-login", {
        fullname: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        firebaseId: user.uid,
      });

      login(res.data.token);
      navigate("/userDashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return signInWithGoogle;
};

export default useGoogleSignIn;