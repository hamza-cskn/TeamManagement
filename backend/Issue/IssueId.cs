using System.ComponentModel.DataAnnotations;
using backend.User;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Issue;

public class IssueId : Identifier
{
    [BsonId]
    public Guid Id { get; } 

    public IssueId(Guid id)
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