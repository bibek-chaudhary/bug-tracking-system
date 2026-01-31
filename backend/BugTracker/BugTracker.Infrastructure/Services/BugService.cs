using BugTracker.Application.Common;
using BugTracker.Application.DTOs.Bugs;
using BugTracker.Application.Interfaces.Services;
using BugTracker.Domain.Entities;
using BugTracker.Domain.Enums;
using BugTracker.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Infrastructure.Services
{
    public class BugService : IBugService
    {
        private readonly AppDbContext _context;
        private readonly FileStorageService _fileStorage;

        public BugService(AppDbContext context, FileStorageService fileStorage)
        {
            _context = context;
            _fileStorage = fileStorage;
        }
        public async Task CreateBugAsync(CreateBugRequestDto request, string userId)
        {
            var bug = new Bug(request.Title, request.Description, request.Severity, userId, request.ReproductionSteps);

            _context.Bugs.Add(bug);
            await _context.SaveChangesAsync(); 

            if (request.Attachments != null)
            {
                foreach (var attachment in request.Attachments)
                {
                    var (fileName, filePath) = await _fileStorage.SaveAsync(attachment);
                    var bugAttachment = new BugAttachment(fileName, filePath, bug.Id);
                    _context.BugAttachments.Add(bugAttachment);
                }
            }

            await _context.SaveChangesAsync();
        }


        public async Task<PagedResult<MyBugsResponseDto>> GetMyBugsAsync(string userId, BugFilterQuery filter, PaginationQuery pagination, SortQuery sort, string role)
        {
            var query = _context.Bugs
            .Where(b =>
                 role == "User"
                    ? b.CreatedByUserId == userId
                    : b.AssignedToUserId == userId
            );

            // Filters
            if (!string.IsNullOrWhiteSpace(filter.Title))
                query = query.Where(b =>
                    b.Title.ToLower().Contains(filter.Title.ToLower()));

            if (filter.Status.HasValue)
                query = query.Where(b => b.Status == filter.Status);

            if (filter.Severity.HasValue)
                query = query.Where(b => b.Severity == filter.Severity);

            // Sorting
            query = sort.SortBy.ToLower() switch
            {
                "severity" => sort.SortOrder == "asc"
                    ? query.OrderBy(b => b.Severity)
                    : query.OrderByDescending(b => b.Severity),

                "status" => sort.SortOrder == "asc"
                    ? query.OrderBy(b => b.Status)
                    : query.OrderByDescending(b => b.Status),

                _ => sort.SortOrder == "asc"
                    ? query.OrderBy(b => b.CreatedAt)
                    : query.OrderByDescending(b => b.CreatedAt)
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((pagination.Page - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .Select(b => new MyBugsResponseDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Severity = b.Severity,
                    Status = b.Status,
                    CreatedAt = b.CreatedAt,
                    AssignedToUserId = b.AssignedToUserId
                })
                .AsNoTracking()
                .ToListAsync();

            return new PagedResult<MyBugsResponseDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = pagination.Page,
                PageSize = pagination.PageSize
            };
        }


    public async Task<BugDetailsResponseDto?> GetBugDetailAsync(Guid bugId, string userId)
        {
            var bug = await _context.Bugs
        .Include(b => b.Attachments)
        .Include(b => b.AssignedToUser)
        .Include(b => b.CreatedByUser)
        .FirstOrDefaultAsync(b => b.Id == bugId);

            if (bug == null)
                return null;

            return new BugDetailsResponseDto
            {
                Id = bug.Id,
                Title = bug.Title,
                Description = bug.Description,
                Status = bug.Status,
                Severity = bug.Severity,
                ReproductionSteps = bug.ReproductionSteps,

                CreatedByUserId = bug.CreatedByUserId,
                CreatedByUserName = bug.CreatedByUser.UserName!,

                AssignedToUserId = bug.AssignedToUserId,
                AssignedToUserName = bug.AssignedToUser?.UserName,
                CreatedAt = bug.CreatedAt,
                AssignedAt = bug.AssignedAt,
                UpdatedAt = bug.UpdatedAt,

                Attachments = bug.Attachments
                .Select(a => new BugAttachmentDto
                {
                    Id = a.Id,
                    FileName = a.FileName,
                    FilePath = a.FilePath
                }).ToList()
            };
        }


        public async Task<PagedResult<UnassignedBugResponseDto>> SearchUnassignedBugsAsync(
        BugFilterQuery filter,
        PaginationQuery pagination,
        SortQuery sort)
        {
            var query = _context.Bugs
                .Where(b => b.AssignedToUserId == null);

            // Filters
            if (!string.IsNullOrWhiteSpace(filter.Title))
                query = query.Where(b =>
                    b.Title.ToLower().Contains(filter.Title.ToLower()));

            if (filter.Status.HasValue)
                query = query.Where(b => b.Status == filter.Status);

            if (filter.Severity.HasValue)
                query = query.Where(b => b.Severity == filter.Severity);

            // Sorting
            query = sort.SortBy.ToLower() switch
            {
                "severity" => sort.SortOrder == "asc"
                    ? query.OrderBy(b => b.Severity)
                    : query.OrderByDescending(b => b.Severity),

                "status" => sort.SortOrder == "asc"
                    ? query.OrderBy(b => b.Status)
                    : query.OrderByDescending(b => b.Status),

                _ => sort.SortOrder == "asc"
                    ? query.OrderBy(b => b.CreatedAt)
                    : query.OrderByDescending(b => b.CreatedAt)
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((pagination.Page - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .Select(b => new UnassignedBugResponseDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Severity = b.Severity,
                    Status = b.Status,
                    CreatedAt = b.CreatedAt,
                    AssignedToUserId = b.AssignedToUserId
                })
                .AsNoTracking()
                .ToListAsync();

            return new PagedResult<UnassignedBugResponseDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = pagination.Page,
                PageSize = pagination.PageSize
            };
        }

        public async Task AssignBugToSelfAsync(Guid bugId, string developerId)
        {
            var bug = await _context.Bugs.FirstOrDefaultAsync(b => b.Id == bugId);

            if (bug == null)
                throw new KeyNotFoundException("Bug not found.");

            bug.AssignTo(developerId);

            await _context.SaveChangesAsync();
        }

        public async Task   UpdateBugStatusAsync(Guid bugId, BugStatus status, string developerId)
        {
            var bug = await _context.Bugs.FirstOrDefaultAsync(b => b.Id == bugId);

            if (bug == null)
                throw new KeyNotFoundException("Bug not found.");

            if (bug.AssignedToUserId != developerId)
                throw new UnauthorizedAccessException("Bug not assigned to you");

            bug.UpdateStatus(status, developerId);

            await _context.SaveChangesAsync();
        }

        public static bool IsValidTransition(BugStatus current, BugStatus next)
        {
            return current switch
            {
                BugStatus.Open => next == BugStatus.InProgress,
                BugStatus.InProgress => next == BugStatus.Resolved,
                _ => false
            };
        }

        public async Task AssignBugAsync(Guid bugId, string developerId, string userId)
        {
            var bug = await _context.Bugs
                .FirstOrDefaultAsync(b => b.Id == bugId);

            if (bug == null)
                throw new KeyNotFoundException("Bug not found");

            if (bug.CreatedByUserId != userId)
                throw new UnauthorizedAccessException("You can assign only your own bugs");

            bug.AssignTo(developerId);

            await _context.SaveChangesAsync();
        }

        public async Task CloseBugAsync(Guid bugId, string userId)
        {
            var bug = await _context.Bugs
                .FirstOrDefaultAsync(b => b.Id == bugId);

            if (bug == null)
                throw new KeyNotFoundException("Bug not found");

            if (bug.CreatedByUserId != userId)
                throw new UnauthorizedAccessException("You can close only your own bugs");

            if (bug.Status != BugStatus.Resolved)
                throw new InvalidOperationException("Bug must be resolved before closing");

            bug.UpdateStatus(BugStatus.Closed, userId);

            await _context.SaveChangesAsync();
        }


    }
}
