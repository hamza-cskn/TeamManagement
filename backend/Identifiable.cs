using MongoDB.Bson.Serialization.Attributes;

namespace backend;

public abstract class Identifiable
{    
    [BsonId]
    public Guid? Id { get; set;}
}