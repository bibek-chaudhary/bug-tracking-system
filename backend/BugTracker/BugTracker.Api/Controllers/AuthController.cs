using BugTracker.Application.Common;
using BugTracker.Application.DTOs.Auth;
using BugTracker.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace BugTracker.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            await _authService.RegisterAsync(request);
            return Ok(ApiResponse<string>.Ok("User registered successfully"));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var token = await _authService.LoginAsync(request);
            return Ok(ApiResponse<LoginResponseDto>.Ok(
                new LoginResponseDto { Token = token },
                "Login successful"
            ));
        }
    }
}
