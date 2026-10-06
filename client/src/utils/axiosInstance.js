import axios from "axios";

import {
  clearAccessToken,
  clearAdminAccessToken,
  getAccessToken,
  getAdminAccessToken,
  setAccessToken,
  setAdminAccessToken,
} from "./tokenManager";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const refreshStates = {
  user: { isRefreshing: false, subscribers: [] },
  admin: { isRefreshing: false, subscribers: [] },
};

const isAdminRequest = (url = "") =>
  url.includes("/api/admin/") || url.includes("/api/auth/admin/");

const isSessionEndpoint = (url = "") =>
  /\/api\/auth\/(user|admin)\/(login|refresh|logout|register|forgot-password|reset-password|google-login)/.test(url);

const getSessionType = (config) =>
  isAdminRequest(config.url) ? "admin" : "user";

const setAuthorizationHeader = (config, token) => {
  config.headers = config.headers || {};
  config.headers.Authorization = `Bearer ${token}`;
};

const settleRefreshSubscribers = (sessionType, token) => {
  const state = refreshStates[sessionType];
  state.subscribers.forEach((callback) => callback(token));
  state.subscribers = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = isAdminRequest(config.url)
      ? getAdminAccessToken()
      : getAccessToken();

    if (token) {
      setAuthorizationHeader(config, token);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    if (isSessionEndpoint(originalRequest.url) || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const sessionType = getSessionType(originalRequest);
    const state = refreshStates[sessionType];
    const refreshUrl = sessionType === "admin"
      ? "/api/auth/admin/refresh"
      : "/api/auth/user/refresh";
    const saveToken = sessionType === "admin"
      ? setAdminAccessToken
      : setAccessToken;
    const clearToken = sessionType === "admin"
      ? clearAdminAccessToken
      : clearAccessToken;

    if (state.isRefreshing) {
      return new Promise((resolve, reject) => {
        state.subscribers.push((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }

          setAuthorizationHeader(originalRequest, newToken);
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    state.isRefreshing = true;

    try {
      const response = await axiosInstance.post(refreshUrl);
      const newAccessToken = response.data?.accessToken;

      if (!newAccessToken) {
        throw new Error("New access token not received");
      }

      saveToken(newAccessToken);
      settleRefreshSubscribers(sessionType, newAccessToken);
      setAuthorizationHeader(originalRequest, newAccessToken);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearToken();
      settleRefreshSubscribers(sessionType, null);
      window.dispatchEvent(
        new CustomEvent(`${sessionType}-session-expired`)
      );
      return Promise.reject(refreshError);
    } finally {
      state.isRefreshing = false;
    }
  }
);

export default axiosInstance;
