using backend.Auth;
using backend.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace backend.Chat;

public class ChatHub : Hub
{
    private ChatMessageRepository _repository;
    private AuthService _authService;

    public ChatHub(ChatMessageRepository repository, AuthService authService)
    {
        _repository = repository;
        _authService = authService;
    }

    public async Task SendMessage(string token, string room, string message)
    {
        var claims = _authService.ValidateToken(token);
        if (claims == null)
        {
            await Clients.Caller.SendAsync("MessageError", "Invalid token.");
            return;
        }
        
        var claim = claims.Claims.FirstOrDefault(claim => claim.Type == "id");
        if (claim == null)
        {
            await Clients.Caller.SendAsync("MessageError", "Id could not find in token.");
            return;
        }
        
        Console.WriteLine($"Message sent by {claim.Value} to {room}: {message}");
        await Clients.All.SendAsync("ReceiveMessage", message);
        _repository.Insert(new ChatMessage(Guid.NewGuid(), Guid.NewGuid(), message, DateTime.Now));
    }

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
        await Clients.Client(Context.ConnectionId).SendAsync("RequestReadySignal");
    }

    public async Task ClientReady()
    {
        var client = Clients.Client(Context.ConnectionId);
        foreach (var message in _messages)
            await client.SendAsync("ReceiveMessage", message);
    }
}