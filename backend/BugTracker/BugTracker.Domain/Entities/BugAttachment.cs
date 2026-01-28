using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Domain.Entities
{
    public class BugAttachment
    {
        public Guid Id { get; private set; } = Guid.NewGuid();

        public string FileName { get; private set; } = null;
        public string FilePath { get; private set; } = null!;

        public Guid BugId { get; private set; }

        private BugAttachment() { }

        public BugAttachment(string fileName, string filePath, Guid bugId)
        {
            FileName = fileName;
            FilePath = filePath;
            BugId = bugId;
        }
    }
}
