
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true,
});
export const setAuthToken = () => {};
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token") ||
                  localStorage.getItem("customer_token");
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
      const user = JSON.parse(
        localStorage.getItem("admin_user") ||
        localStorage.getItem("customer_user") || "{}"
      );
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      localStorage.removeItem("customer_token");
      localStorage.removeItem("customer_user");
      if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
        window.location.href = "/login/admin";
      } else {
        window.location.href = "/login/customer";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;