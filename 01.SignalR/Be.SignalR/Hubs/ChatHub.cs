using Microsoft.AspNetCore.SignalR;
namespace SignalR.Hubs
{
    public class SignalHub : Hub
    {
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
