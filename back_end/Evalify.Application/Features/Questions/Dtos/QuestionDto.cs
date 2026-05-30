using Evalify.Domain.Enums;

namespace Evalify.Application.Features.Questions.Dtos;

public sealed record QuestionDto(
    int QuestionId,
    int QuestionIndex,
    int X,
    int Y,
    int Width,
    int Height,
    string ModelAnswer,
    double Mark,
    GradingMode GradingMode);
