
using System.Reflection;
using System.Threading.Tasks;
using identity_service.Extensions;
using identity_service.Middlewares;
using identity_service.Services;
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
            string DBConnectString = Configuration.GetConnectionString("db");
            if (!string.IsNullOrEmpty(System.Environment.GetEnvironmentVariable("SQLSERVER")))
            {
                DBConnectString = System.Environment.GetEnvironmentVariable("SQLSERVER");
            }
            var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;
            System.Console.WriteLine(DBConnectString);
            services.AddIdentityServer(
                options =>
                {
                }
            )
                .AddConfigurationStore(options =>
                {
                    options.ConfigureDbContext = b => b.UseSqlServer(DBConnectString,
                        sql => sql.MigrationsAssembly(migrationsAssembly));
                })
                .AddOperationalStore(options =>
                {
                    options.ConfigureDbContext = b => b.UseSqlServer(DBConnectString,
                        sql => sql.MigrationsAssembly(migrationsAssembly));
                }).AddCustomCredential()
            //.AddDeveloperSigningCredential()
            .AddCustomTokenRequestValidator<CustomTokenRequestValidator>();
            services.AddHttpClient<SecretService>();
        }
        private async Task InitializeDatabase(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                var SecretServiceInvoke = serviceScope.ServiceProvider.GetRequiredService<SecretService>();
                await SecretServiceInvoke.UpdateClientDataToDB();

            }
        }
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            Task.Run(async () =>
          {
              await InitializeDatabase(app);
          });
            // app.UseDeveloperExceptionPage();
            app.UseIdentityServer();
        }
    }
}
