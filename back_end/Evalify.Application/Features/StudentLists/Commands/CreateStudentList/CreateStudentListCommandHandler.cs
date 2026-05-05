using Evalify.Application.Common.Interfaces;
using Evalify.Application.Features.StudentLists.Dtos;
using Evalify.Domain.Common.Results;
using Evalify.Domain.Entities.User;
using MediatR;

namespace Evalify.Application.Features.StudentLists.Commands.CreateStudentList;

public sealed class CreateStudentListCommandHandler(
    IAppDbContext db,
    ICurrentUser currentUser)
    : IRequestHandler<CreateStudentListCommand, Result<StudentListDto>>
{
    public async Task<Result<StudentListDto>> Handle(
        CreateStudentListCommand request,
        CancellationToken ct)
    {
        var result = StudentList.Create(currentUser.Id, request.Name);
        if (!result.IsSuccess)
            return result.Errors;

        var list = result.Value;
        db.StudentLists.Add(list);
        
        await db.SaveChangesAsync(ct);

        return new StudentListDto(list.Id, list.Name, 0, list.CreatedAt);
    }
}
