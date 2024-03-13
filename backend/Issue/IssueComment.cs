using backend.User;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Issue;

public record IssueComment(RichContent Content, Guid Writer)
{
    public IssueCommentId? Id = null;
    
    public IssueComment(IssueCommentId id, RichContent content, Guid writer) : this(content, writer)
    {
        Id = id;
        Content = content;
        Writer = writer;
    }
}

public class IssueCommentId : ModelId
{
    public IssueCommentId(Guid id) : base(id) {}
}