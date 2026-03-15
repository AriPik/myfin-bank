import axiosInstance from "./axiosInstance";

const authService = {
  registerCustomer: async (formData) => {
    const response = await axiosInstance.post(
      "/auth/customer/register",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  loginCustomer: async (data) => {
    const response = await axiosInstance.post(
      "/auth/customer/login",
      data
    );
    return response.data;
  },

  loginAdmin: async (data) => {
    const response = await axiosInstance.post(
      "/auth/admin/login",
      data
    );
    return response.data;
  },

  forgotPasswordCustomer: async (data) => {
    const response = await axiosInstance.post(
      "/auth/customer/forgot-password",
      data
    );
    return response.data;
  },

  resetPasswordCustomer: async (data) => {
    const response = await axiosInstance.post(
      "/auth/customer/reset-password",
      data
    );
    return response.data;
  },

  forgotPasswordAdmin: async (data) => {
    const response = await axiosInstance.post(
      "/auth/admin/forgot-password",
      data
    );
    return response.data;
  },

  resetPasswordAdmin: async (data) => {
    const response = await axiosInstance.post(
      "/auth/admin/reset-password",
      data
    );
    return response.data;
  },
};

export default authService;