using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ONE_WEB.Models;
using System.Security.Claims;
using ONE_WEB.Handlers;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Resources;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Server.HttpSys;
using Microsoft.AspNetCore.Identity;
using Ganss.XSS;
using Microsoft.AspNetCore.Localization;
using ONE_WEB.Common;
//using AngleSharp.Io;
using Microsoft.AspNetCore.Hosting;

namespace ONE_WEB.Controllers
{
    public class BaseController : Controller
    {
        protected string GetCultureProvider()
        {
            string? cookieValue = Request.Cookies[".AspNetCore.Culture"];
            var cultureProvider = CookieRequestCultureProvider.ParseCookieValue(cookieValue ?? "");
            return cultureProvider?.Cultures[0].Value ?? AppSetting.DefaultCulture;
        }
    }
}
