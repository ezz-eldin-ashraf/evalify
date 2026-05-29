using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Evalify.Application.Common.Interfaces;
using Evalify.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace Evalify.Infrastructure.Services;

public sealed class AiService(
    IHttpClientFactory httpClientFactory,
    ILogger<AiService> logger)
    : IAiService
{
    private const string ClientName   = "PythonAi";
    private const string EvaluatePath = "/evaluate";

    public async Task<AiEvaluationResult> EvaluateAsync(
        Stream croppedImageStream,
        string modelAnswer,
        double maxMark,
        GradingMode gradingMode,
        CancellationToken ct)
    {
        try
        {
            using var ms = new MemoryStream();
            await croppedImageStream.CopyToAsync(ms, ct);
            var imageBase64 = Convert.ToBase64String(ms.ToArray());

            var payload = new EvaluateRequest(
                imageBase64,
                modelAnswer,
                maxMark,
                gradingMode.ToString().ToLower());

            var client = httpClientFactory.CreateClient(ClientName);
            var response = await client.PostAsJsonAsync(EvaluatePath, payload, ct);

            if (!response.IsSuccessStatusCode)
            {
                logger.LogWarning("AI service returned {StatusCode}", response.StatusCode);
                return Failed();
            }

            var result = await response.Content
                .ReadFromJsonAsync<EvaluateResponse>(cancellationToken: ct);

            if (result is null || !result.Success)
            {
                logger.LogWarning("AI service returned success=false. Error: {Error}", result?.Error ?? "unknown");
                return Failed();
            }

            logger.LogInformation("AI graded — grade: {Grade}/{Max}", result.Grade, result.MaxScore);

            return new AiEvaluationResult
            {
                Success       = true,
                Grade         = result.Grade,
                ExtractedText = result.ExtractedText
            };
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(ex, "Could not reach the AI service.");
            return Failed();
        }
        catch (TaskCanceledException ex) when (!ct.IsCancellationRequested)
        {
            logger.LogError(ex, "AI service request timed out.");
            return Failed();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error calling the AI service.");
            return Failed();
        }
    }

    private static AiEvaluationResult Failed() =>
        new() { Success = false, Grade = 0, ExtractedText = null };

    private sealed record EvaluateRequest(
        [property: JsonPropertyName("image_base64")] string ImageBase64,
        [property: JsonPropertyName("model_answer")]  string ModelAnswer,
        [property: JsonPropertyName("max_score")]     double MaxScore,
        [property: JsonPropertyName("mode")]          string Mode);

    private sealed class EvaluateResponse
    {
        [JsonPropertyName("success")]          public bool    Success         { get; init; }
        [JsonPropertyName("grade")]            public double  Grade           { get; init; }
        [JsonPropertyName("extracted_text")]   public string? ExtractedText   { get; init; }
        [JsonPropertyName("final_similarity")] public double  FinalSimilarity { get; init; }
        [JsonPropertyName("max_score")]        public double  MaxScore        { get; init; }
        [JsonPropertyName("mode")]             public string? Mode            { get; init; }
        [JsonPropertyName("error")]            public string? Error           { get; init; }
    }
}
