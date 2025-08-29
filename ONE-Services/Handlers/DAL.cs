using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ONE_Services.Handlers
{
	public class DAL
	{
		public static string GetDataFromAPI(object data)
		{
			string result = "";
			using (var client = new HttpClient())
			{
				client.BaseAddress = new Uri(Common.AppSetting.ApiUrl ?? "");

				var json = JsonConvert.SerializeObject(data);
				var buffer = System.Text.Encoding.UTF8.GetBytes(json);
				var byteContent = new ByteArrayContent(buffer);

				byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
				byteContent.Headers.Add("authToken", Common.AppSetting.ApiKey);

				var _response = client.PostAsync("ONE/api/GetDataFromPostgreSQL", byteContent).Result;

				if (_response.IsSuccessStatusCode)
				{
					var responseContent = _response.Content;
					result = responseContent.ReadAsStringAsync().Result;
				}
				else
				{
					//Utils.logger.Error("DAL CreateConnectionService_Message: " + _response.ReasonPhrase);
				}
				return result;
			}

		}
	}
}
