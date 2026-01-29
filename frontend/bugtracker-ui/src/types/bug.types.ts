export type BugSeverity = "Low" | "Medium" | "High";
export type BugStatus = "Open" | "InProgress" | "Resolved" | "Closed"

export interface BugListItem {
    id: string;
    title: string;
    severity: BugSeverity;
    status: BugStatus;
    createdAt: string;
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

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface CreateBugRequest {
  title: string;
  description: string;
  severity: string;
  reproductionSteps: string;
  attachments?: File[];
}