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
        var students = await db.Students
            .AsNoTracking()
            .Where(s => s.UserId == currentUser.Id)
            .OrderBy(s => s.FullName)
            .Select(s => new StudentDto(s.Id, s.StudentCode, s.FullName))
            .ToListAsync(ct);

        return students;
    }
}
