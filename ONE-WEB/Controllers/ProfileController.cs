using Ganss.XSS;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONE_WEB.Handlers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Newtonsoft.Json.Linq;

namespace ONE_WEB.Controllers
{
    [Authorize]
    public class ProfileController : BaseController
    {
		private readonly ILogger<ProfileController> _logger;

		public ProfileController(ILogger<ProfileController> logger)
		{
			_logger = logger;
		}

		public IActionResult Index()
        {
            return View();
        }

        public IActionResult Overview()
        {
            return View();
        }
        public IActionResult Setting()
        {
            return View();
        }

		[HttpPost]
		public ActionResult UpdateProfile(string data)
		{
			try
			{
				dynamic? jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(data);
#pragma warning disable CS8602 // Dereference of a possibly null reference.
				jsonObj["Culture"] = GetCultureProvider();
#pragma warning restore CS8602 // Dereference of a possibly null reference.
				jsonObj["Store"] = "profiles_update";
				jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;
				string about = jsonObj["About"];
				var sanitizer = new HtmlSanitizer();
				jsonObj["About"] = sanitizer.Sanitize(about);

				string kq = DAL.GetDataFromAPI(jsonObj);

				dynamic profile = JObject.Parse(kq);
				string fullName = (string)jsonObj["FullName"];

				if ((int)profile.Result > 0 && HttpContext?.User.Identity is ClaimsIdentity identity)
				{
					identity.RemoveClaim(identity.FindFirst(ClaimTypes.Name));
					identity.AddClaim(new Claim(ClaimTypes.Name, fullName ?? ""));
					HttpContext.SignInAsync(
						CookieAuthenticationDefaults.AuthenticationScheme,
						new ClaimsPrincipal(HttpContext.User.Identity));
				}

				return Ok(kq);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, ex.Message);
			}
			return Ok(null);
		}

		public ActionResult GetProfileByUser()
		{
			object data = new
			{
				Store = "profiles_getby",
				UserId = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value
			};

			string kq = DAL.GetDataFromAPI(data);

			return Ok(kq);
		}
	}
}
