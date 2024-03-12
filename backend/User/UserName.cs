using MongoDB.Bson.Serialization.Attributes;

namespace backend.User;

public class UserName
{
    public string Name { get; set; }

    public string Surname { get; set; }

    public UserName() {}

    public UserName(string name, string surname)
    {
        Name = name;
        Surname = surname;
    }
}