using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace SignalR.Hubs
{
    public class ScreenShareHub : Hub
    {
        // Lưu mapping viewerId <-> ConnectionId
        private static ConcurrentDictionary<string, string> viewerConnections = new();

        // Gán viewer ID (có thể dùng Guid hoặc ConnectionId)
        public async Task JoinAsViewer()
        {
            var viewerId = Context.ConnectionId; // hoặc Guid.NewGuid().ToString()
            viewerConnections[viewerId] = Context.ConnectionId;

            // Gửi viewerId lại cho viewer
            await Clients.Caller.SendAsync("AssignViewerId", viewerId);

            // Báo cho sender có viewer mới
            await Clients.Group("sender").SendAsync("ViewerJoined", viewerId);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var viewer = viewerConnections.FirstOrDefault(x => x.Value == Context.ConnectionId);
            if (!string.IsNullOrEmpty(viewer.Key))
            {
                viewerConnections.TryRemove(viewer.Key, out _);
                await Clients.Group("sender").SendAsync("ViewerLeft", viewer.Key);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task RegisterAsSender()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "sender");
        }

        public async Task SendOffer(string viewerId, object offer)
        {
            if (viewerConnections.TryGetValue(viewerId, out var connectionId))
            {
                await Clients.Client(connectionId).SendAsync("ReceiveOffer", viewerId, offer);
            }
        }

        public async Task SendAnswer(string viewerId, object answer)
        {
            // Gửi lại cho sender (giả sử chỉ có 1 sender duy nhất)
            await Clients.Group("sender").SendAsync("ReceiveAnswer", viewerId, answer);
        }

        public async Task SendIceCandidate(string viewerId, object candidate)
        {
            // Kiểm tra xem người gửi là sender hay viewer
            if (viewerConnections.ContainsKey(viewerId))
            {
                // Gửi từ sender -> viewer
                if (viewerConnections.TryGetValue(viewerId, out var viewerConnId))
                {
                    await Clients.Client(viewerConnId).SendAsync("ReceiveIceCandidate", viewerId, candidate);
                }
            }
            else
            {
                // Gửi từ viewer -> sender
                await Clients.Group("sender").SendAsync("ReceiveIceCandidate", viewerId, candidate);
            }
        }

        public async Task ViewerLeft(string viewerId)
        {
            if (viewerConnections.TryRemove(viewerId, out _))
            {
                await Clients.Group("sender").SendAsync("ViewerLeft", viewerId);
            }
        }
    }
}
