using Asp.Versioning;
using Evalify.Application.Features.Students.Commands.UploadRoster;
using Evalify.Application.Features.Students.Dtos;
using Evalify.Application.Features.Students.Queries.GetStudents;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Evalify.API.Controllers;

[Authorize]
[Route("api/v{version:apiVersion}/students")]
[ApiVersion("1.0")]
public sealed class StudentsController(ISender sender) : ApiController
{
    [HttpGet]
    [ProducesResponseType(typeof(List<StudentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [EndpointSummary("Get all students for the current teacher.")]
    [EndpointName("GetStudents")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var result = await sender.Send(new GetStudentsQuery(), ct);
        return result.Match(Ok, Problem);
    }

    [HttpPost("roster")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(UploadRosterResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [EndpointSummary("Upload a student roster Excel or CSV file.")]
    [EndpointName("UploadRoster")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UploadRoster(
        IFormFile file,
        CancellationToken ct)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File is empty or missing.");

        var result = await sender.Send(
            new UploadRosterCommand(file.OpenReadStream(), file.FileName), ct);

        return result.Match(Ok, Problem);
    }
}
