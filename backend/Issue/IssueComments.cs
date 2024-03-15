using MongoDB.Bson.Serialization.Attributes;

namespace backend.Issue;

public record IssueComments
{
    [BsonId]
    public Issue.IssueId? IssueId { get; set; }
    public  List<IssueComment> Comments { get; set; }
    
    public IssueComments(){}

    public IssueComments(Issue.IssueId issueId, List<IssueComment> comments)
    {
        IssueId = issueId;
        Comments = comments;
    }
}