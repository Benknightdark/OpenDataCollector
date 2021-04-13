using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
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
                //  var a=JsonDocument.Parse(clientString).RootElement.GetProperty("client").GetString();
                // _logger.LogInformation(a);
                // var b=JsonDocument.Parse(clientString).RootElement.GetProperty("scope").GetString();
                // _logger.LogInformation(b);
                // var c =JsonDocument.Parse(clientString).RootElement.GetProperty("secret").GetString();
               // _logger.LogInformation(c);
                _logger.LogInformation(clientString);
                _logger.LogInformation(scope);
                _logger.LogInformation(secret);
                _logger.LogInformation("===============================");
                var NewClients = new Client
                {
                    ClientId = clientString.Replace("{\"jwtConfig:client\":\"","").Replace("\"}",""),//client
                    RequireRequestObject = true,

                    AllowedGrantTypes = GrantTypes.ClientCredentials,

                    ClientSecrets =
                    {
                        new Secret(secret.Replace("{\"jwtConfig:secret\":\"","").Replace("\"}","").ToString().Sha256())
                    },
                    AllowedScopes = { scope.Replace("{\"jwtConfig:scope\":\"","").Replace("\"}","") }
                }.ToEntity();
                _context.Clients.Add(NewClients);
                _context.ApiScopes.Add(new ApiScope("api1", "My API").ToEntity());
                _context.SaveChanges();
        }
    }
}