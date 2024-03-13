using backend.User;
using MongoDB.Bson.Serialization.Attributes;

namespace backend;

public abstract class ModelId : Identifier
{
    [BsonId]
    public Guid Id { get; } 

    public ModelId(Guid id)
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