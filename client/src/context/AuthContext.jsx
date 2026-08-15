/* import { createContext, useState, useEffect } from "react";

// Best Practice: Capital 'A' for AuthContext
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // Multiple Tabs Sync (অন্য ট্যাবে লগআউট বা লগইন করলে এই ট্যাবেও আপডেট হবে)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        setToken(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; */

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext(null);

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

  const login = async (email, password) => {
    const response = await axiosInstance.post(
      "/api/auth/login",
      {
        email,
        password,
      }
    );

    const {
      accessToken,
      user,
    } = response.data;

    // Store access token in React memory
    setAccessToken(accessToken);

    // Store user
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
      "/api/auth/register",
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
        "/api/auth/logout"
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
          "/api/auth/refresh"
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


