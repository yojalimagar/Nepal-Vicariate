// src/utils/api.js

export const getApiUrl = () => {
  // Vite exposes environment variables via import.meta.env
  // Variables must be prefixed with VITE_ to be exposed to client-side code.

  // Example for development: VITE_API_URL=http://localhost:5000/api in your .env file
  // Example for production: VITE_API_URL=https://api.yourproductiondomain.com/api set in your hosting provider

  if (import.meta.env.PROD) { // import.meta.env.PROD is true in production builds
    return import.meta.env.VITE_API_URL || 'https://api.yourproductiondomain.com/api';
  } else { // In development, import.meta.env.DEV is true
    return import.meta.env.VITE_API_URL 
  }
};