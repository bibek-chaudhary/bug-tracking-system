using BugTracker.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Application.DTOs.Bugs
{
    public class BugFilterQuery
    {
        public BugStatus? Status { get; set; }
        public BugSeverity? Severity { get; set; }
        public string? Title { get; set; }
    }
}
