using Evalify.Domain.Common.Results;
using MediatR;

namespace Evalify.Application.Features.Students.Commands.DeleteStudent;

public record DeleteStudentCommand(int StudentListId, int StudentId) : IRequest<Result<Deleted>>;
