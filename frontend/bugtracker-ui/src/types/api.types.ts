
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  details?: string;
}
