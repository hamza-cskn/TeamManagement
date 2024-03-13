namespace backend.Issue;

public record IssueComments
{
    public Issue.IssueId IssueId { get; set; }
    public  List<IssueComment> Comments { get; set; }
    
    public IssueComments(Issue.IssueId issueId, List<IssueComment> comments)
    {
        IssueId = issueId;
        Comments = comments;
    }
}