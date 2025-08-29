using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Globalization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Localization;
using ONE_WEB.Models;
using System.Reflection;
using ONE_WEB;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie();

builder.Services.AddHttpContextAccessor();

var Configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json", false, true).Build();
builder.Services.AddLogging(loggingBuilder =>
{
    Configuration["Logging:File:Path"] = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + Configuration["Logging:File:Path"];

    var loggingSection = Configuration.GetSection("Logging");
    loggingBuilder.AddFile(loggingSection);
});

string supportedCultures = builder.Configuration.GetValue<string>("AppSettings:SupportedCultures");
var defaultCulture = builder.Configuration.GetValue<string>("AppSettings:DefaultCulture");

string[] lsSupportedCultures = supportedCultures.Split(",");

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    List<CultureInfo> cultures = lsSupportedCultures.Select(x => new CultureInfo(x)).ToList();

    options.DefaultRequestCulture = new Microsoft.AspNetCore.Localization.RequestCulture(defaultCulture);
    options.SupportedCultures = cultures;
    options.SupportedUICultures = cultures;
    //options.RequestCultureProviders.Add(new UserProfileRequestCultureProvider()); // Add your custom culture provider back to the list
    //options.RequestCultureProviders.Insert(0, new CustomRequestCultureProvider(context =>
    //{
    //    //...
    //    var userLangs = context.Request.Headers["Accept-Language"].ToString();
    //    var firstLang = userLangs.Split(',').FirstOrDefault();
    //    var defaultLang = string.IsNullOrEmpty(firstLang) ? "en" : firstLang;
    //    return Task.FromResult(new ProviderCultureResult(defaultLang, defaultLang));
    //}));
});

//builder.Services.AddAuthentication(
//        //options =>
//        //{
//	       // options.DefaultAuthenticateScheme = GoogleDefaults.AuthenticationScheme;
//	       // options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
//        //}
//    )
//	.AddCookie("Application")
//	.AddCookie("External")
//	.AddGoogle(googleOptions =>
//    {
//        IConfigurationSection googleAuthNSection = Configuration.GetSection("Authentication:Google");

//        googleOptions.ClientId = googleAuthNSection["ClientId"];
//        googleOptions.ClientSecret = googleAuthNSection["ClientSecret"];
//        googleOptions.CallbackPath = "/Account/GoogleLoginCallback";
//		//googleOptions.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "sub", "string");

//		//googleOptions.Events.OnRedirectToAuthorizationEndpoint = MakeHttps;

//	});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapRazorPages();

app.Run();
