import axiosInstance from "./axiosInstance";

const transactionService = {
  deposit: async (data) => {
    const response = await axiosInstance.post(
      "/transactions/deposit",
      data
    );
    return response.data;
  },

  withdraw: async (data) => {
    const response = await axiosInstance.post(
      "/transactions/withdraw",
      data
    );
    return response.data;
  },

  transfer: async (data) => {
    const response = await axiosInstance.post(
      "/transactions/transfer",
      data
    );
    return response.data;
  },

  getPassbook: async (accountNumber) => {
    const response = await axiosInstance.get(
      `/transactions/passbook/${accountNumber}`
    );
    return response.data;
  },
};

export default transactionService;