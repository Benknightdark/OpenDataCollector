FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY . .
RUN dotnet build 
# ENV PATH="${PATH}:/root/.dotnet/tools"
# RUN dotnet tool install --global dotnet-ef --version 5.0.5
# RUN dotnet ef database update --context PersistedGrantDbContext 
# RUN dotnet ef database update --context ConfigurationDbContext 
RUN dotnet publish -c Release  -o Publish

FROM mcr.microsoft.com/dotnet/aspnet:5.0-alpine AS final
EXPOSE 80
EXPOSE 443
WORKDIR /app
COPY --from=build /src/Publish/. .
RUN apk add icu-libs
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
# ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

ENTRYPOINT ["dotnet", "identity-service.dll"]
