using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using IdentityServer4.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace identity_service.Services
{

    public class SecretService
    {
        private ILogger<SecretService> _logger;
        private ConfigurationDbContext _context;
        public HttpClient _client { get; }
        public SecretService(
           ILogger<SecretService> logger,
           HttpClient client, ConfigurationDbContext context)
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
            var checkEnvExist = Environment.GetEnvironmentVariable("SECRET");
            if (string.IsNullOrEmpty(checkEnvExist))
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
                clientString = Environment.GetEnvironmentVariable("CLIENT");
                scope = Environment.GetEnvironmentVariable("SCOPE");
                secret = Environment.GetEnvironmentVariable("SECRET");
            }
            _logger.LogInformation(System.Text.Json.JsonSerializer.Serialize(_context.Clients.ToList()));
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