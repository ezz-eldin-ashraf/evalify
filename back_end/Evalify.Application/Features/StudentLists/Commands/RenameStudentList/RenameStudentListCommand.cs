using Evalify.Application.Features.StudentLists.Dtos;
using Evalify.Domain.Common.Results;
using MediatR;

namespace Evalify.Application.Features.StudentLists.Commands.RenameStudentList;

public record RenameStudentListCommand(int Id, string Name) : IRequest<Result<StudentListDto>>;
