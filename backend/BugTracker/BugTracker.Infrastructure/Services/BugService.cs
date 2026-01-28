using BugTracker.Application.DTOs.Bugs;
using BugTracker.Application.Interfaces.Services;
using BugTracker.Domain.Entities;
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

        public async Task<List<MyBugsResponseDto>> GetMyBugsAsync(string userId)
        {
            return await _context.Bugs
        .Where(b => b.CreatedByUserId == userId)
        .OrderByDescending(b => b.CreatedAt)
        .Select(b => new MyBugsResponseDto
        {
            Id = b.Id,
            Title = b.Title,
            Severity = b.Severity,
            Status = b.Status,
            CreatedAt = b.CreatedAt
        })
        .ToListAsync();
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

        public async Task<List<UnassignedBugResponseDto>> SearchUnassignedBugAsync(string? title)
        {
            var query = _context.Bugs.Where(b => b.AssignedToUserId == null);

            if (!string.IsNullOrWhiteSpace(title))
            {
                query = query.Where(b => b.Title.ToLower().Contains(title.ToLower()));
            }

            return await query
       .OrderByDescending(b => b.CreatedAt)
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
        }
    }
}
