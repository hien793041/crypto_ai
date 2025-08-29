//using System.Text.RegularExpressions;
//using Microsoft.AspNetCore.Routing;

//namespace ONE_WEB.RouteLocalization
//{
//    public class CultureConstraint : IRouteConstraint
//    {
//        private readonly string _defaultCulture;
//        private readonly Regex _cultureRegex = new Regex("^[a-z]{2}$");

//        public CultureConstraint(string defaultCulture)
//        {
//            this._defaultCulture = defaultCulture;
//        }

//        public bool Match(
//            HttpContext httpContext,
//            Route route,
//            string parameterName,
//            RouteValueDictionary values,
//            RouteDirection routeDirection)
//        {

//            {
//                //TODO can check if cutlure is a valid ISO culture
//                if (values["culture"] != null && Common.AppSetting.DefaultCulture.Contains(values["culture"].ToString()))
//                {
//                    HttpCookie cookie = httpContext.Request.Cookies["Language"];
//                    if (cookie == null)
//                    {
//                        cookie = new HttpCookie("Language");
//                        cookie.Value = values["culture"].ToString();
//                        httpContext.Response.Cookies.Add(cookie);
//                    }
//                    else
//                    {
//                        cookie.Value = values["culture"].ToString();
//                        httpContext.Response.Cookies.Set(cookie);
//                    }
//                }

//                return _cultureRegex.IsMatch((string)values[parameterName]);
//            }
//        }

//        public bool Match(HttpContext? httpContext, IRouter? route, string routeKey, RouteValueDictionary values, RouteDirection routeDirection)
//        {
//            throw new NotImplementedException();
//        }
//    }
//}
