using MongoDB.Bson.Serialization.Attributes;

namespace backend.Issue;

public record IssueComments
{
    [BsonId]
    public Guid? IssueId { get; set; }
    public  List<Comment> Comments { get; set; }
    
    public IssueComments(){}

    public IssueComments(Guid issueId, List<Comment> comments)
    {
        IssueId = issueId;
        Comments = comments;
    }
}