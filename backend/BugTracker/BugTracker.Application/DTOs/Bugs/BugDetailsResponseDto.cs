using BugTracker.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Application.DTOs.Bugs
{
    public class BugDetailsResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public BugSeverity Severity { get; set; }
        public BugStatus Status { get; set; }
        public string? ReproductionSteps { get; set; }

        public string CreatedByUserId { get; set; } = null!;
        public string CreatedByUserName { get; set; } = null!;

        public string AssignedToUserId { get; set; } = null!;
        public string AssignedToUserName { get; set; } = null!;
        public DateTime CreateAt { get; set; }

        public List<BugAttachmentDto> Attachments { get; set; } = [];
    }
}
