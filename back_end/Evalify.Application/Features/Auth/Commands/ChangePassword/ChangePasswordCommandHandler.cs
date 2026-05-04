using Evalify.Application.Common.Errors;
using Evalify.Domain.Common.Results;
using Evalify.Domain.Entities.User;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Evalify.Application.Features.Auth.Commands.ChangePassword;

public sealed class ChangePasswordCommandHandler(
    UserManager<User> userManager)
    : IRequestHandler<ChangePasswordCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(
        ChangePasswordCommand request,
        CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(request.UserId);
        if (user is null)
            return ApplicationErrors.UserNotFound;

        var identityResult = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        
        if (!identityResult.Succeeded)
        {
            var errors = identityResult.Errors
                .Select(e => Error.Validation(e.Code, e.Description))
                .ToList();
            return errors;
        }

        return true;
    }
}
