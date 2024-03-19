using backend.Issue;
using MongoDB.Bson;
using MongoDB.Driver;

namespace backend.Repositories;

public class IssueCommentRepository : Repository<IssueComments>
{
    private IssueRepository _issueRepository;
    public IssueCommentRepository(MongoClient mongoClient,
        ILogger<Repository<IssueComments>> logger,
        IConfiguration configuration,
        IssueRepository issueRepository) : base(mongoClient, logger, configuration)
    {
        _issueRepository = issueRepository;
    }

    protected override string GetRepositoryName()
    {
        return "IssueComments";
    }

    public override void Insert(IEnumerable<IssueComments> objs)
    {
        Collection.InsertMany(objs);
    }

    public override void Insert(IssueComments comments)
    {
        Collection.InsertOne(comments);
    }

    public void Insert(Guid issueId, Comment comment)
    {
        if (!Exists(issueId))
        {   //todo do it for everywhere
            var comments = new IssueComments(issueId, new() { comment });
            Collection.InsertOne(comments); 
            return;
        }
        var filter = Builders<IssueComments>.Filter.Eq("_id", issueId);
        var update = Builders<IssueComments>.Update.Push("Comments", comment);
        var options = new UpdateOptions {IsUpsert = true};
        Collection.UpdateOne(filter, update, options);
    }

    public override void Update(IEnumerable<IssueComments> objs)
    {
        foreach (var issueComment in objs)
            Update(issueComment); // todo - this is not efficient
    }

    public override void Update(IssueComments comments)
    {
        Delete((Guid) comments.IssueId!); // todo - this is not efficient
        Insert(comments);
    }

    public bool Update(Guid issueId, Comment comment)
    {
        var filter = Builders<IssueComments>.Filter.Eq("_id", issueId); 
 
        var update = Builders<IssueComments>.Update.Set("Comments.$[comment].Content.Content", comment.Content); 
 
        var arrayFilter = new BsonDocumentArrayFilterDefinition<BsonDocument>(
            new BsonDocument("comment._id", comment.Id.ToBsonDocument()));

        var options = new UpdateOptions { ArrayFilters = new List<ArrayFilterDefinition> { arrayFilter }, IsUpsert = false};
 
        var result = Collection.UpdateOne(filter, update, options);
        return result.IsModifiedCountAvailable;
    }

    public override IssueComments? Load(Guid issueId)
    {
        var result = Collection.FindSync(
            comments => comments.IssueId == issueId).ToList();
        return result.Any() ? result.First() : null;
    }

    public override List<IssueComments> LoadAll()
    {
        return Collection.FindSync(comments => true).ToList();
    }
    
    public override void Delete(Guid id)
    {
        Collection.DeleteOne(comments => Equals(comments.IssueId == id));
    }

    public override bool Exists(Guid id)
    {
        return Collection.FindSync(comments => Equals(comments.IssueId, id)).Any();
    }
}