using backend.Chat;
using MongoDB.Driver;

namespace backend.Repositories;

public class ChatRepository : Repository<ChatMessage>
{
    public ChatRepository(MongoClient mongoClient, ILogger<Repository<ChatMessage>> logger, IConfiguration configuration) : base(mongoClient, logger, configuration)
    {
    }

    protected override string GetRepositoryName()
    { 
        return "chat";
    }

    public override void Insert(IEnumerable<ChatMessage> objs)
    {
        throw new NotImplementedException();
    }

    public override void Update(IEnumerable<ChatMessage> objs)
    {
        throw new NotImplementedException();
    }

    public override void Update(ChatMessage obj)
    {
        var update = Builders<ChatMessage>.Update.Set("Content", obj.Content);
        var filter = Builders<ChatMessage>.Filter.Eq("MessageId", obj.Id);
        Collection.UpdateOne(filter, update);
    }

    public override List<ChatMessage> LoadAll()
    {
        throw new NotImplementedException();
    }
    
}