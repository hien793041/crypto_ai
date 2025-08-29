using ONE_WEB.Handlers;
using ONE_WEB.Resources;
using System.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONE_WEB.RouteLocalization;
using System.Security.Claims;
using Ganss.XSS;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ONE_WEB.Controllers
{
	[Authorize]
	public class ArticleController : BaseController
	{
		public IActionResult Topic()
		{
			return View();
		}

		public IActionResult TopicView()
		{
			return View();
		}

		[HttpPost]
		public ActionResult UpdateTopic(string data)
		{
			string? cookieValue = Request.Cookies[".AspNetCore.Culture"];
			string? defaultCulture = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["DefaultCulture"];
			var cultureProvider = CookieRequestCultureProvider.ParseCookieValue(cookieValue ?? "");

			dynamic? jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(data);
#pragma warning disable CS8602 // Dereference of a possibly null reference.
			jsonObj["Culture"] = cultureProvider?.Cultures[0].Value ?? defaultCulture;
#pragma warning restore CS8602 // Dereference of a possibly null reference.
			jsonObj["Store"] = "categories_update";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;
			string description = jsonObj["Description"];

			//var sanitizer = new HtmlSanitizer();
			//jsonObj["Description"] = sanitizer.Sanitize(description);

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult UpdateArticle(string data)
		{
			string? cookieValue = Request.Cookies[".AspNetCore.Culture"];
			string? defaultCulture = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["DefaultCulture"];
			var cultureProvider = CookieRequestCultureProvider.ParseCookieValue(cookieValue ?? "");

			dynamic? jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(data);
#pragma warning disable CS8602 // Dereference of a possibly null reference.
			jsonObj["Culture"] = cultureProvider?.Cultures[0].Value ?? defaultCulture;
#pragma warning restore CS8602 // Dereference of a possibly null reference.
			jsonObj["Store"] = "articles_update";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;
			string content = jsonObj["Content"];

			//var sanitizer = new HtmlSanitizer();
			//jsonObj["Content"] = sanitizer.Sanitize(content);

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult GetTopics(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = GetCultureProvider();
			jsonObj["Store"] = "categories_getlist";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult GetArticles(string data)
		{
			string? cookieValue = Request.Cookies[".AspNetCore.Culture"];
			var cultureProvider = CookieRequestCultureProvider.ParseCookieValue(cookieValue ?? "");

			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = cultureProvider?.Cultures[0].Value;
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;
			jsonObj["Store"] = "articles_getlist";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult GetTopicBy(string data)
		{
			string? cookieValue = Request.Cookies[".AspNetCore.Culture"];
			string? defaultCulture = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["DefaultCulture"];
			var cultureProvider = CookieRequestCultureProvider.ParseCookieValue(cookieValue ?? "");

			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = cultureProvider?.Cultures[0].Value ?? defaultCulture;
			jsonObj["Store"] = "categories_getby";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult GetArticleBy(string data)
		{
			string? cookieValue = Request.Cookies[".AspNetCore.Culture"];
			string? defaultCulture = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["DefaultCulture"];
			var cultureProvider = CookieRequestCultureProvider.ParseCookieValue(cookieValue ?? "");

			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = cultureProvider?.Cultures[0].Value ?? defaultCulture;
			jsonObj["Store"] = "articles_getby";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}


		[AllowAnonymous]
		[HttpPost]
		public ActionResult GetPublicTopics(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = GetCultureProvider();
			jsonObj["Store"] = "front_categories_getlist";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[AllowAnonymous]
		[HttpPost]
		public ActionResult GetPublicArticles(string data)
		{
			string? cookieValue = Request.Cookies[".AspNetCore.Culture"];
			var cultureProvider = CookieRequestCultureProvider.ParseCookieValue(cookieValue ?? "");

			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = cultureProvider?.Cultures[0].Value;
			jsonObj["Store"] = "articles_public_getlist";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[AllowAnonymous]
		[HttpPost]
		public ActionResult GetPublicArticleBy(string data)
		{
			string? cookieValue = Request.Cookies[".AspNetCore.Culture"];
			string? defaultCulture = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["DefaultCulture"];
			var cultureProvider = CookieRequestCultureProvider.ParseCookieValue(cookieValue ?? "");

			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = cultureProvider?.Cultures[0].Value ?? defaultCulture;
			jsonObj["Store"] = "front_articles_getby";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult DeleteArticleBy(string data)
		{
			string? cookieValue = Request.Cookies[".AspNetCore.Culture"];
			string? defaultCulture = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["DefaultCulture"];
			var cultureProvider = CookieRequestCultureProvider.ParseCookieValue(cookieValue ?? "");

			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = cultureProvider?.Cultures[0].Value ?? defaultCulture;
			jsonObj["Store"] = "articles_delete";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult UpdateMemo(string data)
		{
			string? cookieValue = Request.Cookies[".AspNetCore.Culture"];
			string? defaultCulture = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["DefaultCulture"];
			var cultureProvider = CookieRequestCultureProvider.ParseCookieValue(cookieValue ?? "");

			dynamic? jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(data);
#pragma warning disable CS8602 // Dereference of a possibly null reference.
			jsonObj["Culture"] = cultureProvider?.Cultures[0].Value ?? defaultCulture;
#pragma warning restore CS8602 // Dereference of a possibly null reference.
			jsonObj["Store"] = "memo_update";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;
			string content = jsonObj["Content"];

			//var sanitizer = new HtmlSanitizer();
			//jsonObj["Content"] = sanitizer.Sanitize(content);

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult GetMemoBy(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = GetCultureProvider();
			jsonObj["Store"] = "memo_getby";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}
	}
}
