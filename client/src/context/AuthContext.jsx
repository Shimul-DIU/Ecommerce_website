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

  const login = async (
    email,
    password,
    rememberMe,
    agreedToTerms
  ) => {
    try {
      const response = await axiosInstance.post(
        "/api/auth/user/login",
        {
          email,
          password,
          rememberMe,
          agreedToTerms,
        }
      );

      const newAccessToken =
        response.data.accessToken;

      const userData =
        response.data.user;

      // Save token in React state
      setAccessToken(newAccessToken);

      // Save token in memory manager
      saveTokenToManager(newAccessToken);

      // Save user
      setUser(userData);

      return response.data;

    } catch (error) {
      throw error;
    }
  };

  // ===================================================
  // GOOGLE LOGIN
  // ===================================================

  const googleLogin = (
    newAccessToken,
    userData
  ) => {
    setAccessToken(newAccessToken);
    saveTokenToManager(newAccessToken);
    setUser(userData);
  };

  // ===================================================
  // REGISTER
  // ===================================================

  const register = async (
    fullname,
    email,
    password
  ) => {
    const response = await axiosInstance.post(
      "/api/auth/user/register",
      {
        fullname,
        email,
        password,
      }
    );

    return response.data;
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = async () => {
    try {
      await axiosInstance.post(
        "/api/auth/user/logout"
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data ||
        error.message
      );
    } finally {
      setAccessToken(null);
      clearTokenFromManager();
      setUser(null);
    }
  };

  // ===================================================
  // RESTORE SESSION
  // ===================================================

  const restoreSession = async () => {
    try {
      console.log(
        "Trying to restore session..."
      );

      const response =
        await axiosInstance.post(
          "/api/auth/user/refresh"
        );

      const newAccessToken =
        response.data?.accessToken;

      const userData =
        response.data?.user;

      if (!newAccessToken) {
        throw new Error(
          "Access token missing from refresh response"
        );
      }

      // Save new access token
      setAccessToken(newAccessToken);

      saveTokenToManager(newAccessToken);

      // Restore user
      setUser(userData);

      console.log(
        "Session restored successfully"
      );

    } catch (error) {

      console.error(
        "Session restore failed:",
        error.response?.data ||
        error.message
      );

      setAccessToken(null);

      clearTokenFromManager();

      setUser(null);

    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    restoreSession();
  }, []);

  // ===================================================
  // CONTEXT
  // ===================================================

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,

        login,
        googleLogin,
        register,
        logout,

        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ===================================================
// CUSTOM HOOK
// ===================================================

export const useAuth = () => {
  return useContext(AuthContext);
};