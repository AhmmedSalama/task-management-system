import axiosInstance from "@/lib/axios";

export const userService = {
  getAllUsers: async (params = {}) => {
    const response = await axiosInstance.get("/users", { params });
    return response.data;
  },

  getUserDetails: async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}/details`);
    return response.data;
  },
};