using System.IO;
using IdentityServer4.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using JsonWebKey = Microsoft.IdentityModel.Tokens.JsonWebKey;

namespace identity_service.Extensions
{
    public static class ServiceCollection
    {

        public static IIdentityServerBuilder AddCustomCredential(
            this IIdentityServerBuilder builder )
        {

            bool persistKey = true;
            string filename = "Credential.jwk";
            IdentityServer4.IdentityServerConstants.RsaSigningAlgorithm signingAlgorithm = IdentityServer4.IdentityServerConstants.RsaSigningAlgorithm.RS256;
             if (File.Exists(filename))
            {
                var json = File.ReadAllText(filename);
                var jwk = new JsonWebKey(json);

                return builder.AddSigningCredential(jwk, jwk.Alg);
            }
            else
            {
                var key = CryptoHelper.CreateRsaSecurityKey();
                var jwk = JsonWebKeyConverter.ConvertFromRSASecurityKey(key);
                jwk.Alg = signingAlgorithm.ToString();

                if (persistKey)
                {
                    File.WriteAllText(filename, JsonConvert.SerializeObject(jwk));
                }

                return builder.AddSigningCredential(key, signingAlgorithm);
            }
        }
           
    }
}


