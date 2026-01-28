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
        private readonly string _uploadPath = "Uploads";

        public async Task<(string fileName, string filePath)> SaveAsync(IFormFile file)
        {
            if (!Directory.Exists(_uploadPath))
                Directory.CreateDirectory(_uploadPath);

            var uniqueName = $"{Guid.NewGuid()}_{file.FileName}";
            var fullPath = Path.Combine(_uploadPath, uniqueName);

            using var stream = new FileStream(fullPath, FileMode.Create);

            await file.CopyToAsync(stream);

            return (file.FileName, fullPath);
        }
    
        //public async Task<> SaveFile(List<IFormFile> file,)
    }
}
