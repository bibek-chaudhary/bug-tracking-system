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
        public ApplicationUser CreatedByUser { get; private set; } = null!;
        public string? AssignedToUserId { get; private set; }
        public ApplicationUser? AssignedToUser { get; private set; }

        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
        public DateTime? AssignedAt { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

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
            if (AssignedToUserId != null)
                throw new InvalidOperationException("Bug is already assigned.");

            if (Status != BugStatus.Open)
                throw new InvalidOperationException("Only open bugs can be assigned.");

            AssignedToUserId = developerUserId;
            AssignedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateStatus(BugStatus newStatus, string developerId)
        {
            if (AssignedToUserId != developerId)
                throw new UnauthorizedAccessException("You are not assigned to this bug.");

            if (Status == BugStatus.InProgress && newStatus == BugStatus.Resolved)
            {
                Status = BugStatus.Resolved;
                UpdatedAt = DateTime.UtcNow;
                return;
            }

            if (Status == BugStatus.Resolved && newStatus == BugStatus.Closed)
            {
                Status = BugStatus.Closed;
                UpdatedAt = DateTime.UtcNow;
                return;
            }

            throw new InvalidOperationException(
                $"Invalid status transition from {Status} to {newStatus}");
        }
    }
}
