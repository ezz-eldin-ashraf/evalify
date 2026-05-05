using Evalify.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Evalify.Infrastructure.Persistence.Configurations;

public sealed class StudentConfiguration : IEntityTypeConfiguration<Student>
{
    public void Configure(EntityTypeBuilder<Student> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.StudentCode)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.FullName)
            .IsRequired()
            .HasMaxLength(150);

        builder.HasIndex(x => new { x.StudentListId, x.StudentCode })
            .IsUnique();

        builder.HasOne(s => s.StudentList)
            .WithMany(u => u.Students)
            .HasForeignKey(s => s.StudentListId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
