namespace backend.Chat;

public class ChatMessage
{
    Guid Id { get; }
    Guid ChatId { get; }
    string Content { get; }
}