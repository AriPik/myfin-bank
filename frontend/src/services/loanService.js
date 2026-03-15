import axiosInstance from "./axiosInstance";

const loanService = {
  applyLoan: async (data) => {
    const response = await axiosInstance.post(
      "/loans/apply",
      data
    );
    return response.data;
  },

  getMyLoans: async () => {
    const response = await axiosInstance.get("/loans/my-loans");
    return response.data;
  },

  getAllLoans: async () => {
    const response = await axiosInstance.get("/loans/all");
    return response.data;
  },

  approveLoan: async (loanId) => {
    const response = await axiosInstance.patch(
      `/loans/${loanId}/approve`
    );
    return response.data;
  },

  rejectLoan: async (loanId) => {
    const response = await axiosInstance.patch(
      `/loans/${loanId}/reject`
    );
    return response.data;
  },

  getLoanPayments: async (loanId) => {
    const response = await axiosInstance.get(
      `/loans/${loanId}/payments`
    );
    return response.data;
  },
};

export default loanService;