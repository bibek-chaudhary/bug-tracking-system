using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Infrastructure.Identity
{
    public static class RoleSeeder
    {
        private static readonly List<string> Roles = new()
        {
            "User",
            "Developer",
        };

        public static async Task SeedAsync(RoleManager<IdentityRole> roleManager)
        {
            foreach (var roleName in Roles)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    var role = new IdentityRole { Name = roleName };
                    await roleManager.CreateAsync(role);
                }
            }
        }
    }
}
