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
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

axiosInstance.interceptors.response.use(

  // ---------------------------------------------------
  // SUCCESS
  // ---------------------------------------------------

  (response) => {
    return response;
  },


  // ---------------------------------------------------
  // ERROR
  // ---------------------------------------------------

  async (error) => {

    const originalRequest = error.config;


    // -------------------------------------------------
    // ACCESS TOKEN EXPIRED
    // -------------------------------------------------

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/user/refresh")
    ) {

      originalRequest._retry = true;


      try {

        // ---------------------------------------------
        // GET NEW ACCESS TOKEN
        // ---------------------------------------------

        const response = await axiosInstance.post(
          "/api/user/refresh"
        );


        const newAccessToken =
          response.data.accessToken;


        // ---------------------------------------------
        // SAVE NEW TOKEN IN MEMORY
        // ---------------------------------------------

        setAccessToken(newAccessToken);


        // ---------------------------------------------
        // UPDATE ORIGINAL REQUEST
        // ---------------------------------------------

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;


        // ---------------------------------------------
        // RETRY ORIGINAL REQUEST
        // ---------------------------------------------

        return axiosInstance(originalRequest);

      } catch (refreshError) {

        // ---------------------------------------------
        // REFRESH TOKEN INVALID / EXPIRED
        // ---------------------------------------------

        clearAccessToken();

        return Promise.reject(refreshError);
      }
    }


    return Promise.reject(error);
  }
);


export default axiosInstance;