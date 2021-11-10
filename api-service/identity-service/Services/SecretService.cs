using Duende.IdentityServer.EntityFramework.Mappers;
using Duende.IdentityServer.Models;
using Microsoft.EntityFrameworkCore;

namespace identity_service.Services
{

    public class SecretService
    {
        private ILogger<SecretService> _logger;
        private Duende.IdentityServer.EntityFramework.DbContexts.ConfigurationDbContext _context;
        public HttpClient _client { get; }
        public SecretService(
           ILogger<SecretService> logger,
           HttpClient client, Duende.IdentityServer.EntityFramework.DbContexts.ConfigurationDbContext context)
        {
            _client = client; ;
            _logger = logger;
            _context = context;
        }
        public async Task UpdateClientDataToDB()
        {
            _context.Database.Migrate();

            string clientString = string.Empty;
            string scope = string.Empty;
            string secret = string.Empty;
            var AspnetCoreEnv = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            if (AspnetCoreEnv != "Development")
            {
                var r = await _client.GetAsync("http://localhost:3500/v1.0/secrets/kubernetes/opendatasecrets");
                System.Text.Json.JsonDocument jd = System.Text.Json.JsonDocument.Parse(await r.Content.ReadAsStringAsync());
                clientString = jd.RootElement.GetProperty("client").ToString();
                scope = jd.RootElement.GetProperty("scope").ToString();
                secret = jd.RootElement.GetProperty("secret").ToString();
                _logger.LogError(await r.Content.ReadAsStringAsync());
            }
            else
            {
                var r = await _client.GetAsync("http://localhost:3500/v1.0/secrets/local-secret-store/jwtConfig");
                System.Text.Json.JsonDocument jd = System.Text.Json.JsonDocument.Parse(await r.Content.ReadAsStringAsync());
                clientString = jd.RootElement.GetProperty("client").ToString();
                scope = jd.RootElement.GetProperty("scope").ToString();
                secret = jd.RootElement.GetProperty("secret").ToString();
                _logger.LogInformation(clientString);
                _logger.LogInformation(scope);
                _logger.LogInformation(secret);

            }
            if (!_context.Clients.Any())
            {
                var NewClients = new Client
                {
                    ClientId = clientString,
                    RequireRequestObject = true,

                    AllowedGrantTypes = GrantTypes.ClientCredentials,

                    ClientSecrets =
                    {
                        new Secret(secret.ToString().Sha256())
                    },
                    AllowedScopes = { scope }
                }.ToEntity();
                _context.Clients.Add(NewClients);
            }

            if (!_context.ApiScopes.Any())
            {
                _context.ApiScopes.Add(new ApiScope("api1", "My API").ToEntity());

            }
            _context.SaveChanges();
        }
    }
}