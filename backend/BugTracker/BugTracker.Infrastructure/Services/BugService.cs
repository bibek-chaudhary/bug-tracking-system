using BugTracker.Application.Common;
using BugTracker.Application.DTOs.Bugs;
using BugTracker.Application.Interfaces.Services;
using BugTracker.Domain.Entities;
using BugTracker.Domain.Enums;
using BugTracker.Infrastructure.Persistence;
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


        public async Task<PagedResult<MyBugsResponseDto>> GetMyBugsAsync(string userId, BugFilterQuery filter, PaginationQuery pagination, SortQuery sort)
        {
            var query = _context.Bugs
                .Where(b => b.CreatedByUserId == userId);

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
                    CreatedAt = b.CreatedAt
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
            return await _context.Bugs.Where(b => b.Id == bugId && b.CreatedByUserId == userId).Select(b => new BugDetailsResponseDto
            {
                Id = b.Id,
                Title = b.Title,
                Description = b.Description,
                Severity = b.Severity,
                Status = b.Status,
                ReproductionSteps = b.ReproductionSteps,
                CreateAt = b.CreatedAt,
                Attachments = b.Attachments
                .Select(a => new BugAttachmentDto
                {
                    Id = a.Id,
                    FileName = a.FileName,
                    FilePath = a.FilePath
                }).ToList()
            }).FirstOrDefaultAsync();
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
                    CreatedAt = b.CreatedAt
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

        public async Task UpdateBugStatusAsync(Guid bugId, BugStatus status, string developerId)
        {
            var bug = await _context.Bugs.FirstOrDefaultAsync(b => b.Id == bugId);

            if (bug == null)
                throw new KeyNotFoundException("Bug not found.");

            bug.UpdateStatus(status, developerId);

            await _context.SaveChangesAsync();
        }
    }
}
