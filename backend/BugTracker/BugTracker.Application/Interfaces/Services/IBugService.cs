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
        Task<List<MyBugsResponseDto>> GetMyBugsAsync(string userId);
        Task<BugDetailsResponseDto?> GetBugDetailAsync(Guid bugId, string userId);
        Task<List<UnassignedBugResponseDto>> SearchUnassignedBugAsync(string? title);
        Task AssignBugToSelfAsync(Guid bugId, string developerId);
        Task UpdateBugStatusAsync(Guid bugId, BugStatus status, string developerId);
    }
}
