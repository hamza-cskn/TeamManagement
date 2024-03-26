namespace backend.Chat;

public class CreateRoomDto
{
    public List<Guid> Participants { get; set; }
    public string Name { get; set; }
    public ChatType Type { get; set; }
    
    public CreateRoomDto() {}

}