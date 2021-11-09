FROM mcr.microsoft.com/dotnet/sdk:6.0-alpine AS build
WORKDIR /src
COPY . .
RUN dotnet build 
RUN dotnet publish -c Release  -o Publish

FROM mcr.microsoft.com/dotnet/aspnet:6.0-alpine AS final
EXPOSE 80
EXPOSE 443
WORKDIR /app
COPY --from=build /src/Publish/. .
RUN apk add icu-libs
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

ENTRYPOINT ["dotnet", "identity-service.dll"]
