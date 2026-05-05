using Evalify.Domain.Common.Results;
using MediatR;

namespace Evalify.Application.Features.Students.Commands.UploadRoster;

public record UploadRosterResponse(int ParsedCount, int UpdatedCount, int InsertedCount);

public record UploadRosterCommand(int StudentListId, Stream FileStream, string FileName) : IRequest<Result<UploadRosterResponse>>;
