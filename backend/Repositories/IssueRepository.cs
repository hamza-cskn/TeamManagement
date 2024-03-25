
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
            .Set(issue => issue.Assignees, obj.Assignees);
        Collection.UpdateOne(issue => issue.Equals(obj), update);
        
    }
    
    public override List<Issue.Issue> LoadAll()
    {
        return Collection.FindSync(issue => true).ToList();
    }
}