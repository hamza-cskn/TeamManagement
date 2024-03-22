using Microsoft.AspNetCore.SignalR;

namespace backend.Chat;

public class ChatHub : Hub
{
    
    private static readonly List<string> _messages = new();
    public async Task SendMessage(string message)
    {
        Console.WriteLine($"SendMessage method called with message: {message}");
        if (message.Contains("dont send"))
            return;
        
        await Clients.All.SendAsync("ReceiveMessage", message);
        _messages.Add(message);
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