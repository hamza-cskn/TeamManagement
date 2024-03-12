
using backend.User;
using MongoDB.Driver;

namespace backend.Repositories;

public class IssueRepository : Repository<Issue.Issue>
{
    public IssueRepository(MongoClient mongoClient,
        ILogger<Repository<Issue.Issue>> logger,
        IConfiguration configuration) : base(mongoClient, logger, configuration)
    {
    }

    protected override string GetRepositoryName()
    {
        return "Issue";
    }

    public override void Insert(IEnumerable<Issue.Issue> objs)
    {
        Collection.InsertMany(objs);
    }

    public override void Insert(Issue.Issue obj)
    {
        Collection.InsertOne(obj);
    }

    public override void Update(IEnumerable<Issue.Issue> objs)
    {
        foreach (var issue in objs)
            Update(issue); // todo - this is not efficient
    }

    public override void Update(Issue.Issue obj)
    {
        var update = Builders<Issue.Issue>.Update
            .Set(issue => issue.Title, obj.Title)
            .Set(issue => issue.Content, obj.Content)
            .Set(issue => issue.Status, obj.Status)
            .Set(issue => issue.Assignees, obj.Assignees)
            .Set(issue => issue.Comments, obj.Comments);
        Collection.UpdateOne(issue => issue.Equals(obj), update);
    }

    public override Issue.Issue Load(Identifier id)
    {
        return Collection.FindSync(issue => issue.Id.Equals(id)).First();
    }

    public override List<Issue.Issue> LoadAll()
    {
        return Collection.FindSync(issue => true).ToList();
    }

    public override void Delete(Issue.Issue obj)
    {
        Collection.DeleteOne(issue => issue.Equals(obj));
    }

    public override bool Exists(Identifier id)
    {
        return Collection.FindSync(issue => issue.Id.Equals(id)).Any();
    }
}