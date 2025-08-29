using Ganss.XSS;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using ONE_WEB.Handlers;
using Microsoft.AspNetCore.Localization;
using ONE_WEB.Common;

namespace ONE_WEB.Controllers
{
	[Authorize]
	public class StockController : BaseController
	{
		private readonly ILogger<StockController> _logger;
		public StockController(ILogger<StockController> logger)
		{
			_logger = logger;
		}

		public IActionResult Index()
		{
			return View();
		}

		public IActionResult Index2()
		{
			return View();
		}

		public IActionResult Recommendations()
		{
			return View();
		}

		[HttpPost]
		public ActionResult SearchStock(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Store"] = "stock_search";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult UpdateRecommendationsPortfolio(string data)
		{
			string? cookieValue = Request.Cookies[".AspNetCore.Culture"];
			string? defaultCulture = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["DefaultCulture"];
			var cultureProvider = CookieRequestCultureProvider.ParseCookieValue(cookieValue ?? "");

			try
			{
				dynamic? jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(data);
#pragma warning disable CS8602 // Dereference of a possibly null reference.
				jsonObj["Culture"] = cultureProvider?.Cultures[0].Value ?? defaultCulture;
#pragma warning restore CS8602 // Dereference of a possibly null reference.
				jsonObj["Store"] = "stock_recommendationsportfolio_update";
				jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;
				
				string kq = DAL.GetDataFromAPI(jsonObj);

				return Ok(kq);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, ex.Message);
			}

			dynamic result = new System.Dynamic.ExpandoObject();
			result.Result = 0;
			result.Message = Resources.MyResources.GetResourceByKey("Error", cultureProvider?.Cultures[0].Value ?? defaultCulture);

			return Ok(result);
		}

		[HttpPost]
		public ActionResult GetRecommendationsPortfolio(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = GetCultureProvider();
			jsonObj["Store"] = "stock_recommendationsportfolio_getlist";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult Chart_GetDataNumberOfShares(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = GetCultureProvider();
			jsonObj["Store"] = "stock_trading_chart_numberofshares";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult Chart_GetActivityByIndustry(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = GetCultureProvider();
			jsonObj["Store"] = "stock_trading_chart_activitybyindustry";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult Chart_GetBubbleByIndustry(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = GetCultureProvider();
			jsonObj["Store"] = "stock_trading_chart_bubblebyindustry";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult Chart_GetDates(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = GetCultureProvider();
			jsonObj["Store"] = "stock_trading_chart_getdates";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult Chart_GetTradingIndex(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = GetCultureProvider();
			jsonObj["Store"] = "stock_trading_chart_index";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult GetStockTradingBy(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = GetCultureProvider();
			jsonObj["Store"] = "stock_trading_getby";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult GetStockTradingIndex(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = GetCultureProvider();
			jsonObj["Store"] = "stock_trading_getstockindex";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult GetAnalysisReport(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Culture"] = GetCultureProvider();
			jsonObj["Store"] = "analysisreport_getby";
			jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult GetStockDataBy(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Store"] = "stockdata_getby";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult GetTickDataBy(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Store"] = "tickdata_getby";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult Chart_BienDongTheoVonHoa(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Store"] = "stock_trading_chart_biendongtheovonhoa";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult Chart_BienDongChiSoNganh(string data)
		{
			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Store"] = "stock_trading_chart_biendongchisonganh";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public async Task<ActionResult> Chart_BienDongThanhKhoan_Test(string data)
		{
			using (var client = new HttpClient())
			{
				client.BaseAddress = new Uri("https://www.highcharts.com/samples/data/activity.json");
				// HTTP GET
				HttpResponseMessage response = await client.GetAsync("");
				if (response.IsSuccessStatusCode)
				{
					var jsonData = await response.Content.ReadAsStringAsync();
					return Ok(jsonData);
				}
			}

			return Ok(null);
		}

		[HttpPost]
		public ActionResult Chart_BienDongThanhKhoan(string data)
		{

			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Store"] = "stock_trading_chart_biendongthanhkhoan";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult Chart_CoPhieuAnhHuong(string data)
		{

			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Store"] = "stock_trading_chart_cophieuanhhuong";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult Chart_HoatDongKhoiNgoai(string data)
		{

			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Store"] = "stock_trading_chart_hoatdongkhoingoai";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult Chart_BanDo(string data)
		{

			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Store"] = "stock_trading_chart_bando";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult Chart_RRG(string data)
		{

			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Store"] = "stock_trading_chart_rrg";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}

		[HttpPost]
		public ActionResult Chart_XuHuong_TangTruong(string data)
		{

			dynamic jsonObj = JObject.Parse(data);
			jsonObj["Store"] = "stock_trading_chart_xuhuong_tangtruong";

			string kq = DAL.GetDataFromAPI(jsonObj);

			return Ok(kq);
		}
	}
}
