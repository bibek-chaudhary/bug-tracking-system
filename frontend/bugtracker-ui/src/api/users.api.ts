import api from "./axios";

export const usersApi = {
  getDevelopers: () => api.get("/users/developers"),
};
