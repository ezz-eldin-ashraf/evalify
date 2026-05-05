using Evalify.Application.Features.StudentLists.Dtos;
using Evalify.Domain.Common.Results;
using MediatR;

namespace Evalify.Application.Features.StudentLists.Commands.CreateStudentList;

public record CreateStudentListCommand(string Name) : IRequest<Result<StudentListDto>>;
