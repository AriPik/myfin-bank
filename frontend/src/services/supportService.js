import axiosInstance from "./axiosInstance";

const supportService = {
  createTicket: async (data) => {
    const response = await axiosInstance.post(
      "/support/tickets/create",
      data
    );
    return response.data;
  },

  getMyTickets: async () => {
    const response = await axiosInstance.get(
      "/support/tickets/my-tickets"
    );
    return response.data;
  },

  getAllTickets: async () => {
    const response = await axiosInstance.get(
      "/support/tickets/all"
    );
    return response.data;
  },

  sendMessage: async (ticketId, data) => {
    const response = await axiosInstance.post(
      `/support/tickets/${ticketId}/messages/send`,
      data
    );
    return response.data;
  },

  getMessages: async (ticketId) => {
    const response = await axiosInstance.get(
      `/support/tickets/${ticketId}/messages`
    );
    return response.data;
  },

  markInProgress: async (ticketId) => {
    const response = await axiosInstance.patch(
      `/support/tickets/${ticketId}/in-progress`
    );
    return response.data;
  },

  resolveTicket: async (ticketId) => {
    const response = await axiosInstance.patch(
      `/support/tickets/${ticketId}/resolve`
    );
    return response.data;
  },
};

export default supportService;