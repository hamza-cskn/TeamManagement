using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using backend.User;

namespace backend.Issue;

public enum IssueField
{
    [Description("Title")]
    Title, 
    
    [Description("Description")]
    Description,
    
    [Description("Status")]
    Status,
    
    [Description("Category")]
    Category,
    
    [Description("Priority")]
    Priority,
}

public record IssueLog(DateTime Time, IssueField Field, string OldValue, string NewValue);

public class Issue
{
    public IssueId? Id { get; set;}
    public DateTime CreatedAt { get; set;}
    [StringLength(100)]
    public string Title { get; set; }
    public RichContent Content { get; set; }
    public string Status { get; set; }
    public string Priority { get; set;}
    public string Category { get; set;}
    public Guid Creator { get; set; }
    public List<IssueComment>? Comments { get; set; }
    public List<Guid>? Assignees { get; set; }
    
    public Issue()
    {
        
    }

    public Issue(IssueId id,
        DateTime createdAt,
        string title,
        RichContent content,
        string priority,
        string status,
        string category,
        List<IssueComment> comments,
        List<Guid> assignees)
    {
        Id = id;
        CreatedAt = createdAt;
        Title = title;
        Content = content;
        Priority = priority;
        Status = status;
        Category = category;
        Comments = comments;
        Assignees = assignees;
    }
    
    public class IssueId : ModelId
    {
        public IssueId(Guid id) : base(id)
        {}
    }
}