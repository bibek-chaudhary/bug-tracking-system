import api from "../api/axios";
import type { ApiResponse } from "../types/api.types";
import type {
  BugDetails,
  BugFilterQuery,
  CreateBugRequest,
  MyBug,
  PaginationQuery,
  SortQuery,
} from "../types/bug.types";

export const bugService = {
  createBug: async (data: CreateBugRequest) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("severity", data.severity.toString());

    if (data.reproductionSteps) {
      formData.append("reproductionSteps", data.reproductionSteps);
    }

    data.attachments?.forEach((file) => formData.append("attachments", file));

    const res = await api.post<ApiResponse<string>>("/bugs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },

  getMyBugs: async (
    filter: BugFilterQuery,
    pagination: PaginationQuery,
    sort: SortQuery,
  ) => {
    const res = await api.get<ApiResponse<MyBug[]>>("/bugs/my", {
      params: { ...filter, ...pagination, ...sort },
    });
    return res.data;
  },

  getBugDetails: async (id: string) => {
    const res = await api.get<ApiResponse<BugDetails>>(`/bugs/${id}`);
    return res.data;
  },

  getUnassignedBugs: async (
    filter: BugFilterQuery,
    pagination: PaginationQuery,
    sort: SortQuery,
  ) => {
    const res = await api.get<ApiResponse<MyBug[]>>("/bugs/unassigned", {
      params: { ...filter, ...pagination, ...sort },
    });
    return res.data;
  },

  assignToSelf: async (id: string) => {
    const res = await api.post<ApiResponse<string>>(`/bugs/${id}/assignSelf`);
    return res.data;
  },

  updateStatus: async (id: string, status: number) => {
    const res = await api.patch<ApiResponse<string>>(`/bugs/${id}/status`, {
      status,
    });
    return res.data;
  },

  closeBug: async (id: string) => {
    const res = await api.patch<ApiResponse<string>>(`/bugs/${id}/close`);
    return res.data;
  },

  assignBug: async (bugId: string, developerId: string) => {
    const res = await api.post<ApiResponse<string>>(`/bugs/${bugId}/assign`, {
      developerId,
    });
    return res.data;
  },
};
