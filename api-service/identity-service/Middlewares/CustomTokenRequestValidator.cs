using Duende.IdentityServer.Validation;
using System.Security.Claims;
using System.Threading.Tasks;

namespace identity_service.Middlewares
{
    public class CustomTokenRequestValidator : ICustomTokenRequestValidator
    {
        public Task ValidateAsync(CustomTokenRequestValidationContext context)
        {
            context.Result.ValidatedRequest.Client.AlwaysSendClientClaims = true;
            var ReqParamsDict = context.Result.ValidatedRequest.Raw["user_id"]?.ToString();
            context.Result.ValidatedRequest.ClientClaims.Add(new Claim("user_id", ReqParamsDict!));
            return Task.CompletedTask;
        }

        public CustomTokenRequestValidator()
        {

        }
    }
}