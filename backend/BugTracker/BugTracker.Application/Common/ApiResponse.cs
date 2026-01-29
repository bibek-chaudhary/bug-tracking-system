using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Application.Common
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public object? Meta { get; set; }

        public static ApiResponse<T> Ok(T? data, string message = "Request successful", object? meta = null)
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data,
                Meta = meta,
            };
        }

        public static ApiResponse<T> Ok(string message)
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message
            };
        }
    }
}
