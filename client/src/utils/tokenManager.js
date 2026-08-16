let accessToken = null;
// Get Access Token
export const getAccessToken = () => {
  return accessToken;
};
// Set Access Token
export const setAccessToken = (token) => {
  accessToken = token;
};
// Clear Access Token
export const clearAccessToken = () => {
  accessToken = null;
};