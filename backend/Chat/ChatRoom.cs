namespace backend.Chat;

public class ChatRoom : Identifiable
{
    
    public string Name { get; set; }
    public List<Guid> Participants { get; set; }
    public ChatType Type { get; set; }
    
    public ChatRoom() {}
    
    public ChatRoom(string name, List<Guid> participants)
    {
        Id = Guid.NewGuid();
        Name = name;
        Participants = participants;
    }
}

public enum ChatType
{
    Group,
    Direct
}