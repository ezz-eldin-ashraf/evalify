using Asp.Versioning;
using Evalify.Application.Features.StudentLists.Commands.CreateStudentList;
using Evalify.Application.Features.StudentLists.Commands.RenameStudentList;
using Evalify.Application.Features.StudentLists.Dtos;
using Evalify.Application.Features.StudentLists.Queries.GetStudentLists;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Evalify.API.Controllers;

[Authorize]
[Route("api/v{version:apiVersion}/student-lists")]
[ApiVersion("1.0")]
public sealed class StudentListsController(ISender sender) : ApiController
{
    [HttpGet]
    [ProducesResponseType(typeof(List<StudentListDto>), StatusCodes.Status200OK)]
    [EndpointSummary("Get all student lists for the current teacher.")]
    [EndpointName("GetStudentLists")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var result = await sender.Send(new GetStudentListsQuery(), ct);
        return result.Match(Ok, Problem);
    }

    [HttpPost]
    [ProducesResponseType(typeof(StudentListDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [EndpointSummary("Create a new student list.")]
    [EndpointName("CreateStudentList")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> Create(
        [FromBody] CreateStudentListCommand command,
        CancellationToken ct)
    {
        var result = await sender.Send(command, ct);
        if (!result.IsSuccess)
            return Problem(result.Errors);

        return CreatedAtAction(nameof(GetAll), new { version = "1.0" }, result.Value);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(StudentListDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [EndpointSummary("Rename a student list.")]
    [EndpointName("RenameStudentList")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> Rename(
        [FromRoute] int id,
        [FromBody] RenameStudentListCommand command,
        CancellationToken ct)
    {
        var result = await sender.Send(command with { Id = id }, ct);
        return result.Match(Ok, Problem);
    }
}
