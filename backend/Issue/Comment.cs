
namespace backend.Issue;

public record Comment(RichContent Content, Guid Writer)
{
    public CommentId? Id = null;
    
    public Comment() : this(null, Guid.Empty) {}
}

public class CommentId : ModelId
{
    public CommentId(Guid id) : base(id) {}
}