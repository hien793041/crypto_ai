using System.Runtime.CompilerServices;
using Microsoft.Extensions.Configuration;

namespace ONE_API.Common
{
	public class AppSetting
	{
        public static string Key = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["Key"];
    }
}
