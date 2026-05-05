using Evalify.Application.Common.Interfaces;
using Evalify.Application.Features.Students.Dtos;
using Evalify.Domain.Common.Results;
using Evalify.Domain.Entities.User;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Evalify.Application.Features.Students.Commands.AddStudent;

public sealed class AddStudentCommandHandler(
    IAppDbContext db,
    ICurrentUser currentUser)
    : IRequestHandler<AddStudentCommand, Result<StudentDto>>
{
    public async Task<Result<StudentDto>> Handle(
        AddStudentCommand request,
        CancellationToken ct)
    {
        var listExists = await db.StudentLists
            .AnyAsync(l => l.Id == request.StudentListId && l.UserId == currentUser.Id, ct);
            
        if (!listExists)
            return Error.NotFound("StudentList.NotFound", "Student list not found or access denied.");

        var codeExists = await db.Students
            .AnyAsync(s => s.StudentListId == request.StudentListId && s.StudentCode == request.StudentCode, ct);

        if (codeExists)
            return Error.Validation("Student.CodeExists", "A student with this code already exists in the list.");

        var student = Student.Create(request.StudentListId, request.StudentCode, request.FullName);
        db.Students.Add(student);
        await db.SaveChangesAsync(ct);

        return new StudentDto(student.Id, student.StudentCode, student.FullName);
    }
}
