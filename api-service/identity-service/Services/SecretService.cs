using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using IdentityServer4.Models;
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
           HttpClient client,ConfigurationDbContext context)
        {
            _client = client;;
            //_client.BaseAddress = new Uri("http://localhost:3500/v1.0/secrets/my-secrets-store");
            _logger = logger;
            _context=context;
        }
        public async Task GetClientData(){
            string clientString = string.Empty;
                string scope = string.Empty;
                string secret = string.Empty;
                var response = await _client.GetAsync("http://localhost:3500/v1.0/secrets/my-secret-store/jwtConfig:client");
                clientString = await response.Content.ReadAsStringAsync();
                var response2 = await _client.GetAsync("http://localhost:3500/v1.0/secrets/my-secret-store/jwtConfig:scope");
                scope = await response2.Content.ReadAsStringAsync();
                var response3 = await _client.GetAsync("http://localhost:3500/v1.0/secrets/my-secret-store/jwtConfig:secret");
                secret = await response3.Content.ReadAsStringAsync();
                _logger.LogInformation("===============================");
                // _logger.LogInformation(System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(clientString)["client"].ToString());
                // _logger.LogInformation(System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(scope)["scope"].ToString());
                // _logger.LogInformation(System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(secret)["secret"].ToString());
                _logger.LogInformation(clientString);
                _logger.LogInformation(scope);
                _logger.LogInformation(secret);
                _logger.LogInformation("===============================");


                // context.Database.Migrate();
                var NewClients = new Client
                {
                    ClientId = clientString,//client
                    RequireRequestObject = true,

                    AllowedGrantTypes = GrantTypes.ClientCredentials,

                    ClientSecrets =
                    {
                        new Secret(secret.ToString().Sha256())
                    },
                    AllowedScopes = { scope }
                }.ToEntity();
                _context.Clients.Add(NewClients);
                _context.ApiScopes.Add(new ApiScope("api1", "My API").ToEntity());
                _context.SaveChanges();
                // return new {
                //     client=clientString,
                //     scope=scope,
                //     secret=secret
                // };
        }
    }
}