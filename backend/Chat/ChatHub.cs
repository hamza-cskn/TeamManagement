using Microsoft.AspNetCore.SignalR;

namespace backend.Chat;

public class ChatHub : Hub
{
    public async Task SendMessage(string message)
    {
        Console.WriteLine("SendMessage method called with message: " + message);
        if (!message.Contains("dont send"))
            await Clients.All.SendAsync("ReceiveMessage", message);
    }
    
}