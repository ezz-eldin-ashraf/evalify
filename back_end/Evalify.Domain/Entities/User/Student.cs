namespace Evalify.Domain.Entities.User;

public sealed class Student
{
    private Student() { }

    public int Id { get; private set; }
    public string UserId { get; private set; } = string.Empty;
    public string StudentCode { get; private set; } = string.Empty;
    public string FullName { get; private set; } = string.Empty;

    public User? Teacher { get; private set; }

    public static Student Create(string userId, string studentCode, string fullName)
    {
        return new Student
        {
            UserId = userId,
            StudentCode = studentCode.Trim(),
            FullName = fullName.Trim()
        };
    }

    public void UpdateFullName(string fullName)
    {
        FullName = fullName.Trim();
    }
}
