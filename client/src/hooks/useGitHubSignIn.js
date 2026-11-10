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
    const response = await signInWithPopup(auth, provider);
    const user = response.user;

    if (!user.email) {
      const error = new Error("GitHub did not provide an email address");
      error.code = "auth/missing-email";
      throw error;
    }

    const res = await axiosInstance.post("/api/auth/user/github-login", {
      fullname: user.displayName || "Social user",
      email: user.email,
      photoURL: user.photoURL,
      firebaseId: user.uid,
      provider: "github",
    });

    if (!res.data?.accessToken || !res.data?.user) {
      throw new Error("Social login response is incomplete");
    }

    googleLogin(res.data.accessToken, res.data.user);
    navigate("/userDashboard");
  };

  return signInWithGitHub;
};

export default useGitHubSignIn;