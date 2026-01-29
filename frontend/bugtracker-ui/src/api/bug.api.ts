import api from "./axios";

export const bugsApi = {
  getMyBugs: (params: any) => api.get("/bugs/my", { params }),

  getBugDetails: (id: string) => api.get(`/bugs/${id}`),

  getUnassignedBugs: (params: any) => api.get("/bugs/unassigned", { params }),

  assignBugToSelf: (id: string) => api.post(`/bugs/${id}/assign`),

  updateBugStatus: (id: string, status: string) =>
    api.patch(`/bugs/${id}/status`, { status }),
};
