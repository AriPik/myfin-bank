import axiosInstance from "./axiosInstance";

const rdService = {
  openRD: async (data) => {
    const response = await axiosInstance.post("/rd/open", data);
    return response.data;
  },

  getMyRDs: async () => {
    const response = await axiosInstance.get("/rd/my-rds");
    return response.data;
  },

  payInstallment: async (rdId) => {
    const response = await axiosInstance.post(
      `/rd/${rdId}/pay-installment`
    );
    return response.data;
  },
};

export default rdService;