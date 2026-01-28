using BugTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Infrastructure.Persistence.Configurations
{
    public class BugAttachmentConfiguration : IEntityTypeConfiguration<BugAttachment>
    {
        public void Configure(EntityTypeBuilder<BugAttachment> builder)
        {
            builder.HasKey(ba => ba.Id);
            builder.Property(ba => ba.FileName)
                .IsRequired()
                .HasMaxLength(255);
            builder.Property(ba => ba.FilePath)
                .IsRequired()
                .HasMaxLength(500);
        }
    }
}
