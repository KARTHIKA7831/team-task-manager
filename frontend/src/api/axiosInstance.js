
import axios from "axios";

const axiosInstance = axios.create({
 baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json"
  }
 });

 // Add token to every API request
axiosInstance.interceptors.request.use((config) => {

    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Attach token to request headers
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosInstance;
