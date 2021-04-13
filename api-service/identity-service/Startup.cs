
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Threading.Tasks;
using identity_service.Middlewares;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


namespace identity_service
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            //     Task.Run(async () =>
            //    {

            //        try
            //        {
            //            HttpClient client = new HttpClient();
            //            var response = await client.GetAsync("http://localhost:3500/v1.0/secrets/my-secrets-store/jwtConfig");
            //            // response.EnsureSuccessStatusCode();
            //            string secret = await response.Content.ReadAsStringAsync();
            //            System.Console.WriteLine("===============================");
            //            System.Console.WriteLine(secret);
            //            System.Console.WriteLine("===============================");
            //        }
            //        catch (System.Exception e)
            //        {
            //            System.Console.WriteLine("===============================");
            //            System.Console.WriteLine(e.Message);
            //            System.Console.WriteLine("===============================");
            //        }
            //    });
            var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;

            services.AddIdentityServer()
            // .AddInMemoryApiScopes(Config.ApiScopes)
            // .AddInMemoryClients(Config.Clients)
                .AddConfigurationStore(options =>
                {
                    options.ConfigureDbContext = b => b.UseSqlServer(Configuration.GetConnectionString("db"),
                        sql => sql.MigrationsAssembly(migrationsAssembly));
                })
                .AddOperationalStore(options =>
                {
                    options.ConfigureDbContext = b => b.UseSqlServer(Configuration.GetConnectionString("db"),
                        sql => sql.MigrationsAssembly(migrationsAssembly));
                })
            .AddDeveloperSigningCredential()
            .AddCustomTokenRequestValidator<CustomTokenRequestValidator>();


        }
private void InitializeDatabase(IApplicationBuilder app)
{
    using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
    {
        serviceScope.ServiceProvider.GetRequiredService<PersistedGrantDbContext>().Database.Migrate();

        var context = serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();
        context.Database.Migrate();
        if (!context.Clients.Any())
        {
            foreach (var client in Config.Clients)
            {
                context.Clients.Add(client.ToEntity());
            }
            context.SaveChanges();
        }

        // if (!context.IdentityResources.Any())
        // {
        //     foreach (var resource in Config.IdentityResources)
        //     {
        //         context.IdentityResources.Add(resource.ToEntity());
        //     }
        //     context.SaveChanges();
        // }

        if (!context.ApiScopes.Any())
        {
            foreach (var resource in Config.ApiScopes)
            {
                context.ApiScopes.Add(resource.ToEntity());
            }
            context.SaveChanges();
        }
    }
}
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
                InitializeDatabase(app);

            app.UseDeveloperExceptionPage();
            app.UseIdentityServer();
        }
    }
}
