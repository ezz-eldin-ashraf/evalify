using Evalify.Domain.Common.Results;
using Evalify.Domain.Enums;
using MediatR;

namespace Evalify.Application.Features.Questions.Commands.SaveQuestions;

public sealed record SaveQuestionsCommand(
    int TemplateId,
    List<QuestionItem> Questions) : IRequest<Result<Updated>>;

public sealed record QuestionItem(
    int QuestionIndex,
    int X,
    int Y,
    int Width,
    int Height,
    string ModelAnswer,
    double Mark,
    GradingMode GradingMode);
