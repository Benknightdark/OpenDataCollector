using Duende.IdentityServer.Models;
namespace identity_service
{
    public static class Config
    {
        public static IEnumerable<ApiScope> ApiScopes =>
            new List<ApiScope>
            {
                new ApiScope("api1", "My API")
            };

        public static IEnumerable<Client> Clients =>
            new List<Client>
            {
                new Client
                {
                    ClientId = "client11",
                    RequireRequestObject = true,

                    // no interactive user, use the clientid/secret for authentication
                    AllowedGrantTypes = GrantTypes.ClientCredentials,

                    // secret for authentication
                    ClientSecrets =
                    {
                        new Secret("fsdfsdfsdf".Sha256())
                    },
                    // scopes that client has access to
                    AllowedScopes = { "api111","user11" }
                }
            };
    }
}