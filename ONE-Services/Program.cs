using System.Reflection;
using ONE_Services;

IHost host = Host.CreateDefaultBuilder(args)
	.UseSystemd()
	.ConfigureServices(services =>
	{
		services.AddHostedService<Worker>();
	})
	.ConfigureLogging((hostContext, loggingBuilder) =>
	{
		try
		{
			var configuration = new ConfigurationBuilder()
				.AddJsonFile("appsettings.json", false, true)
				.Build();

			configuration["Logging:File:Path"] = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + configuration["Logging:File:Path"];

			var loggingSection = configuration.GetSection("Logging");
			loggingBuilder.AddFile(loggingSection);
		}
		catch(Exception)
		{

		}
		
	})
	.UseWindowsService()
	.Build();

await host.RunAsync();
