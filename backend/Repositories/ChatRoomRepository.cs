using backend.Chat;
using MongoDB.Bson;
using MongoDB.Driver;

namespace backend.Repositories;

public class ChatRoomRepository : Repository<ChatRoom>
{
    public ChatRoomRepository(MongoClient mongoClient,
        ILogger<Repository<ChatRoom>> logger,
        IConfiguration configuration) : base(mongoClient, logger, configuration)
    {
    }

    protected override string GetRepositoryName()
    { 
        return "ChatRoom";
    }

    public override void Insert(IEnumerable<ChatRoom> objs)
    {
        throw new NotImplementedException();
    }

    public override void Update(IEnumerable<ChatRoom> objs)
    {
        throw new NotImplementedException();
    }
    
    public List<ChatRoom> LoadByUserId(Guid userId)
    {
        var filter = Builders<ChatRoom>.Filter.AnyIn(
            room => room.Participants,
            new[] { userId });
        
        return Collection.FindSync(filter).ToList();
    }

    public override void Update(ChatRoom obj)
    {
        var update = Builders<ChatRoom>.Update
                .Set("Name", obj.Name)
                .Set("Participants", obj.Participants);
        Collection.UpdateOne(room => room.Equals(obj), update);
    }

    public override List<ChatRoom> LoadAll()
    {
        throw new NotImplementedException();
    }
    
}