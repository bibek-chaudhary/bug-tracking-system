using BugTracker.Domain.Entities;
using BugTracker.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace BugTracker.Application.DTOs.Bugs
{
    public class CreateBugRequestDto
    {
        public string Title { get; set; } = null!; 
        public string Description { get; set; } = null!;
        public BugSeverity Severity { get; set; }
        public string? ReproductionSteps { get; set; }
        public List<IFormFile>? Attachments { get; set; }
    }
}
