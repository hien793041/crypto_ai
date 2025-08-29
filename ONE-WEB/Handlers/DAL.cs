using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;
//using Microsoft.VisualBasic;

namespace ONE_WEB.Handlers
{
    public class DAL
    {
        public static string? ApiKey = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["ApiKey"];
        public static string? ApiUrl = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["ApiUrl"];
        public static string GetDataFromAPI(object data)
        {
            string result = "";
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(ApiUrl ?? "");

                //var json = JsonSerializer.Serialize(data);
                //var buffer = System.Text.Encoding.UTF8.GetBytes(json);
                //var byteContent = new ByteArrayContent(buffer);

                var json = JsonConvert.SerializeObject(data);
                var buffer = System.Text.Encoding.UTF8.GetBytes(json);
                var byteContent = new ByteArrayContent(buffer);

                byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                byteContent.Headers.Add("authToken", ApiKey);

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

        //public static string GetSupplierType(string culture)
        //{
        //    string result = "";
        //    try
        //    {
        //        using (var client = new HttpClient())
        //        {
        //            client.BaseAddress = new Uri(BaseUrlData);

        //            object data = new
        //            {
        //                Key = Key,
        //                Culture = culture
        //            };

        //            var json = JsonSerializer.Serialize(data);
        //            var buffer = System.Text.Encoding.UTF8.GetBytes(json);
        //            var byteContent = new ByteArrayContent(buffer);
        //            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

        //            var _response = client.PostAsync("HIS/api/GetSupplierType", byteContent).Result;

        //            if (_response.IsSuccessStatusCode)
        //            {
        //                var responseContent = _response.Content;
        //                result = responseContent.ReadAsStringAsync().Result;
        //            }
        //            else
        //            {
        //                //Utils.logger.Error("DAL CreateConnectionService_Message: " + _response.ReasonPhrase);
        //            }
        //            return result;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        //Utils.logger.Error("CreateConnectionService_Message: " + ex.Message);
        //    }

        //    return result;
        //}
    }
}
