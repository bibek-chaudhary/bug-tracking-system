using BugTracker.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Application.DTOs.Bugs
{
    public class UnassignedBugResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public BugSeverity Severity { get; set; }
        public BugStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public string AssignedToUserId { get; set; } = null!;
    }
}
