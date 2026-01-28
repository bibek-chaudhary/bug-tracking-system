using BugTracker.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Domain.Entities
{
    public class Bug
    {
        public Guid Id { get; private set; } = Guid.NewGuid();

        public string Title { get; private set; } = null!;
        public string Description { get; private set; } = null!;
        public BugSeverity Severity { get; private set; }
        public BugStatus Status { get; private set; } = BugStatus.Open;
        public string? ReproductionSteps { get; private set; }

        public string CreatedByUserId { get; private set; } = null;
        public string AssignedToUserId { get; private set; } 

        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

        public ICollection<BugAttachment> Attachments { get; private set; } = new List<BugAttachment>();

        private Bug() { }

        public Bug(string title, string description, BugSeverity severity, string createdByUserId, string? reproductionSteps = null)
        {
            Title = title;
            Description = description;
            Severity = severity;
            CreatedByUserId = createdByUserId;
            ReproductionSteps = reproductionSteps;
        }

        public void AssignTo(string developerUserId)
        {
            AssignedToUserId = developerUserId;
            Status = BugStatus.InProgress;
        }

        public void UpdateStatus(BugStatus newStatus)
        {
            Status = newStatus;
        }
    }
}
