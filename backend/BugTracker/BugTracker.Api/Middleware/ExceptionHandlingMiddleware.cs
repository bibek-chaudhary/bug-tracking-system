using BugTracker.Api.Models;
using System.Net;
using System.Text.Json;

namespace BugTracker.WebApi.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(
        HttpContext context,
        Exception exception)
    {
        var response = context.Response;
        response.ContentType = "application/json";

        var error = new ErrorResponse();

        switch (exception)
        {
            case KeyNotFoundException:
                response.StatusCode = (int)HttpStatusCode.NotFound;
                error.StatusCode = response.StatusCode;
                error.Message = exception.Message;
                break;

            case InvalidOperationException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                error.StatusCode = response.StatusCode;
                error.Message = exception.Message;
                break;

            case UnauthorizedAccessException:
                response.StatusCode = (int)HttpStatusCode.Forbidden;
                error.StatusCode = response.StatusCode;
                error.Message = exception.Message;
                break;

            default:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                error.StatusCode = response.StatusCode;
                error.Message = "An unexpected error occurred.";
                error.Details = exception.Message; 
                break;
        }

        await response.WriteAsync(
            JsonSerializer.Serialize(error));
    }
}
