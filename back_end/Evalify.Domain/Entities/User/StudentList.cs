using Evalify.Domain.Common.Results;

namespace Evalify.Domain.Entities.User;

public sealed class StudentList
{
    private StudentList() { }

    public int Id { get; private set; }
    public string UserId { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }

    public User? Teacher { get; private set; }
    public ICollection<Student> Students { get; private set; } = [];

    public static Result<StudentList> Create(string userId, string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return Error.Validation("StudentList.NameRequired", "List name is required.");

        return new StudentList
        {
            UserId = userId,
            Name = name.Trim(),
            CreatedAt = DateTime.UtcNow
        };
    }

    public void UpdateName(string name)
    {
        Name = name.Trim();
    }
}
