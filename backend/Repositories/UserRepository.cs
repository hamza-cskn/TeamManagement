using System.Linq.Expressions;
using backend.User;
using MongoDB.Driver;

namespace backend.Repositories;

public class UserRepository : Repository<User.User>
{
    public UserRepository(MongoClient mongoClient,
        ILogger<Repository<User.User>> logger,
        IConfiguration configuration) : base(mongoClient, logger, configuration)
    {
    }
    
    protected override string GetRepositoryName()
    {
        return "User";
    }

    public override void Insert(IEnumerable<User.User> objs)
    {
        Collection.InsertMany(objs);
    }
    public override void Update(IEnumerable<User.User> objs)
    {
        foreach (var user in objs)
            Update(user); // todo - this is not efficient
    }

    public override void Update(User.User obj)
    {
        var update = Builders<User.User>.Update
            .Set<UserName>(user => user.Name, obj.Name)
            .Set(user => user.Permissions, obj.Permissions);
        Collection.UpdateOne(user => user.Equals(obj), update);
    }
    
    public override List<User.User> LoadAll()
    {
        return Collection.FindSync(user => true).ToList();
    }
    
    public List<User.User> LoadAll(Expression<Func<User.User, bool>> filter)
    {
        return Collection.FindSync(filter).ToList();
    }
    
    public bool Exists(Expression<Func<User.User, bool>> filter)
    {
        return LoadAll(filter).Any();
    }

}