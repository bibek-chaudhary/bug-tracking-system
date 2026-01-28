using BugTracker.Application.DTOs.Auth;
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
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthService(UserManager<ApplicationUser> userManager, IJwtTokenGenerator jwtTokenGenerator)
        {
            _userManager = userManager;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task RegisterAsync(RegisterRequestDto request)
        {
            var user = new ApplicationUser
            {
                UserName = request.UserName,
                Email = request.Email
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if(!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"User registration failed: {errors}");
            }

            await _userManager.AddToRoleAsync(user, request.Role);
        }

        public async Task<string> LoginAsync(LoginRequestDto request) 
        {
            var user = await _userManager.FindByEmailAsync(request.Email) ?? throw new Exception("User not found");

            var validPassword = await _userManager.CheckPasswordAsync(user, request.Password);

            if (!validPassword)
            {
                throw new Exception("Invalid password");
            }

            return await _jwtTokenGenerator.GenerateTokenAsync(user);
        }
    }
}
