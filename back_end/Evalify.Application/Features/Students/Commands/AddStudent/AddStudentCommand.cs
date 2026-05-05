using Evalify.Application.Features.Students.Dtos;
using Evalify.Domain.Common.Results;
using MediatR;

namespace Evalify.Application.Features.Students.Commands.AddStudent;

public record AddStudentCommand(int StudentListId, string StudentCode, string FullName) : IRequest<Result<StudentDto>>;
