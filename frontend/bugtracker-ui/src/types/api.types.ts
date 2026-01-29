
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {};
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  details?: string;
}
