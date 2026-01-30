using BugTracker.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;               

namespace BugTracker.Application.Common
{
    public static class BugStatusTransitionHelper
    {
        public static bool IsValidTransition(BugStatus current, BugStatus next)
        {
            return current switch
            {
                BugStatus.Open => next == BugStatus.InProgress,
                BugStatus.InProgress => next == BugStatus.Resolved,
                _ => false
            };
        }
    }
}
