

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Access token React memory-তে থাকবে
  const [accessToken, setAccessToken] = useState(null);

  // Logged-in user
  const [user, setUser] = useState(null);

  // Initial authentication check
  const [loading, setLoading] = useState(true);


  // ===================================================
  // LOGIN
  // ===================================================

  const login = async (email, password, rememberMe,agreedToTerms) => {
  const response = await axiosInstance.post(
    "/api/auth/user/login",
    {
      email,
      password,
      rememberMe,
      agreedToTerms
    }
  );

  const {
    accessToken,
    user,
  } = response.data;

  setAccessToken(accessToken);
  setUser(user);

  return response.data;
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
      console.error("Logout error:", error);
    } finally {

      // Clear React memory
      setAccessToken(null);

      // Clear user
      setUser(null);
    }
  };


  // ===================================================
  // RESTORE LOGIN SESSION
  // ===================================================

  const restoreSession = async () => {
    try {

      const response =
        await axiosInstance.post(
          "/api/auth/user/refresh"
        );

      setAccessToken(
        response.data.accessToken
      );

      setUser(
        response.data.user
      );

    } catch (error) {

      setAccessToken(null);

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
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


