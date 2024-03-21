namespace backend.Issue;

public record Comment(string? Content, Guid? Writer)
{
    public Guid? Id = null;
    
    public Comment() : this(null, null) {}
}