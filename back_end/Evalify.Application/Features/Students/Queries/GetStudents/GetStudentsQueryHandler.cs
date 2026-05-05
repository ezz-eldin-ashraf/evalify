using Evalify.Application.Common.Interfaces;
using Evalify.Application.Features.Students.Dtos;
using Evalify.Domain.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Evalify.Application.Features.Students.Queries.GetStudents;

public sealed class GetStudentsQueryHandler(
    IAppDbContext db,
    ICurrentUser currentUser)
    : IRequestHandler<GetStudentsQuery, Result<List<StudentDto>>>
{
    public async Task<Result<List<StudentDto>>> Handle(
        GetStudentsQuery request,
        CancellationToken ct)
    {
        var listExists = await db.StudentLists
            .AnyAsync(l => l.Id == request.StudentListId && l.UserId == currentUser.Id, ct);
            
        if (!listExists)
            return Error.NotFound("StudentList.NotFound", "Student list not found or access denied.");

        var students = await db.Students
            .AsNoTracking()
            .Where(s => s.StudentListId == request.StudentListId)
            .OrderBy(s => s.FullName)
            .Select(s => new StudentDto(s.Id, s.StudentCode, s.FullName))
            .ToListAsync(ct);

        return students;
    }
}
