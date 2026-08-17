import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axiosInstance from "../utils/axiosInstance";
import {
  setAccessToken as saveTokenToManager,
  clearAccessToken as clearTokenFromManager,
} from "../utils/tokenManager";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===================================================
  // LOGIN
  // ===================================================

  const login = async (email, password, rememberMe, agreedToTerms) => {
    const response = await axiosInstance.post("/api/auth/user/login", {
      email,
      password,
      rememberMe,
      agreedToTerms,
    });

    const { accessToken, user } = response.data;

    setAccessToken(accessToken);       // React state (UI-এর জন্য)
    saveTokenToManager(accessToken);   // ✅ axiosInstance যেটা আসলে ব্যবহার করে
    setUser(user);

    return response.data;
  };

  // ===================================================
  // REGISTER
  // ===================================================

  const register = async (fullname, email, password) => {
    const response = await axiosInstance.post("/api/auth/user/register", {
      fullname,
      email,
      password,
    });

    return response.data;
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = async () => {
    try {
      await axiosInstance.post("/api/auth/user/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAccessToken(null);
      clearTokenFromManager(); // ✅
      setUser(null);
    }
  };

  // ===================================================
  // RESTORE LOGIN SESSION
  // ===================================================

  const restoreSession = async () => {
    try {
      const response = await axiosInstance.post("/api/auth/user/refresh");

      setAccessToken(response.data.accessToken);
      saveTokenToManager(response.data.accessToken); // ✅
      setUser(response.data.user);
    } catch (error) {
      setAccessToken(null);
      clearTokenFromManager(); // ✅
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL APP LOAD
  // ===================================================

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);