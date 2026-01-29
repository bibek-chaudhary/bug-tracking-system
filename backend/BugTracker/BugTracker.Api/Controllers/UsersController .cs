using BugTracker.Application.Common;
using BugTracker.Application.DTOs;
using BugTracker.Application.DTOs.Bugs;
using BugTracker.Application.Interfaces.Services;
using BugTracker.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BugTracker.Api.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize(Roles = "User")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("developers")]
        public async Task<IActionResult> GetDevelopers()
        {
            var developers = await _userService.GetDevelopersAsync();
            //return Ok(developers);
            return Ok(ApiResponse<List<DeveloperDto>>.Ok(developers, "Developers fetched successfully"));
        }
    }

}
