using Evalify.Application.Common.Interfaces;
using Evalify.Domain.Common.Results;
using Evalify.Domain.Entities.User;
using ExcelDataReader;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Evalify.Application.Features.Students.Commands.UploadRoster;

public sealed class UploadRosterCommandHandler(
    IAppDbContext db,
    ICurrentUser currentUser)
    : IRequestHandler<UploadRosterCommand, Result<UploadRosterResponse>>
{
    public async Task<Result<UploadRosterResponse>> Handle(
        UploadRosterCommand request,
        CancellationToken ct)
    {
        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

        var listExists = await db.StudentLists
            .AnyAsync(l => l.Id == request.StudentListId && l.UserId == currentUser.Id, ct);
            
        if (!listExists)
            return Error.NotFound("StudentList.NotFound", "Student list not found or access denied.");

        var ext = Path.GetExtension(request.FileName).ToLowerInvariant();
        using var reader = ext == ".csv"
            ? ExcelReaderFactory.CreateCsvReader(request.FileStream)
            : ExcelReaderFactory.CreateReader(request.FileStream);

        var conf = new ExcelDataSetConfiguration
        {
            ConfigureDataTable = _ => new ExcelDataTableConfiguration { UseHeaderRow = true }
        };

        var dataSet = reader.AsDataSet(conf);
        if (dataSet.Tables.Count == 0)
            return Error.Validation("Roster.Empty", "The uploaded file is empty.");

        var table = dataSet.Tables[0];
        
        if (table.Columns.Count < 2)
            return Error.Validation("Roster.InvalidFormat", "File must have at least two columns: Name and StudentCode.");

        var existingStudents = await db.Students
            .Where(s => s.StudentListId == request.StudentListId)
            .ToDictionaryAsync(s => s.StudentCode, ct);

        int parsed = 0;
        int inserted = 0;
        int updated = 0;

        foreach (DataRow row in table.Rows)
        {
            var name = row[0]?.ToString()?.Trim();
            var code = row[1]?.ToString()?.Trim();

            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(code))
                continue;

            parsed++;

            if (existingStudents.TryGetValue(code, out var student))
            {
                if (student.FullName != name)
                {
                    student.UpdateFullName(name);
                    updated++;
                }
            }
            else
            {
                var newStudent = Student.Create(request.StudentListId, code, name);
                db.Students.Add(newStudent);
                existingStudents[code] = newStudent;
                inserted++;
            }
        }

        if (inserted > 0 || updated > 0)
        {
            await db.SaveChangesAsync(ct);
        }

        return new UploadRosterResponse(parsed, updated, inserted);
    }
}
