FROM mcr.microsoft.com/dotnet/aspnet:5.0.2 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0.102-ca-patch-buster-slim AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o Publish



FROM base AS final
WORKDIR /app
COPY --from=build /src/Publish/. .
ENV LANG C.UTF-8
ENTRYPOINT ["dotnet", "api-gateway-service.dll"]
