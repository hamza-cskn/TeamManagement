using System.Diagnostics;
using System.Diagnostics.Contracts;
using backend.User;
using MongoDB.Driver;

namespace backend.Repositories;

public abstract class Repository<T> : IRepository<T>
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
        {
            throw new Exception("Database or collection name is empty");
        }
        
        Collection = mongoClient.GetDatabase(database).GetCollection<T>(collection);
    }

    protected abstract string GetRepositoryName();
    public abstract void Insert(IEnumerable<T> objs);
    public abstract void Insert(T obj);
    public abstract void Update(IEnumerable<T> objs);
    public abstract void Update(T obj);
    public abstract T Load(Identifier id);
    public abstract List<T> LoadAll();
    public abstract void Delete(T obj);
    public abstract bool Exists(Identifier id);
}