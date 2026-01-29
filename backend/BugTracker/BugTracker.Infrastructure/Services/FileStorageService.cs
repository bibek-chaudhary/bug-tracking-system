using BugTracker.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Infrastructure.Services
{
    public class FileStorageService
    {
        private readonly string _uploadPath = Path.Combine("wwwroot", "uploads");


        public async Task<(string fileName, string fileUrl)> SaveAsync(IFormFile file)
        {
            if (!Directory.Exists(_uploadPath))
                Directory.CreateDirectory(_uploadPath);

            var uniqueName = $"{Guid.NewGuid()}_{file.FileName}";
            var fullPath = Path.Combine(_uploadPath, uniqueName);

            using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream);

            var fileUrl = $"/uploads/{uniqueName}";

            return (file.FileName, fileUrl);
        }

    }
}
