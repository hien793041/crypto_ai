using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ONE_Services.Common
{
	public class AppSetting
	{
		public static string ApiKey = new ConfigurationBuilder()?.AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["ApiKey"] ?? "vi";
		public static string ApiUrl = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["ApiUrl"] ?? "";
		public static int StartTime1 = int.Parse(new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["StartTime1"] ?? "0");
		public static int EndTime1 = int.Parse(new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["EndTime1"] ?? "0");
		public static int StartTime2 = int.Parse(new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["StartTime2"] ?? "0");
		public static int EndTime2 = int.Parse(new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["EndTime2"] ?? "0");
	}
}
