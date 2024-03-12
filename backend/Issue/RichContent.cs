using System.ComponentModel.DataAnnotations;

namespace backend.Issue;

/**
 * A class that represents a rich content.
 */
public class RichContent
{
    [StringLength(50000)]
    public string Content { get; set; }
    public RichContent()
    {
        
    }
    
    public RichContent(string content)
    {
        Content = content;
    }

}