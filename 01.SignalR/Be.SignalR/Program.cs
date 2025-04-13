using SignalR.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Thêm SignalR vào DI
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    //options.AddDefaultPolicy(policy =>
    //{
    //    policy.AllowAnyHeader()
    //          .AllowAnyMethod()
    //          .AllowCredentials()
    //          .SetIsOriginAllowed(origin => true); // cho phép t?t c? origin
    //});
    options.AddPolicy("AllowAngularClient", policy =>
    {
        policy.WithOrigins("http://localhost:4210") // Angular dev server
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials() // Cho phép dùng cookie/signalr websocket
              .SetIsOriginAllowed(origin => true); // cho phép t?t c? origin
    });
});
var app = builder.Build();
// Use CORS policy
app.UseCors("AllowAngularClient");
//app.UseCors();
app.MapHub<SignalHub>("/signal");
app.MapHub<ScreenShareHub>("/screenShareHub");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
