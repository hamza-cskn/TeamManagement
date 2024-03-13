using backend.Issue;
using backend.User;
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
        var update = Builders<IssueComments>.Update.Push("comments", comments.Comments);
        Collection.UpdateOne(obj => Equals(obj.IssueId, comments.IssueId), update);
    }

    public void Insert(Issue.Issue.IssueId id, IssueComment comment)
    {
    }

    public override void Update(IEnumerable<IssueComments> objs)
    {
        foreach (var issueComment in objs)
            Update(issueComment); // todo - this is not efficient
    }

    public override void Update(IssueComments comment)
    {
        var update = Builders<IssueComments>.Update.Set($"comments.$[c].comment", comment);

        var filter = Builders<IssueComments>.Filter.Eq(i => i.IssueId == comment.IssueId) & 
                     Builders<IssueComments>.Filter.ElemMatch(i => i,c => c.IssueCommentId == comment.Id);

        Collection.UpdateOneAsync(filter, update);
    }
    
    public void Update(Issue.Issue.IssueId id, IssueComment comment)
    {
        
    }
    
    public override IssueComments Load(Identifier issueId)
    {
        return Collection.FindSync(comments => Equals(comments.IssueId, issueId)).First();
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
    
    private bool IssueExists(Issue.Issue.IssueId id)
    {
        return _issueRepository.Exists(id);
    }
}