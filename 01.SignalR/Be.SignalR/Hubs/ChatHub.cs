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
    }
}
