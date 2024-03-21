namespace backend.Chat;

public class ChatMessage : Identifiable
{
    public string Content { get; set; }
    
    public ChatMessage(string content)
    {
        Content = content;
    }


}