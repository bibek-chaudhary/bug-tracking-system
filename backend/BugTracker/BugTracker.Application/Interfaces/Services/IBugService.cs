using BugTracker.Application.DTOs.Bugs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Application.Interfaces.Services
{
    public interface IBugService
    {
        Task CreateBugAsync(CreateBugRequestDto request, string userId);
    }
}
