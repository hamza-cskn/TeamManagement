using backend.User;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Issue;

public class IssueComment
{
    public IssueCommentId Id { get; set; }
    public IssueId IssueId { get; set; }
    public RichContent Content { get; set; }
    public Guid Writer { get; set; }
    
    public IssueComment(IssueCommentId id, RichContent content, Guid writer, IssueId issueId)
    {
        Id = id;
        Content = content;
        Writer = writer;
        IssueId = issueId;
    }
}

public class IssueCommentId : Identifier
{
    [BsonId]
    public Guid Id { get; } 

    public IssueCommentId(Guid id)
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