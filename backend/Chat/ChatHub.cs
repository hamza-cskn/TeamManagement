using backend.Auth;
using backend.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace backend.Chat;

public class ChatHub : Hub
{
    private readonly ChatMessageRepository _repository;
    private readonly AuthService _authService;

    public ChatHub(ChatMessageRepository repository, AuthService authService)
    {
        _repository = repository;
        _authService = authService;
    }

    public async Task SendMessage(string token, string room, string message)
    {
        var id = _authService.GetClaimValue(token, "id");
        if (id == null)
        {
            await Clients.Caller.SendAsync("MessageError", "Id could not find in token or token was invalid.");
            return;
        }
        
        if (!Guid.TryParse(room, out var roomIdGuid))
        {
            await Clients.Caller.SendAsync("MessageError", "Room id could not parsed as Guid.");
            return;
        }
        
        Console.WriteLine($"Message sent by {id} to {room}: {message}");
        await Clients.All.SendAsync("ReceiveMessage", new {senderId = id, content = message, roomId = roomIdGuid, time = DateTime.Now});
        
        // todo batch operations.
        _repository.Insert(new ChatMessage(Guid.NewGuid(), roomIdGuid, message, DateTime.Now));
    }

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
        await Clients.Client(Context.ConnectionId).SendAsync("RequestReadySignal");
    }

    public Task ClientReady()
    {
        //do nothing
        return Task.CompletedTask;
    }
}