using MongoDB.Bson.Serialization.Attributes;

namespace backend.Issue;

public class IssueComments : Identifiable
{
    [BsonId]
    public  List<Comment> Comments { get; set; }
    
    public IssueComments(){}

    public IssueComments(Guid id, List<Comment> comments)
    {
        Id = id;
        Comments = comments;
    }
}