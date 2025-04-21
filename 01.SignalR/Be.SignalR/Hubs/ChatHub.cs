using Microsoft.AspNetCore.SignalR;
namespace SignalR.Hubs
{
    public class SignalHub : Hub
    {
        #region t-signaling.service.ts
        private static string? _senderConnectionId;
        public async Task RegisterSender()
        {
            _senderConnectionId = Context.ConnectionId;
            Console.WriteLine($"Sender connected: {_senderConnectionId}");
        }

        public async Task RegisterViewer()
        {
            var viewerId = Context.ConnectionId;
            Console.WriteLine($"Viewer connected: {viewerId}");

            if (_senderConnectionId != null)
            {
                await Clients.Client(_senderConnectionId).SendAsync("ReceiveViewer", viewerId);
            }
        }
        public async Task SendOfferToViewer(string viewerId, object offer)
        {
            await Clients.Client(viewerId).SendAsync("ReceiveOffer", offer);
        }

        public async Task SendAnswerToSender(object answer)
        {
            if (_senderConnectionId != null)
            {
                await Clients.Client(_senderConnectionId).SendAsync("ReceiveAnswer", Context.ConnectionId, answer);
            }
        }

        public async Task SendCandidateToViewer(string viewerId, object candidate)
        {
            await Clients.Client(viewerId).SendAsync("ReceiveCandidateFromSender", candidate);
        }

        public async Task SendCandidateToSender(object candidate)
        {
            if (_senderConnectionId != null)
            {
                await Clients.Client(_senderConnectionId).SendAsync("ReceiveCandidateFromViewer", Context.ConnectionId, candidate);
            }
        }
        #endregion
        //
        public async Task SendSignal(string user, string signalData)
        {
            // Gửi message đến tất cả các client trừ người gửi
            await Clients.Others.SendAsync("ReceiveSignal", user, signalData);
        }
        public async Task SendOffer(object offer, string toConnectionId)
        {
            await Clients.Client(toConnectionId).SendAsync("ReceiveOffer", offer);
        }

        public async Task SendAnswer(object answer, string toConnectionId)
        {
            await Clients.Client(toConnectionId).SendAsync("ReceiveAnswer", answer);
        }

        public async Task SendCandidate(object candidate, string toConnectionId)
        {
            await Clients.Client(toConnectionId).SendAsync("ReceiveCandidate", candidate);
        }
    }
}
