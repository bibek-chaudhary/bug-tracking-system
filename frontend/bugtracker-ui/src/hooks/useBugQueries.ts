import { useQuery, useMutation } from "@tanstack/react-query";
import type {
  BugFilterQuery,
  PaginationQuery,
  SortQuery,
  CreateBugRequest,
} from "../types/bug.types";
import { bugService } from "../services/bugService";

export const useMyBugs = (
  filter: BugFilterQuery,
  pagination: PaginationQuery,
  sort: SortQuery,
) =>
  useQuery({
    queryKey: ["myBugs", filter, pagination, sort],
    queryFn: () => bugService.getMyBugs(filter, pagination, sort),
  });

export const useBugDetails = (id: string) =>
  useQuery({
    queryKey: ["bugDetails", id],
    queryFn: () => bugService.getBugDetails(id),
    enabled: !!id,
  });

export const useUnassignedBugs = (
  filter: BugFilterQuery,
  pagination: PaginationQuery,
  sort: SortQuery,
) =>
  useQuery({
    queryKey: ["unassignedBugs", filter, pagination, sort],
    queryFn: () => bugService.getUnassignedBugs(filter, pagination, sort),
  });

  export const useCreateBug = () => {
    return useMutation({
      mutationFn: (data: CreateBugRequest) => bugService.createBug(data),
      onSuccess: () => {},
    });
  };

export const useAssignToSelf = () => {
  return useMutation({
    mutationFn: (id: string) => bugService.assignToSelf(id),
    onSuccess: () => {},
  });
};

export const useUpdateBugStatus = () => {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: number }) =>
      bugService.updateStatus(id, status),
  });
};

export const useCloseBug = () => {
  return useMutation({
    mutationFn: (id: string) => bugService.closeBug(id),
  });
};

export const useAssignBug = () => {
  return useMutation({
    mutationFn: ({
      bugId,
      developerId,
    }: {
      bugId: string;
      developerId: string;
    }) => bugService.assignBug(bugId, developerId),
  });
};
