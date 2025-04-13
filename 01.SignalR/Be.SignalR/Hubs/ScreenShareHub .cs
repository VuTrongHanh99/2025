using Microsoft.AspNetCore.SignalR;

namespace SignalR.Hubs
{
    public class ScreenShareHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            Console.WriteLine($"Client connected: {Context.ConnectionId}");
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            Console.WriteLine($"Client disconnected: {Context.ConnectionId}");
            Clients.All.SendAsync("ViewerDisconnected", Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }

        public async Task JoinAsViewer()
        {
            await Clients.Caller.SendAsync("ViewerId", Context.ConnectionId);
        }

        public async Task SendOffer(string viewerId, string offer)
        {
            await Clients.Client(viewerId).SendAsync("ReceiveOffer", Context.ConnectionId, offer);
        }

        public async Task SendAnswer(string broadcasterId, string answer)
        {
            await Clients.Client(broadcasterId).SendAsync("ReceiveAnswer", Context.ConnectionId, answer);
        }

        public async Task SendCandidate(string peerId, string candidate)
        {
            await Clients.Client(peerId).SendAsync("ReceiveCandidate", Context.ConnectionId, candidate);
        }
    }
}
