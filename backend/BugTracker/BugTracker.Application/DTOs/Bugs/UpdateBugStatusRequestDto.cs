using BugTracker.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Application.DTOs.Bugs
{
    public class UpdateBugStatusRequestDto
    {
        public BugStatus Status { get; set; }
    }
}
