using MongoDB.Bson.Serialization.Attributes;

namespace backend.User;

[BsonIgnoreExtraElements]
public class User : Identifiable
{
    public UserName Name { get; set; }
    public string Mail { get; set; }
    public string? Department { get; set; }
    public string? Role { get; set; }
    public string? Image { get; set; }
    public List<UserPermission> Permissions { get; set; }
    public string? Password { get; set; }
    
    public User() {}

}