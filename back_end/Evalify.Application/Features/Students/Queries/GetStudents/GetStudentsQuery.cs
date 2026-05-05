using Evalify.Application.Features.Students.Dtos;
using Evalify.Domain.Common.Results;
using MediatR;

namespace Evalify.Application.Features.Students.Queries.GetStudents;

public record GetStudentsQuery(int StudentListId) : IRequest<Result<List<StudentDto>>>;
