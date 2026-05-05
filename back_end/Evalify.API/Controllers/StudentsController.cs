using Asp.Versioning;
using Evalify.Application.Features.Students.Commands.UploadRoster;
using Evalify.Application.Features.Students.Dtos;
using Evalify.Application.Features.Students.Queries.GetStudents;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Evalify.API.Controllers;

[Authorize]
[Route("api/v{version:apiVersion}/student-lists/{studentListId}/students")]
[ApiVersion("1.0")]
public sealed class StudentsController(ISender sender) : ApiController
{
    [HttpGet]
    [ProducesResponseType(typeof(List<StudentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [EndpointSummary("Get all students for a specific list.")]
    [EndpointName("GetStudents")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> GetAll(
        [FromRoute] int studentListId,
        CancellationToken ct)
    {
        var result = await sender.Send(new GetStudentsQuery(studentListId), ct);
        return result.Match(Ok, Problem);
    }

    [HttpPost("roster")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(UploadRosterResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [EndpointSummary("Upload a student roster Excel or CSV file to a list.")]
    [EndpointName("UploadRoster")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UploadRoster(
        [FromRoute] int studentListId,
        IFormFile file,
        CancellationToken ct)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File is empty or missing.");

        var result = await sender.Send(
            new UploadRosterCommand(studentListId, file.OpenReadStream(), file.FileName), ct);

        return result.Match(Ok, Problem);
    }

    [HttpPost]
    [ProducesResponseType(typeof(StudentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [EndpointSummary("Add a single student manually to a list.")]
    [EndpointName("AddStudent")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> AddStudent(
        [FromRoute] int studentListId,
        [FromBody] Evalify.Application.Features.Students.Commands.AddStudent.AddStudentCommand command,
        CancellationToken ct)
    {
        var result = await sender.Send(command with { StudentListId = studentListId }, ct);
        if (!result.IsSuccess)
            return Problem(result.Errors);

        return CreatedAtAction(nameof(GetAll), new { version = "1.0", studentListId }, result.Value);
    }

    [HttpPut("{studentId}")]
    [ProducesResponseType(typeof(StudentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [EndpointSummary("Edit a student manually.")]
    [EndpointName("EditStudent")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> EditStudent(
        [FromRoute] int studentListId,
        [FromRoute] int studentId,
        [FromBody] Evalify.Application.Features.Students.Commands.EditStudent.EditStudentCommand command,
        CancellationToken ct)
    {
        var result = await sender.Send(command with { StudentListId = studentListId, StudentId = studentId }, ct);
        return result.Match(Ok, Problem);
    }

    [HttpDelete("{studentId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [EndpointSummary("Delete a student from a list.")]
    [EndpointName("DeleteStudent")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> DeleteStudent(
        [FromRoute] int studentListId,
        [FromRoute] int studentId,
        CancellationToken ct)
    {
        var result = await sender.Send(
            new Evalify.Application.Features.Students.Commands.DeleteStudent.DeleteStudentCommand(studentListId, studentId), ct);
        
        return result.Match(_ => NoContent(), Problem);
    }
}
