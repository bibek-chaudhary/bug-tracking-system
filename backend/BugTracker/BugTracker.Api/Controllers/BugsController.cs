using BugTracker.Application.DTOs.Bugs;
using BugTracker.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BugTracker.Api.Controllers
{
    [ApiController]
    [Route("api/bugs")]
    //[Authorize(Roles = "User")]
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

        [HttpGet("my")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetMyBugs()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException();

            var bugs = await _bugService.GetMyBugsAsync(userId);
            return Ok(bugs);
        }

        [HttpGet("{id:guid}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetBugDetails(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException();

            var bug = await _bugService.GetBugDetailAsync(id, userId);

            if (bug == null)
                return NotFound("Bug not found");

            return Ok(bug);
        }

        [HttpGet("unassigned")]
        [Authorize(Roles = "Developer")]
        public async Task <IActionResult> GetUnassignedBugs([FromQuery] string? title)
        {
            var bugs = await _bugService.SearchUnassignedBugAsync(title);
            return Ok(bugs);
        }

        [HttpPost("{id:guid}/assign")]
        [Authorize(Roles = "Developer")]
        public async Task<IActionResult> AssignBugToSelf(Guid id)
        {
            var developerId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException();

            await _bugService.AssignBugToSelfAsync(id, developerId);

            return Ok("Bug assigned to you successfully.");
        }

        [HttpPatch("{id:guid}/status")]
        [Authorize(Roles = "Developer")]
        public async Task<IActionResult> UpdateBugStatus(Guid id, [FromBody] UpdateBugStatusRequestDto request)
        {
            var developerId = User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedAccessException();

            await _bugService.UpdateBugStatusAsync(id, request.Status, developerId);

            return Ok("Bug status updated successfully.");
        }
    }
}
