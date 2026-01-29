
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: unknown;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  details?: string;
}
