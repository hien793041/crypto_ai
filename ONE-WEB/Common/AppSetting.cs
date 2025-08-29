namespace ONE_WEB.Common
{
    public class AppSetting
    {
        public static string DefaultCulture = new ConfigurationBuilder()?.AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["DefaultCulture"] ?? "vi";
        public static string ImageValidExtensions = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["ImageValidExtensions"] ?? "";
		public static string FileValidExtensions = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["FileValidExtensions"] ?? "";
	}
}
