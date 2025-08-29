using System.Diagnostics;
using System.Globalization;
using System.Security.Claims;
using System.Security.Principal;
using System.Xml.Linq;
using ONE_WEB.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using ONE_WEB.Handlers;
using Ganss.XSS;

namespace ONE_WEB.Controllers
{
    //[Authorize]
    public class HomeController : BaseController
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult SetCulture(string culture, string returnUrl)
        {
            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture, culture)),
                new CookieOptions { 
                    Expires = DateTimeOffset.UtcNow.AddYears(1),
                    SameSite = SameSiteMode.None
                }
            );

            //var Identity = HttpContext.User.Identity as ClaimsIdentity;
            //Identity?.RemoveClaim(Identity.FindFirst("Culture"));
            //Identity?.AddClaim(new Claim("Culture", culture));

            if (HttpContext.User.Identity is ClaimsIdentity identity)
            {
                identity.RemoveClaim(identity.FindFirst("Culture"));
                identity.AddClaim(new Claim("Culture", culture));
                HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(HttpContext.User.Identity));
            }

            return LocalRedirect(returnUrl);
        }

        public IActionResult Index()
        {
            string? cookieValue = Request.Cookies[".AspNetCore.Culture"];
            var cultureProvider = CookieRequestCultureProvider.ParseCookieValue(cookieValue ?? "");
            
            return View();
        }

		[AllowAnonymous]
        public IActionResult Privacy()
        {
            return View();
        }

        [AllowAnonymous]
        public IActionResult FAQ()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

		public ActionResult GetStatus(string data)
		{
			try
			{
				dynamic? jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(data);
#pragma warning disable CS8602 // Dereference of a possibly null reference.
				jsonObj["Culture"] = GetCultureProvider();
#pragma warning restore CS8602 // Dereference of a possibly null reference.
				jsonObj["Store"] = "status_getlist";
				
				string kq = DAL.GetDataFromAPI(jsonObj);

				return Ok(kq);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, ex.Message);
			}
			return Ok(null);
		}

		//[Route("/Home/Dashboard")]
		public IActionResult Dashboard()
        {
            //string? cookieValue = Request.Cookies[".AspNetCore.Culture"];
            //var cultureProvider = CookieRequestCultureProvider.ParseCookieValue(cookieValue ?? "");

            return View();
        }

	}
}