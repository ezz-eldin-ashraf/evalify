namespace Evalify.Domain.Entities.User;

public sealed class Student
{
    private Student() { }

    public int Id { get; private set; }
    public int StudentListId { get; private set; }
    public string StudentCode { get; private set; } = string.Empty;
    public string FullName { get; private set; } = string.Empty;

    public StudentList? StudentList { get; private set; }

    public static Student Create(int studentListId, string studentCode, string fullName)
    {
        return new Student
        {
            StudentListId = studentListId,
            StudentCode = studentCode.Trim(),
            FullName = fullName.Trim()
        };
    }

    public void UpdateFullName(string fullName)
    {
        FullName = fullName.Trim();
    }
    
    public void UpdateCode(string studentCode)
    {
        StudentCode = studentCode.Trim();
    }
}
