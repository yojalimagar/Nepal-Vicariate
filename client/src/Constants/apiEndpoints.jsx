// In a constants file (e.g., src/constants/apiEndpoints.js)
export const apiEndpoints = {
  REGISTER: '/api/auth/register/',
  LOGIN: '/api/auth/login/',
  EVENTS: '/api/events/',
  NEWS: '/api/news/',
  VIDEOS: '/api/videos/',
  CONTACT: '/api/contact/',
  DIRECTORY: '/api/directory/',
  PARISH: '/api/parishes/',
  GALLERY: '/api/gallery/'
  
  // ... other endpoints
};

export default apiEndpoints;
// In your component:
// const res = await fetch(`${getApiUrl()}${API_ENDPOINTS.LOGIN}`, {