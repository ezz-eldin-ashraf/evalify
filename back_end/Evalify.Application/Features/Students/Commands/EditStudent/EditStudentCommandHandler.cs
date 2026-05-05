using Evalify.Application.Common.Interfaces;
using Evalify.Application.Features.Students.Dtos;
using Evalify.Domain.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Evalify.Application.Features.Students.Commands.EditStudent;

public sealed class EditStudentCommandHandler(
    IAppDbContext db,
    ICurrentUser currentUser)
    : IRequestHandler<EditStudentCommand, Result<StudentDto>>
{
    public async Task<Result<StudentDto>> Handle(
        EditStudentCommand request,
        CancellationToken ct)
    {
        var listExists = await db.StudentLists
            .AnyAsync(l => l.Id == request.StudentListId && l.UserId == currentUser.Id, ct);
            
        if (!listExists)
            return Error.NotFound("StudentList.NotFound", "Student list not found or access denied.");

        var student = await db.Students
            .FirstOrDefaultAsync(s => s.Id == request.StudentId && s.StudentListId == request.StudentListId, ct);

        if (student == null)
            return Error.NotFound("Student.NotFound", "Student not found in this list.");

        if (student.StudentCode != request.StudentCode)
        {
            var codeExists = await db.Students
                .AnyAsync(s => s.StudentListId == request.StudentListId && s.StudentCode == request.StudentCode && s.Id != request.StudentId, ct);

            if (codeExists)
                return Error.Validation("Student.CodeExists", "Another student with this code already exists in the list.");
        }

        student.UpdateCode(request.StudentCode);
        student.UpdateFullName(request.FullName);

        await db.SaveChangesAsync(ct);

        return new StudentDto(student.Id, student.StudentCode, student.FullName);
    }
}
