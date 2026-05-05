using Evalify.Application.Features.StudentLists.Dtos;
using Evalify.Domain.Common.Results;
using MediatR;

namespace Evalify.Application.Features.StudentLists.Queries.GetStudentLists;

public record GetStudentListsQuery() : IRequest<Result<List<StudentListDto>>>;
