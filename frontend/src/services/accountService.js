import axiosInstance from "./axiosInstance";

const accountService = {
  requestAccount: async (data) => {
    const response = await axiosInstance.post(
      "/accounts/request",
      data
    );
    return response.data;
  },

  getMyAccounts: async () => {
    const response = await axiosInstance.get(
      "/accounts/my-accounts"
    );
    return response.data;
  },

  getAllAccounts: async () => {
    const response = await axiosInstance.get("/accounts/all");
    return response.data;
  },

  approveAccount: async (accountNumber) => {
    const response = await axiosInstance.patch(
      `/accounts/${accountNumber}/approve`
    );
    return response.data;
  },

  rejectAccount: async (accountNumber) => {
    const response = await axiosInstance.patch(
      `/accounts/${accountNumber}/reject`
    );
    return response.data;
  },

  activateAccount: async (accountNumber) => {
    const response = await axiosInstance.patch(
      `/accounts/${accountNumber}/activate`
    );
    return response.data;
  },

  deactivateAccount: async (accountNumber) => {
    const response = await axiosInstance.patch(
      `/accounts/${accountNumber}/deactivate`
    );
    return response.data;
  },
};

export default accountService;