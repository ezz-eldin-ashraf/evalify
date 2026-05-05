using Evalify.Application.Common.Interfaces;
using Evalify.Domain.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Evalify.Application.Features.Students.Commands.DeleteStudent;

public sealed class DeleteStudentCommandHandler(
    IAppDbContext db,
    ICurrentUser currentUser)
    : IRequestHandler<DeleteStudentCommand, Result<Deleted>>
{
    public async Task<Result<Deleted>> Handle(
        DeleteStudentCommand request,
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

        db.Students.Remove(student);
        await db.SaveChangesAsync(ct);

        return Result.Deleted;
    }
}
