using BugTracker.Application.Common;
using BugTracker.Application.DTOs.Bugs;
using BugTracker.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Application.Interfaces.Services
{
    public interface IBugService
    {
        Task CreateBugAsync(CreateBugRequestDto request, string userId);
        Task<PagedResult<MyBugsResponseDto>> GetMyBugsAsync( string userId, BugFilterQuery filter, PaginationQuery pagination, SortQuery sort, string role);
        Task<BugDetailsResponseDto?> GetBugDetailAsync(Guid bugId, string userId);
        Task<PagedResult<UnassignedBugResponseDto>> SearchUnassignedBugsAsync( BugFilterQuery filter, PaginationQuery pagination, SortQuery sort);
        Task AssignBugToSelfAsync(Guid bugId, string developerId);
        Task UpdateBugStatusAsync(Guid bugId, BugStatus status, string developerId);
        Task AssignBugAsync(Guid bugId, string developerId, string userId);
    }
}
