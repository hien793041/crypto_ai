using System.Security.Claims;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using ONE_WEB.Handlers;

namespace ONE_WEB.Controllers
{
	public class UserController : BaseController
	{
		public IActionResult Index()
		{
			return View();
		}

		[HttpPost]
		public ActionResult GetUsers(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = GetCultureProvider();
			jsonObj["Store"] = "users_getlist";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult UpdateUserStatus(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = GetCultureProvider();
			jsonObj["Store"] = "users_updatestatus";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult SearchUsers(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Store"] = "users_search";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

	}
}
