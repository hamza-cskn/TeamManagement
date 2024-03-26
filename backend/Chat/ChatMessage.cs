namespace backend.Chat;

public class ChatMessage : Identifiable
{
    public Guid SenderId { get; set; }
    public Guid RoomId { get; set; }
    public string Content { get; set; }
    public DateTime Time { get; set; }
    
    public ChatMessage(){}
    
    public ChatMessage(Guid senderId, Guid roomId, string content, DateTime time)
    {
        Id = Guid.NewGuid();
        SenderId = senderId;
        RoomId = roomId;
        Content = content;
        Time = time;
    }

}