import axiosInstance from "./axiosInstance";

const fdService = {
  openFD: async (data) => {
    const response = await axiosInstance.post("/fd/open", data);
    return response.data;
  },

  getMyFDs: async () => {
    const response = await axiosInstance.get("/fd/my-fds");
    return response.data;
  },

  liquidateFD: async (fdId) => {
    const response = await axiosInstance.post(
      `/fd/${fdId}/liquidate`
    );
    return response.data;
  },
};

export default fdService;