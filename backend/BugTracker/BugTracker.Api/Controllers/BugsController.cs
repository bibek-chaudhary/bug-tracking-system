using BugTracker.Application.Common;
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
            return Ok(ApiResponse<string>.Ok("Bug reported successfully"));
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyBugs( [FromQuery] BugFilterQuery filter, [FromQuery] PaginationQuery pagination, [FromQuery] SortQuery sort)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException();

            var role = User.FindFirstValue(ClaimTypes.Role)
                 ?? throw new UnauthorizedAccessException();


            var result = await _bugService
                .GetMyBugsAsync(userId, filter, pagination, sort, role);

            return Ok(ApiResponse<IEnumerable<MyBugsResponseDto>>.Ok(
                result.Items,
                "My bugs fetched successfully",
                new
                {
                    result.TotalCount,
                    result.Page,
                    result.PageSize
                }));
        }


        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetBugDetails(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException();

            var bug = await _bugService.GetBugDetailAsync(id, userId);

            if (bug == null)
                throw new KeyNotFoundException("Bug not found");

            return Ok(ApiResponse<BugDetailsResponseDto>.Ok(bug, "Bug details fetched successfully"));
        }

        [HttpGet("unassigned")]
        [Authorize(Roles = "Developer")]
        public async Task<IActionResult> GetUnassignedBugs([FromQuery] BugFilterQuery filter, [FromQuery] PaginationQuery pagination, [FromQuery] SortQuery sort)
        {
            var result = await _bugService.SearchUnassignedBugsAsync(filter, pagination, sort);

            return Ok(ApiResponse<IEnumerable<UnassignedBugResponseDto>>.Ok(
                result.Items,
                "Unassigned bugs fetched successfully",
                new {
                    result.TotalCount,
                    result.Page,
                    result.PageSize
                    })
            );
        }

        [HttpPost("{id:guid}/assignSelf")]
        [Authorize(Roles = "Developer")]
        public async Task<IActionResult> AssignBugToSelf(Guid id)
        {
            var developerId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException();

            await _bugService.AssignBugToSelfAsync(id, developerId);

            return Ok(ApiResponse<string>.Ok("Bug assigned to you successfully"));
        }

        [HttpPatch("{id:guid}/status")]
        [Authorize(Roles = "Developer")]
        public async Task<IActionResult> UpdateBugStatus(Guid id, [FromBody] UpdateBugStatusRequestDto request)
        {
            var developerId = User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedAccessException();

            await _bugService.UpdateBugStatusAsync(id, request.Status, developerId);

            return Ok(ApiResponse<string>.Ok("Bug status updated successfully"));
        }

        [Authorize(Roles = "User")]
        [HttpPost("{id:guid}/assign")]
        public async Task<IActionResult> AssignBug( Guid id, [FromBody] AssignBugRequestDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException();

            await _bugService.AssignBugAsync(id, request.DeveloperId, userId);

            return Ok(ApiResponse<string>.Ok("Bug assigned to you successfully"));
        }

    }
}
