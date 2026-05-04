using Evalify.Domain.Common.Results;
using MediatR;

namespace Evalify.Application.Features.Auth.Commands.UpdateProfile;

public sealed record UpdateProfileCommand(
    string UserId,
    string FullName,
    string Email) : IRequest<Result<UpdateProfileResponse>>;

public sealed record UpdateProfileResponse(
    string Token,
    string UserId,
    string FullName,
    string Email);
