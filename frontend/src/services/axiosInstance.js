import axios from "axios";
let inMemoryToken = localStorage.getItem("admin_token") || localStorage.getItem("customer_token") || null;
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true,
});
export const setAuthToken = (token) => {
  inMemoryToken = token;
};
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      localStorage.removeItem("customer_token");
      localStorage.removeItem("customer_user");
      window.location.href = "/login/customer";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;