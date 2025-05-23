import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api", // Base URL with /api
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Full Request URL:", config.baseURL + config.url);
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
    const token = localStorage.getItem("vetapp-token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to get base URL without /api for image URLs
export const getBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
  return baseUrl.replace('/api', '');
};

export default axiosInstance;