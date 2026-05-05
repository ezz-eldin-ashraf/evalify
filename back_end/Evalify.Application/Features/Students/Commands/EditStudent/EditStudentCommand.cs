using Evalify.Application.Features.Students.Dtos;
using Evalify.Domain.Common.Results;
using MediatR;

namespace Evalify.Application.Features.Students.Commands.EditStudent;

public record EditStudentCommand(int StudentListId, int StudentId, string StudentCode, string FullName) : IRequest<Result<StudentDto>>;
