import api from "../api/axios";

export const userService = {
  getDevelopers: async () => {
    const res = await api.get("/users/developers");
    return res.data;
  },
};
