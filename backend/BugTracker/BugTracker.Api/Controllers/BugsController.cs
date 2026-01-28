using BugTracker.Application.DTOs.Bugs;
using BugTracker.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BugTracker.Api.Controllers
{
    [ApiController]
    [Route("api/bugs")]
    [Authorize(Roles = "User")]
    public class BugsController : ControllerBase
    {
        private readonly IBugService _bugService;
        public BugsController(IBugService bugService)
        {
            _bugService = bugService;
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ReportBug([FromForm] CreateBugRequestDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException();

            await _bugService.CreateBugAsync(request, userId);
            return Ok("Bug reported successfully");
        }

        //[HttpPost]
        //public IActionResult Test()
        //{
        //    return Ok("HIT");
        //}

        [HttpGet]
        public IActionResult Ping() => Ok("API works");


    }
}
