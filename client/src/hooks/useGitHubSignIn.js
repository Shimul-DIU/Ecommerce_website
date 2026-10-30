// hooks/useGitHubSignIn.js
import { useContext } from "react";
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase.config";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";

const useGitHubSignIn = () => {
  const navigate = useNavigate();
  const { googleLogin } = useContext(AuthContext);

  const signInWithGitHub = async () => {
    const provider = new GithubAuthProvider();
    provider.addScope("user:email");
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;

      const res = await axiosInstance.post("/api/auth/user/github-login", {
        fullname: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        firebaseId: user.uid,
        provider: "github",
      });

      googleLogin(res.data.accessToken, res.data.user);
      navigate("/userDashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return signInWithGitHub;
};

export default useGitHubSignIn;