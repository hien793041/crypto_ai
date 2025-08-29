//using System.ComponentModel.DataAnnotations;

//namespace ONE_WEB.Helpers
//{
//    public class GlobalHelper
//    {
//        public static string CurrentCulture
//        {
//            get
//            {
//                return Thread.CurrentThread.CurrentUICulture.Name;
//            }
//        }
//        public static string DefaultCulture
//        {
//            get
//            {
//                Configuration config = WebConfigurationManager.OpenWebConfiguration("/");
//                GlobalizationSection section = (GlobalizationSection)config.GetSection("system.web/globalization");
//                return section.UICulture;
//            }
//        }

//        public static string GetCultureOnRouteData(HttpRequest request)
//        {
//            try
//            {
//                string culture = "";
//                if (request.RequestContext.RouteData.Values["culture"] != null)
//                    culture = request.RequestContext.RouteData.Values["culture"].ToString();
//                else
//                    return "en";

//                if (String.IsNullOrEmpty(culture))
//                    culture = "en";

//                if (!ConfigurationManager.AppSettings["SupportedCultures"].Contains(culture))
//                    return "en";

//                return culture;
//            }
//            catch (Exception ex)
//            {
//                Utils.logger.Error("GlobalHelper GetCultureOnRouteData : " + ex.Message);
//            }
//            return "en";

//        }


//        public static bool IsValidEmail(string source)
//        {
//            return new EmailAddressAttribute().IsValid(source);
//        }
//    }
//}
