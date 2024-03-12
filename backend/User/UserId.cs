using MongoDB.Bson.Serialization.Attributes;

namespace backend.User;

public class UserId : Identifier
{
    [BsonId]
    public Guid Id { get; set; }

    public UserId(Guid id)
    {
        Id = id;
    }
    
    public override string GetId()
    {
        return Id.ToString();
    }

    public override bool Equals(object? obj)
    {
        return obj is Identifier id && id.GetId().Equals(GetId());
    }
    
    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }
}