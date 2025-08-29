using System.Security.Claims;
using ONE_WEB.Helpers;
using Microsoft.AspNetCore.Localization;

namespace ONE_WEB.Resources
{
    public class MyResources
    {
        private static IResourceProvider resourceProvider = new ResourceProvider();
		public static string DefaultCulture = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["DefaultCulture"] ?? "en";
		public static string? GetResourceByKey(string key, string? culture)
        {
            return resourceProvider.GetResource(key, culture ?? DefaultCulture) as String;
        }
    }
}
