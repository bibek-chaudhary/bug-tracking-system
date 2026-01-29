using BugTracker.Application.DTOs;
using BugTracker.Application.Interfaces.Services;
using BugTracker.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<List<DeveloperDto>> GetDevelopersAsync()
        {
            var developers = await _userManager.GetUsersInRoleAsync("Developer");

            return developers.Select(d => new DeveloperDto
            {
                Id = d.Id,
                Name = d.UserName!
            }).ToList();
        }
    }

}
