namespace backend.Chat;

public class ChatRoom : Identifiable
{
    
    public string Name { get; set; }
    public List<Guid> Members { get; set; }
    
    public ChatRoom() {}
}