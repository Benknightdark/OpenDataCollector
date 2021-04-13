using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace identity_service.Services
{

    public class SecretService
    {
        private ILogger<SecretService> _logger;
        public HttpClient _client { get; }
        public SecretService(
           ILogger<SecretService> logger,
           HttpClient client)
        {
            _client = client;;
            //_client.BaseAddress = new Uri("http://localhost:3500/v1.0/secrets/my-secrets-store");
            _logger = logger;
        }
        public async Task<dynamic> GetClientData(){
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
                _logger.LogInformation(clientString);
                _logger.LogInformation(scope);
                _logger.LogInformation(secret);
                _logger.LogInformation("===============================");
                return new {
                    client=clientString,
                    scope=scope,
                    secret=secret
                };
        }
    }
}