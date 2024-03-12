using backend.Issue;
using backend.User;
using MongoDB.Driver;

namespace backend.Repositories;

public class IssueCommentRepository : Repository<IssueComment>
{
    public IssueCommentRepository(MongoClient mongoClient,
        ILogger<Repository<IssueComment>> logger,
        IConfiguration configuration) : base(mongoClient, logger, configuration)
    {
    }

    protected override string GetRepositoryName()
    {
        return "IssueComments";
    }

    public override void Insert(IEnumerable<IssueComment> objs)
    {
        Collection.InsertMany(objs);
    }

    public override void Insert(IssueComment obj)
    {
        Collection.InsertOne(obj);
    }

    public override void Update(IEnumerable<IssueComment> objs)
    {
        foreach (var issueComment in objs)
            Update(issueComment); // todo - this is not efficient
    }

    public override void Update(IssueComment obj)
    {
        var update = Builders<IssueComment>.Update
                .Set(issueComment => issueComment.Writer, obj.Writer)
                .Set(issueComment => issueComment.Content, obj.Content);
        Collection.UpdateOne(issueComment => issueComment.Equals(obj), update);
    }

    public override IssueComment Load(Identifier id)
    {
        return Collection.FindSync(issueComment => issueComment.Id.Equals(id)).First();
    }

    public override List<IssueComment> LoadAll()
    {
        throw new NotSupportedException("This method is not supported for IssueCommentRepository. Use LoadAll(Issue.Issue issue) instead.");
    }

    public List<IssueComment> LoadAll(Issue.Issue issue)
    {
        return new List<IssueComment>();
        //return Collection.FindSync(issueComment => issueComment.IssueId.Equals(issue.Id)).ToList();
    }

    public override void Delete(IssueComment obj)
    {
        Collection.DeleteOne(issueComment => issueComment.Equals(obj));
    }

    public override bool Exists(Identifier id)
    {
        return Collection.FindSync(issueComment => issueComment.Id.Equals(id)).Any();
    }
}