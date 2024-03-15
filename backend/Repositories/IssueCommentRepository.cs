using backend.Issue;
using backend.User;
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

    public void Insert(Issue.Issue.IssueId issueId, IssueComment comment)
    {
        /*if (!Exists(issueId))
        {
            var comments = new IssueComments(issueId, new() { comment });
            Collection.InsertOne(comments);
            return;
        }*/
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
        Delete(comments.IssueId); // todo - this is not efficient
        Insert(comments);
    }

    public void Update(Issue.Issue.IssueId issueId, IssueComment comment)
    {
        var filter = Builders<IssueComments>.Filter.Eq("_id", issueId);
        filter &= Builders<IssueComments>.Filter.ElemMatch(
            x => x.Comments, x => x.Id == comment.Id);

        var update = Builders<IssueComments>.Update.Set("Comments.$[comment].Content.Content", "asda");
        var filterDefinitions = new List<ArrayFilterDefinition<BsonDocument>>
            { new BsonDocument("comment._id", comment.Id.ToBson()) };
        var options = new UpdateOptions { ArrayFilters = filterDefinitions, IsUpsert = true };
        Collection.UpdateOne(filter, update, options);
    }

    public override IssueComments? Load(Identifier issueId)
    {
        var result = Collection.FindSync(
            comments => comments.IssueId == issueId).ToList();
        return result.Any() ? result.First() : null;
    }

    public override List<IssueComments> LoadAll()
    {
        return Collection.FindSync(comments => true).ToList();
    }
    
    public override void Delete(Identifier id)
    {
        Collection.DeleteOne(comments => Equals(comments.IssueId == id));
    }

    public override bool Exists(Identifier id)
    {
        return Collection.FindSync(comments => Equals(comments.IssueId, id)).Any();
    }
}