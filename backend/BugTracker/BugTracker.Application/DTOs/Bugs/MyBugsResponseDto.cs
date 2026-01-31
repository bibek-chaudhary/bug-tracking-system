using BugTracker.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Application.DTOs.Bugs
{
    public class MyBugsResponseDto
    {
        public Guid Id { set; get; }
        public string Title { set; get; } = null!;
        public BugSeverity Severity { set; get; }
        public BugStatus Status { set; get; }
        public DateTime CreatedAt { set; get; }
        public string AssignedToUserId { get; set; } = null!;
    }
}
