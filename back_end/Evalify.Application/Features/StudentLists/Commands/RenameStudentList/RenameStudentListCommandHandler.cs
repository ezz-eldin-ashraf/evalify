using Evalify.Application.Common.Interfaces;
using Evalify.Application.Features.StudentLists.Dtos;
using Evalify.Domain.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Evalify.Application.Features.StudentLists.Commands.RenameStudentList;

public sealed class RenameStudentListCommandHandler(
    IAppDbContext db,
    ICurrentUser currentUser)
    : IRequestHandler<RenameStudentListCommand, Result<StudentListDto>>
{
    public async Task<Result<StudentListDto>> Handle(
        RenameStudentListCommand request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Error.Validation("StudentList.NameRequired", "List name cannot be empty.");

        var list = await db.StudentLists
            .FirstOrDefaultAsync(l => l.Id == request.Id && l.UserId == currentUser.Id, ct);

        if (list is null)
            return Error.NotFound("StudentList.NotFound", "Student list not found or access denied.");

        list.UpdateName(request.Name);
        await db.SaveChangesAsync(ct);

        var studentCount = await db.Students.CountAsync(s => s.StudentListId == list.Id, ct);

        return new StudentListDto(list.Id, list.Name, studentCount, list.CreatedAt);
    }
}
