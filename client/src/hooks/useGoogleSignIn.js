import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase.config";
import axiosInstance from "../utils/axiosInstance";

const useGoogleSignIn = () => {
  const navigate = useNavigate();

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

      const token = res.data.token;
      localStorage.setItem("googletoken", token);
      navigate("/profile");
    } catch (error) {
      console.log(error);

    }
  };

  return signInWithGoogle;
};

export default  useGoogleSignIn ;