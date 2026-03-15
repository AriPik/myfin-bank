import axiosInstance from "./axiosInstance";

const beneficiaryService = {
  addBeneficiary: async (data) => {
    const response = await axiosInstance.post(
      "/beneficiaries/add",
      data
    );
    return response.data;
  },

  getMyBeneficiaries: async () => {
    const response = await axiosInstance.get(
      "/beneficiaries/my-beneficiaries"
    );
    return response.data;
  },

  getAllBeneficiaries: async () => {
    const response = await axiosInstance.get(
      "/beneficiaries/all"
    );
    return response.data;
  },

  approveBeneficiary: async (beneficiaryId) => {
    const response = await axiosInstance.patch(
      `/beneficiaries/${beneficiaryId}/approve`
    );
    return response.data;
  },

  rejectBeneficiary: async (beneficiaryId) => {
    const response = await axiosInstance.patch(
      `/beneficiaries/${beneficiaryId}/reject`
    );
    return response.data;
  },
};

export default beneficiaryService;