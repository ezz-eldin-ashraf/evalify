using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Evalify.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGradingModeToQuestion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GradingMode",
                table: "TemplateQuestions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "Meaning");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GradingMode",
                table: "TemplateQuestions");
        }
    }
}
