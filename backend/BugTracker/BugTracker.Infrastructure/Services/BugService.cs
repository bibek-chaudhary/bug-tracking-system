using BugTracker.Application.DTOs.Bugs;
using BugTracker.Application.Interfaces.Services;
using BugTracker.Domain.Entities;
using BugTracker.Infrastructure.Persistence;
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

            //if (request.Attachments != null)
            //{
            //    foreach (var attachment in request.Attachments)
            //    {
            //        var (fileName, filePath) = await _fileStorage.SaveAsync(attachment);

            //        bug.Attachments.Add(new BugAttachment(fileName, filePath, bug.Id));
            //    }
            //}

            //_context.Bugs.Add(bug);
            //await _context.SaveChangesAsync();


            _context.Bugs.Add(bug);
            await _context.SaveChangesAsync(); // Bug.Id is generated here

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
    }
}
