using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Application.Common
{
    public class SortQuery
    {
        public string SortBy { get; set; } = "createdAt";
        public string SortOrder { get; set; } = "desc";
    }
}
