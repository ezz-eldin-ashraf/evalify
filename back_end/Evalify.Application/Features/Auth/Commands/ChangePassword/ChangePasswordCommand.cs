using Evalify.Domain.Common.Results;
using MediatR;

namespace Evalify.Application.Features.Auth.Commands.ChangePassword;

public sealed record ChangePasswordCommand(
    string UserId,
    string CurrentPassword,
    string NewPassword) : IRequest<Result<bool>>;
