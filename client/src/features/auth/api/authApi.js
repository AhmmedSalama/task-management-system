import apiClient from "@/lib/apiClient";

export const loginApi = (data) => {
  return apiClient.post("/auth/login", data);
};

export const registerApi = (data) => {
  return apiClient.post("/auth/register", data);
};

export const meApi = () => {
  return apiClient.get("/users/me");
};