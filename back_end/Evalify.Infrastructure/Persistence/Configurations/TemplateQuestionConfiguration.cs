using Evalify.Domain.Entities.TemplateQuestion;
using Evalify.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Evalify.Infrastructure.Persistence.Configurations;

public sealed class TemplateQuestionConfiguration : IEntityTypeConfiguration<TemplateQuestion>
{
    public void Configure(EntityTypeBuilder<TemplateQuestion> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.ModelAnswer)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(q => q.Mark).IsRequired();
        builder.Property(q => q.GradingMode)
            .IsRequired()
            .HasConversion(
                g => g.ToString(),
                g => Enum.Parse<GradingMode>(g))
            .HasDefaultValue(GradingMode.Meaning);
        builder.Property(q => q.QuestionIndex).IsRequired();
        builder.Property(q => q.X).IsRequired();
        builder.Property(q => q.Y).IsRequired();
        builder.Property(q => q.Width).IsRequired();
        builder.Property(q => q.Height).IsRequired();

        builder.HasIndex(q => new { q.TemplateId, q.QuestionIndex })
            .IsUnique();

        builder.HasMany(q => q.StudentAnswers)
            .WithOne(a => a.Question)
            .HasForeignKey(a => a.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
