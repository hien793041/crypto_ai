using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using ONE_Services.RPSoft.Models;

namespace ONE_Services.RPSoft
{
	static class Proxy
	{
		public static SResult S(ActInf act)
		{
			try
			{
				HttpWebRequest request = _CreateRequest("S");

				using (var writer = new StreamWriter(request.GetRequestStream()))
				{
					JObject jsonrequest = new JObject
					{
						["act"] = JToken.FromObject(act)
					};
					writer.Write(jsonrequest.ToString());
				}

				using (WebResponse response = request.GetResponse())
				using (Stream responseStream = response.GetResponseStream())
				using (StreamReader reader = new StreamReader(responseStream, Encoding.UTF8))
				{
					string data = reader.ReadToEnd();
					return JsonConvert.DeserializeObject<ActRsl>(data).SResult;
				}
			}
			catch
			{
				return null;
			}
		}

		static CookieContainer _cookies = new CookieContainer();
		static HttpWebRequest _CreateRequest(string verb)
		{
			HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(DAL.RPSoft_ApiUrl + verb));
			request.CookieContainer = _cookies;
			request.Method = "POST";
			request.ContentType = "application/json; charset=utf-8";
			request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;
			return request;
		}

	}
}
