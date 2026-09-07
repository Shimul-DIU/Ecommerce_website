// tokenManager.js

let accessToken = null;

// Get access token
export const getAccessToken = () => {
  return accessToken;
};

// Set access token
export const setAccessToken = (token) => {
  accessToken = token;
};

// Clear access token
export const clearAccessToken = () => {
  accessToken = null;
};