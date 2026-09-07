import axios from "axios";

import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./tokenManager";

// =====================================================
// AXIOS INSTANCE
// =====================================================

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// REFRESH CONTROL
// =====================================================

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => {
    callback(newToken);
  });

  refreshSubscribers = [];
};

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

axiosInstance.interceptors.response.use(
  // SUCCESS
  (response) => {
    return response;
  },

  // ERROR
  async (error) => {
    const originalRequest = error.config;

    // -----------------------------------------------
    // NO RESPONSE
    // -----------------------------------------------

    if (!error.response) {
      return Promise.reject(error);
    }

    // -----------------------------------------------
    // ONLY HANDLE 401
    // -----------------------------------------------

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // -----------------------------------------------
    // DON'T REFRESH THE REFRESH REQUEST
    // -----------------------------------------------

    if (
      !originalRequest ||
      originalRequest.url?.includes("/api/auth/user/refresh")
    ) {
      return Promise.reject(error);
    }

    // -----------------------------------------------
    // DON'T RETRY SAME REQUEST MORE THAN ONCE
    // -----------------------------------------------

    if (originalRequest._retry) {
      clearAccessToken();

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // -----------------------------------------------
    // IF REFRESH IS ALREADY RUNNING
    // WAIT FOR IT
    // -----------------------------------------------

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }

          originalRequest.headers =
            originalRequest.headers || {};

          originalRequest.headers.Authorization =
            `Bearer ${newToken}`;

          resolve(axiosInstance(originalRequest));
        });
      });
    }

    // -----------------------------------------------
    // START REFRESH
    // -----------------------------------------------

    isRefreshing = true;

    try {
      const response = await axiosInstance.post(
        "/api/auth/user/refresh"
      );

      const newAccessToken =
        response.data?.accessToken;

      if (!newAccessToken) {
        throw new Error("New access token not received");
      }

      // ---------------------------------------------
      // SAVE NEW TOKEN IN MEMORY
      // ---------------------------------------------

      setAccessToken(newAccessToken);

      // ---------------------------------------------
      // RELEASE WAITING REQUESTS
      // ---------------------------------------------

      onRefreshed(newAccessToken);

      // ---------------------------------------------
      // RETRY ORIGINAL REQUEST
      // ---------------------------------------------

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return axiosInstance(originalRequest);

    } catch (refreshError) {

      // ---------------------------------------------
      // REFRESH FAILED
      // ---------------------------------------------

      clearAccessToken();

      // Release waiting requests with null
      refreshSubscribers.forEach((callback) => {
        callback(null);
      });

      refreshSubscribers = [];

      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;