// In a constants file (e.g., src/constants/apiEndpoints.js)
export const apiEndpoints = {
  LOGIN: '/auth/login',
  EVENTS: '/events',
  NEWS: '/news',
  VIDEOS: '/videos',
  CONTACT: '/contact',
  DIRECTORY: '/directory',
  
  // ... other endpoints
};

export default apiEndpoints;
// In your component:
// const res = await fetch(`${getApiUrl()}${API_ENDPOINTS.LOGIN}`, {