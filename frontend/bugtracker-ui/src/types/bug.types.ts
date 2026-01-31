export type BugSeverity = 1 | 2 | 3;

export const BugSeverityMap: Record<BugSeverity, string> = {
  1: "Low",
  2: "Medium",
  3: "High",
};

// types/bug.types.ts
export type BugStatus = 1 | 2 | 3 | 4;

export const BugStatusMap: Record<BugStatus, string> = {
  1: "Open",
  2: "In Progress",
  3: "Resolved",
  4: "Closed",
};

export interface CreateBugRequest {
  title: string;
  description: string;
  //severity: BugSeverity;
  severity: string;
  reproductionSteps: string;
  attachments?: File[];
}

export interface BugFilterQuery {
  status?: "Open" | "InProgress" | "Resolved" | "Closed";
  severity?: "Low" | "Medium" | "High";
  title?: string;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export interface SortQuery {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface MyBug {
  id: string;
  title: string;
  severity: number;
  status: number;
  createdAt: string;
  assignedToUserId: string;
}
export interface BugDetails extends MyBug {
  description: string;
  reproductionSteps?: string;
  createdByUserId: string;
  createdByUserName: string;
  assignedToUserName: string;
  assignedAt?: string;
  updatedAt?: string;
  attachments?: Attachments[];
}

export interface Attachments {
  fileName: string;
  filePath: string;
  id: string;
}

export interface PagedTesult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface BugQueryParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  severity?: string;
  title?: string;
}
