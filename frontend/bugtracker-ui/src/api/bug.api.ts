import type { BugQueryParams, CreateBugRequest } from "../types/bug.types";
import api from "./axios";

export const bugsApi = {
  getMyBugs: async (params: BugQueryParams) => {
    const response = await api.get("/bugs/my", { params });

    return response.data;
  },

  getUnassignedBugs: async (params: BugQueryParams) => {
    const response = await api.get("/bugs/unassigned", { params });

    return response.data;
  },

  getBugDetails: (id: string) => api.get(`/bugs/${id}`),

  assignBugToSelf: (id: string) => api.post(`/bugs/${id}/assignSelf`),

  updateBugStatus: (id: string, status: string) =>
    api.patch(`/bugs/${id}/status`, { status }),

  reportBug: (payload: CreateBugRequest) => {
    const formData = new FormData();

    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("severity", payload.severity);
    formData.append("reproductionSteps", payload.reproductionSteps);

    payload.attachments?.forEach((file) => {
      formData.append("attachments", file);
    });

    return api.post("/bugs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  assignBugToDeveloper: (bugId: string, developerId: string) =>
    api.post(`/bugs/${bugId}/assign`, { developerId }),

  closeBug: (bugId: string) => api.patch(`/bugs/${bugId}/close`),
};
