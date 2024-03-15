using ThirdParty.Json.LitJson;

namespace backend.Issue;

public record IssueComment(RichContent Content, Guid Writer)
{
    public IssueCommentId? Id = null;
    
    public IssueComment() : this(null, Guid.Empty) {}
}

public class IssueCommentId : ModelId
{
    public IssueCommentId(Guid id) : base(id) {}
}