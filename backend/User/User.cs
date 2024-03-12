using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.Core.Authentication;

namespace backend.User;

[BsonIgnoreExtraElements]
public class User
{
    [BsonId]
    public UserId? Id { get; set; }
    public UserName Name { get; set; }
    public string Mail { get; set; }
    public List<UserPermission> Permissions { get; set; }
    public string? Password { get; set; }
    
    public User()
    {
        
    }

    public User(UserName name, UserId id, List<UserPermission> permissions)
    {
        Name = name;
        Id = id;
        Permissions = permissions;
    }

    public override bool Equals(object? obj)
    {
        return obj is User user && user.Id.Equals(Id);
    }
}