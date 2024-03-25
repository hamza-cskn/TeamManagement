using MongoDB.Bson.Serialization.Attributes;

namespace backend;

public abstract class Identifiable
{    
    [BsonId]
    public Guid? Id { get; set;}
    
    public new bool Equals(object? obj)
    {
        return obj is Identifiable entity && entity.Id.Equals(Id);
    }

}