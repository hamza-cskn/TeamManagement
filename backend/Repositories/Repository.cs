using MongoDB.Driver;

namespace backend.Repositories;

public abstract class Repository<T> : IRepository<T> where T : Identifiable
{
    protected readonly ILogger<Repository<T>> Logger;
    protected readonly MongoClient MongoClient;
    protected readonly IMongoCollection<T> Collection;

    protected Repository(MongoClient mongoClient, ILogger<Repository<T>> logger, IConfiguration configuration)
    {
        MongoClient = mongoClient;
        Logger = logger;

        // ReSharper disable once VirtualMemberCallInConstructor
        var section = configuration.GetSection($"Repositories:{GetRepositoryName()}"); // Repositories:User
        var database = section.GetSection("DatabaseName").Value;
        var collection = section.GetSection("CollectionName").Value;

        if (string.IsNullOrEmpty(database) || string.IsNullOrEmpty(collection))
            throw new Exception("Database or collection name is empty");

        Collection = mongoClient.GetDatabase(database).GetCollection<T>(collection);
    }

    protected abstract string GetRepositoryName();
    public abstract void Insert(IEnumerable<T> objs);

    public void Insert(T obj)
    {
        Collection.InsertOne(obj);
    }
    
    public abstract void Update(IEnumerable<T> objs);
    public abstract void Update(T obj);

    public T? Load(Guid id)
    {
        var result = Collection.FindSync(obj => Equals(obj.Id, id));
        if (result.Any())
            return result.First();
        return null;
    }
    public abstract List<T> LoadAll();

    public void Delete(Guid id)
    {
        Collection.DeleteOne(obj => Equals(obj.Id, id));
    }

    public bool Exists(Guid id)
    {
        return Collection.FindSync(obj => Equals(obj.Id, id)).Any();
    }
}