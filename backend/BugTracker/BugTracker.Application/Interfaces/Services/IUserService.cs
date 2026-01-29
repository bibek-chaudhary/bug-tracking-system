using BugTracker.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Application.Interfaces.Services
{
    public interface IUserService
    {
        Task<List<DeveloperDto>> GetDevelopersAsync();
    }
}
