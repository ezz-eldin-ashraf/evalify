using Evalify.Application.Common.Errors;
using Evalify.Application.Common.Interfaces;
using Evalify.Domain.Common.Results;
using Evalify.Domain.Entities.User;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Evalify.Application.Features.Auth.Commands.UpdateProfile;

public sealed class UpdateProfileCommandHandler(
    UserManager<User> userManager,
    IJwtService jwtService)
    : IRequestHandler<UpdateProfileCommand, Result<UpdateProfileResponse>>
{
    public async Task<Result<UpdateProfileResponse>> Handle(
        UpdateProfileCommand request,
        CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(request.UserId);
        if (user is null)
            return ApplicationErrors.UserNotFound;

        if (user.Email != request.Email)
        {
            var existingUser = await userManager.FindByEmailAsync(request.Email);
            if (existingUser is not null)
                return ApplicationErrors.EmailAlreadyExists;
        }

        var updateResult = user.UpdateProfile(request.FullName, request.Email);
        if (updateResult.IsError)
            return updateResult.Errors;

        var identityResult = await userManager.UpdateAsync(user);
        if (!identityResult.Succeeded)
        {
            var errors = identityResult.Errors
                .Select(e => Error.Validation(e.Code, e.Description))
                .ToList();
            return errors;
        }

        var token = jwtService.GenerateToken(user);

        return new UpdateProfileResponse(
            token!,
            user.Id,
            user.FullName,
            user.Email!);
    }
}
