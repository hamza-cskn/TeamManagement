using backend.Chat;
using MongoDB.Bson;
using MongoDB.Driver;

namespace backend.Repositories;

public class ChatMessageRepository : Repository<ChatMessage>
{
    private readonly ChatRoomRepository _chatRoomRepository;
    public ChatMessageRepository(MongoClient mongoClient,
        ILogger<Repository<ChatMessage>> logger,
        IConfiguration configuration, ChatRoomRepository chatRoomRepository) : base(mongoClient, logger, configuration)
    {
        _chatRoomRepository = chatRoomRepository;
    }

    protected override string GetRepositoryName()
    { 
        return "ChatMessages";
    }

    public override void Insert(IEnumerable<ChatMessage> objs)
    {
        throw new NotImplementedException();
    }

    public override void Update(IEnumerable<ChatMessage> objs)
    {
        throw new NotImplementedException();
    }
    
    public new void Insert(ChatMessage obj)
    {
        if (!_chatRoomRepository.Exists(obj.RoomId))
            throw new ArgumentException("Room does not exist."); //todo cache would be perfect.
        Collection.InsertOne(obj);
    }

    public override void Update(ChatMessage obj)
    {
        var update = Builders<ChatMessage>.Update.Set("Content", obj.Content);
        Collection.UpdateOne(msg => msg.Equals(obj), update);
    }
    
    //todo build pattern sounds like a good idea
    public List<ChatMessage> LoadLast(
        Guid roomId,
        int limit,
        string? searchRegex = null,
        DateTime? minDate = null,
        DateTime? maxDate = null)
    {
        var filter = Builders<ChatMessage>.Filter.Eq("RoomId", roomId);
        if (minDate != null)
            filter &= Builders<ChatMessage>.Filter.Gte("Date", minDate);
        if (maxDate != null)
            filter &= Builders<ChatMessage>.Filter.Lte("Date", maxDate);
        if (searchRegex != null)
            filter &= Builders<ChatMessage>.Filter.Regex("Content", new BsonRegularExpression(searchRegex));
        
        return Collection.Find(filter).SortByDescending(msg => msg.Time).Limit(limit).ToList();
    }
    
    public override List<ChatMessage> LoadAll()
    {
        throw new NotImplementedException();
    }
    
}