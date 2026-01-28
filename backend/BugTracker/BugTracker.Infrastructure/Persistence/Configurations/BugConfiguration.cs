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
    public class BugConfiguration : IEntityTypeConfiguration<Bug>
    {
        public void Configure(EntityTypeBuilder<Bug> builder)
        {
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Title)
                .IsRequired()
                .HasMaxLength(200);
            builder.Property(b => b.Description)
                .IsRequired();
            builder.Property(b => b.Status)
                .IsRequired();
            builder.Property(b => b.Severity)
                .IsRequired()
                .HasMaxLength(50);
            builder.Property(b => b.Status)
            .IsRequired();
            builder.Property(b => b.CreatedByUserId)
            .IsRequired();

            builder.HasMany(b => b.Attachments)
                .WithOne()
                .HasForeignKey(a => a.BugId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
