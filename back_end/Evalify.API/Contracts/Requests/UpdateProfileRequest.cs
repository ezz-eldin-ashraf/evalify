namespace Evalify.API.Contracts.Requests;

public sealed record UpdateProfileRequest(
    string FullName,
    string Email);
