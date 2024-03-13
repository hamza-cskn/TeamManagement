using MongoDB.Bson.Serialization.Attributes;

namespace backend.User;

public class UserId : ModelId
{
    public UserId(Guid id) : base(id) {}
}