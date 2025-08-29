using System.IO;
using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NTS.Logging.File;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var Configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json", false, true).Build();
builder.Services.AddLogging(loggingBuilder =>
{
    Configuration["Logging:File:Path"] = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + Configuration["Logging:File:Path"];

    var loggingSection = Configuration.GetSection("Logging");
    loggingBuilder.AddFile(loggingSection);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();