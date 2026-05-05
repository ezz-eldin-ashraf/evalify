using Evalify.Application.Common.Interfaces;
using Evalify.Application.Features.StudentLists.Dtos;
using Evalify.Domain.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Evalify.Application.Features.StudentLists.Queries.GetStudentLists;

public sealed class GetStudentListsQueryHandler(
    IAppDbContext db,
    ICurrentUser currentUser)
    : IRequestHandler<GetStudentListsQuery, Result<List<StudentListDto>>>
{
    public async Task<Result<List<StudentListDto>>> Handle(
        GetStudentListsQuery request,
        CancellationToken ct)
    {
        var lists = await db.StudentLists
            .AsNoTracking()
            .Where(l => l.UserId == currentUser.Id)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => new StudentListDto(l.Id, l.Name, l.Students.Count, l.CreatedAt))
            .ToListAsync(ct);

        return lists;
    }
}
