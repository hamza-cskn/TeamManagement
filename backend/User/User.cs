using MongoDB.Bson.Serialization.Attributes;

namespace backend.User;

[BsonIgnoreExtraElements]
public class User : Identifiable

{
    public UserName Name { get; set; }
    public string Mail { get; set; }
    public List<UserPermission> Permissions { get; set; }
    public string? Password { get; set; }
    
    public User() {}

    public override bool Equals(object? obj)
    {
        return obj is User user && user.Id.Equals(Id);
    }
}