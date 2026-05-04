using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Evalify.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DbOptimizations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TemplateQuestions_TemplateId",
                table: "TemplateQuestions");

            migrationBuilder.DropIndex(
                name: "IX_StudentPapers_TemplateId",
                table: "StudentPapers");

            migrationBuilder.AlterColumn<string>(
                name: "ModelAnswer",
                table: "TemplateQuestions",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "StudentPapers",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "ProcessingJobs",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "AspNetUsers",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_TemplateQuestions_TemplateId_QuestionIndex",
                table: "TemplateQuestions",
                columns: new[] { "TemplateId", "QuestionIndex" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentPapers_TemplateId_StudentCode",
                table: "StudentPapers",
                columns: new[] { "TemplateId", "StudentCode" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TemplateQuestions_TemplateId_QuestionIndex",
                table: "TemplateQuestions");

            migrationBuilder.DropIndex(
                name: "IX_StudentPapers_TemplateId_StudentCode",
                table: "StudentPapers");

            migrationBuilder.AlterColumn<string>(
                name: "ModelAnswer",
                table: "TemplateQuestions",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(2000)",
                oldMaxLength: 2000);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "StudentPapers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "ProcessingJobs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.CreateIndex(
                name: "IX_TemplateQuestions_TemplateId",
                table: "TemplateQuestions",
                column: "TemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentPapers_TemplateId",
                table: "StudentPapers",
                column: "TemplateId");
        }
    }
}
