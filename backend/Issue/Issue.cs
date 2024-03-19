using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;

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

[BsonIgnoreExtraElements]
public class Issue
{
    public Guid? Id { get; set;}
    public DateTime CreatedAt { get; set;}
    [StringLength(100)]
    public string Title { get; set; }
    public string Content { get; set; }
    public string? Status { get; set; }
    public string Priority { get; set;}
    public string Category { get; set;}
    public Guid Creator { get; set; }
    public List<Guid>? Assignees { get; set; }
    
    public Issue(){}
}