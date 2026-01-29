import type { ApiResponse } from "../types/api.types";
import type {
  BugListItem,
  BugQueryParams,
  PagedResult,
} from "../types/bug.types";
import api from "./axios";

export const bugsApi = {
  getMyBugs: async (params: BugQueryParams) => {
    const response = await api.get(
      "/bugs/my",
      { params },
    );

    return response.data;
  },

  getUnassignedBugs: (params: BugQueryParams) =>
    api.get<PagedResult<BugListItem>>("/bugs/unassigned", { params }),

  getBugDetails: (id: string) => api.get(`/bugs/${id}`),

  assignBugToSelf: (id: string) => api.post(`/bugs/${id}/assign`),

  updateBugStatus: (id: string, status: string) =>
    api.patch(`/bugs/${id}/status`, { status }),
};
