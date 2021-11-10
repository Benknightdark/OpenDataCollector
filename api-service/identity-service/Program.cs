using System.Reflection;
using identity_service.Extensions;
using identity_service.Middlewares;
using identity_service.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
#region DB
string DBConnectString = builder.Configuration.GetConnectionString("db");
if (!string.IsNullOrEmpty(System.Environment.GetEnvironmentVariable("SQLSERVER")))
{
    DBConnectString = Environment.GetEnvironmentVariable("SQLSERVER")!;
}
var migrationsAssembly = typeof(Program).GetTypeInfo().Assembly.GetName().Name;
System.Console.WriteLine(DBConnectString);
builder.Services.AddIdentityServer(
    options =>
    {
    }
)
.AddConfigurationStore(options =>
    {
        options.ConfigureDbContext = b => b.UseSqlServer(DBConnectString!,
            sql => sql.MigrationsAssembly(migrationsAssembly));
    })
.AddOperationalStore(options =>
    {
        options.ConfigureDbContext = b => b.UseSqlServer(DBConnectString!,
            sql => sql.MigrationsAssembly(migrationsAssembly));
    }).AddCustomCredential()
.AddCustomTokenRequestValidator<CustomTokenRequestValidator>();
#endregion
#region Services
builder.Services.AddHttpClient<SecretService>();
#endregion

var app = builder.Build();
app.UseIdentityServer();
app.MapControllers();

Task.Run(async () =>
          {
              using (var serviceScope = app?.Services?.GetService<IServiceScopeFactory>()?.CreateScope())
              {
                  var SecretServiceInvoke = serviceScope?.ServiceProvider.GetRequiredService<SecretService>();
                  await SecretServiceInvoke?.UpdateClientDataToDB()!;

              }
          });
app.Run();