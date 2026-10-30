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
  setAdminAccessToken,
  clearAdminAccessToken,
} from "../utils/tokenManager";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);

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
  // ADMIN LOGIN
  // ===================================================

  const loginAdmin = async (email, password) => {
    const response = await axiosInstance.post(
      "/api/auth/admin/login",
      {
        email,
        password,
      }
    );

    const newAccessToken =
      response.data?.accessToken;

    if (!newAccessToken) {
      throw new Error(
        "Access token missing from admin login response"
      );
    }

    // Save admin access token in memory manager
    setAdminAccessToken(newAccessToken);

    // Save admin data
    setAdmin(response.data.admin);

    return response.data;
  };

  // ===================================================
  // ADMIN LOGOUT
  // ===================================================

  const logoutAdmin = async () => {
    try {
      await axiosInstance.post(
        "/api/auth/admin/logout"
      );
    } catch (error) {
      console.error(
        "Admin logout error:",
        error.response?.data ||
        error.message
      );
    } finally {
      clearAdminAccessToken();
      setAdmin(null);
    }
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
  // RESTORE ADMIN SESSION
  // ===================================================

  const restoreAdminSession = async () => {
    try {
      const response =
        await axiosInstance.post(
          "/api/auth/admin/refresh"
        );

      const newAccessToken =
        response.data?.accessToken;

      if (!newAccessToken) {
        throw new Error(
          "Access token missing from admin refresh response"
        );
      }

      setAdminAccessToken(newAccessToken);
      setAdmin(response.data.admin);

    } catch (error) {

      // 401 simply means "no active admin session" - not an error
      if (error.response?.status !== 401) {
        console.error(
          "Admin session restore failed:",
          error.response?.data ||
          error.message
        );
      }

      clearAdminAccessToken();
      setAdmin(null);

    } finally {
      setAdminLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    // Auth tokens must never be persisted in localStorage.
    // Clean up any legacy/stale token entries that may exist.
    ["accessToken", "refreshToken", "token", "authToken", "userToken"].forEach(
      (key) => {
        try {
          localStorage.removeItem(key);
        } catch {
          /* ignore */
        }
      }
    );

    const handleUserSessionExpired = () => {
      setAccessToken(null);
      setUser(null);
    };

    const handleAdminSessionExpired = () => {
      setAdmin(null);
    };

    window.addEventListener(
      "user-session-expired",
      handleUserSessionExpired
    );

    window.addEventListener(
      "admin-session-expired",
      handleAdminSessionExpired
    );

    restoreSession();
    restoreAdminSession();

    return () => {
      window.removeEventListener(
        "user-session-expired",
        handleUserSessionExpired
      );

      window.removeEventListener(
        "admin-session-expired",
        handleAdminSessionExpired
      );
    };
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
        admin,
        adminLoading,

        login,
        googleLogin,
        loginAdmin,
        logoutAdmin,
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