// tokenManager.js

let accessToken = null;
let adminAccessToken = null;

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

export const getAdminAccessToken = () => {
  return adminAccessToken;
};

export const setAdminAccessToken = (token) => {
  adminAccessToken = token;
};

export const clearAdminAccessToken = () => {
  adminAccessToken = null;
};
