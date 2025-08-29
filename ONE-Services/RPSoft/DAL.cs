using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ONE_Services.Handlers;
using ONE_Services.Models;
using ONE_Services.RPSoft.Models;

namespace ONE_Services.RPSoft
{
	public class DAL
	{
		public static string RPSoft_ApiUrl = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["RPSoft_ApiUrl"] ?? "";
		public static string RPSoft_User = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["RPSoft_User"] ?? "";
		public static string RPSoft_Password = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["RPSoft_Password"] ?? "";

		public static string GetRSAPublicKey()
		{

			string result = "";
			using (var client = new HttpClient())
			{
				client.BaseAddress = new Uri(RPSoft_ApiUrl ?? "");

				dynamic data1 = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");
				data1["A"] = "r";

				dynamic data = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

				data["act"] = data1;

				var json = JsonConvert.SerializeObject(data);
				var buffer = System.Text.Encoding.UTF8.GetBytes(json);
				var byteContent = new ByteArrayContent(buffer);

				byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

				var _response = client.PostAsync("S", byteContent).Result;

				if (_response.IsSuccessStatusCode)
				{
					var responseContent = _response.Content;
					result = responseContent.ReadAsStringAsync().Result;
				}
				
				return result;
			}

		}

		public static void Login()
		{
			try
			{
				string input = "123987;" + RPSoft.DAL.RPSoft_User + ";" + RPSoft.DAL.RPSoft_Password;
				var rsaRes = Proxy.S(new ActInf { A = "r" });
				RSAJsonModel rsaParams = JsonConvert.DeserializeObject<RSAJsonModel>(rsaRes.D);
				RSAParameters pair = new RSAParameters
				{
					Exponent = Convert.FromBase64String(rsaParams.Exponent),
					Modulus = Convert.FromBase64String(rsaParams.Modulus)
				};
				byte[] byteArray = Encoding.UTF8.GetBytes(input);
				var loginRes = Proxy.S(new ActInf { A = "l", P = Convert.ToBase64String(Handlers.RSA.RSAEncrypt(new MemoryStream(byteArray), pair).ToArray()) });

				if (loginRes.C != RslCode.Success)
				{
					Utils.logger.LogWarning("RPSoft Login: " + loginRes.D);
				}
			}
			catch (Exception ex)
			{
				Utils.logger.LogError(ex, "{Message}", ex.Message);
			}
		}

		public static List<List<string>> GetStockInfo(string symbol)
		{

			List<List<string>> lsStockInfo = new List<List<string>>();
			try
			{
				var stockInfo = Proxy.S(new ActInf { A = "si", P = symbol });
				if (stockInfo == null)
					return lsStockInfo;

				if (stockInfo.C == RslCode.NotLoggedIn)
				{
					Utils.logger.LogWarning("RPSoft GetStockInfo: " + stockInfo.C);
					Login();
				}
				else if (stockInfo.C == RslCode.Success)
					lsStockInfo = Utils.ParseCSV(stockInfo.D);
				else
					Utils.logger.LogWarning("RPSoft GetStockInfo: " + stockInfo.C);
			}
			catch (Exception ex)
			{
				Utils.logger.LogError(ex, "{Message}", ex.Message);
			}

			return lsStockInfo;
		}

		public static List<List<string>> GetStockData(ref string version)
		{
			List<List<string>> lsStockData = new List<List<string>>();
			try
			{
				var stockData = Proxy.S(new ActInf { A = "s", P = version });
				if (stockData == null)
					return lsStockData;

				if (stockData.C == RslCode.NotLoggedIn)
				{
					Utils.logger.LogWarning("RPSoft GetStockData: " + stockData.C);
					Login();
				}
				else if (stockData.C == RslCode.Success)
				{
					if (!String.IsNullOrEmpty(stockData.D))
					{
						dynamic stockData_D = JObject.Parse(stockData.D);
						version = stockData_D.version;
						if(stockData_D.data != null)
							lsStockData = Utils.ParseCSV((string)stockData_D.data);
					}
				}
				else
					Utils.logger.LogWarning("RPSoft GetStockData: " + stockData.C);
			}
			catch (Exception ex)
			{
				Utils.logger.LogError(ex, "{Message}", ex.Message);
			}

			return lsStockData;
		}

		public static List<List<string>> GetIndexData(ref string version)
		{
			List<List<string>> lsIndexData = new List<List<string>>();

			try
			{
				var indexData = Proxy.S(new ActInf { A = "i", P = version });
				if (indexData == null)
					return lsIndexData;

				if (indexData.C == RslCode.NotLoggedIn)
				{
					Utils.logger.LogWarning("RPSoft GetIndexData: " + indexData.C);
					Login();
				}
				else if (indexData.C == RslCode.Success)
				{
					if (!String.IsNullOrEmpty(indexData.D))
					{
						dynamic indexData_D = JObject.Parse(indexData.D);
						version = indexData_D.version;
						lsIndexData = Utils.ParseCSV((string)indexData_D.data);
					}
				}
				else
					Utils.logger.LogWarning("RPSoft GetIndexData: " + indexData.C);
			}
			catch (Exception ex)
			{
				Utils.logger.LogError(ex, "{Message}", ex.Message);
			}

			return lsIndexData;
		}

		public static List<List<string>> GetEODData(string symbol, string fromDate)
		{
			List<List<string>> lsEODData = new List<List<string>>();

			try
			{
				var eodData = Proxy.S(new ActInf { A = "d", P = "{'symbol': '" + symbol + "' ,'fromDate':'" + fromDate + "'}" });
				if (eodData == null)
					return lsEODData;

				if (eodData.C == RslCode.NotLoggedIn)
				{
					Utils.logger.LogWarning("RPSoft GetEODData: " + eodData.C);
					Login();
				}
				else if (eodData.C == RslCode.Success)
				{
					if (!String.IsNullOrEmpty(eodData.D))
					{
						lsEODData = Utils.ParseCSV((string)eodData.D);
					}
				}
				else
					Utils.logger.LogWarning("RPSoft GetEODData: " + eodData.C);
			}
			catch (Exception ex)
			{
				Utils.logger.LogError(ex, "{Message}", ex.Message);
			}

			return lsEODData;
		}

		public static List<List<string>> GetM1Data(string symbol, string fromDate)
		{
			List<List<string>> lsData = new List<List<string>>();

			try
			{
				var _data = Proxy.S(new ActInf { A = "m", P = "{'symbol': '" + symbol + "' ,'fromDate':'" + fromDate + "'}" });
				if (_data == null)
					return lsData;

				if (_data.C == RslCode.NotLoggedIn)
				{
					Utils.logger.LogWarning("RPSoft GetM1Data: " + _data.C);
					Login();
				}
				else if (_data.C == RslCode.Success)
				{
					if (!String.IsNullOrEmpty(_data.D))
					{
						lsData = Utils.ParseCSV((string)_data.D);
					}
				}
				else
					Utils.logger.LogWarning("RPSoft GetM1Data: " + _data.C);
			}
			catch (Exception ex)
			{
				Utils.logger.LogError(ex, "{Message}", ex.Message);
			}
			
			return lsData;
		}

		public static List<List<string>> GetTickData(string symbol, string fromDate)
		{
			List<List<string>> lsData = new List<List<string>>();
			try
			{
				var _data = Proxy.S(new ActInf { A = "t", P = "{'symbol': '" + symbol + "' ,'fromDate':'" + fromDate + "'}" });
				if (_data == null)
					return lsData;

				if (_data.C == RslCode.NotLoggedIn)
				{
					Utils.logger.LogWarning("RPSoft GetTickData: " + _data.C);
					Login();
				}
				else if (_data.C == RslCode.Success)
				{
					if (!String.IsNullOrEmpty(_data.D))
					{
						lsData = Utils.ParseCSV((string)_data.D);
					}
				}
				else
					Utils.logger.LogWarning("RPSoft GetTickData: " + _data.C);
			}
			catch (Exception ex)
			{
				Utils.logger.LogError(ex, "{Message}", ex.Message);
			}

			return lsData;
		}

		public static void GetEODData_CSV()
		{
			try
			{
				var allFiles = Directory.GetFiles("D:\\Projects\\CungDauTu\\Data\\EOD");
				foreach (var file in allFiles)
				{
					using (var reader = new StreamReader(file))
					{
						
						List<object> lsInput = new List<object>();
						string symbol = "";

						while (!reader.EndOfStream)
						{
							var line = reader.ReadLine();
							var values = line.Split(',');

							if (!line.Contains("SYMBOL"))
							{
								var data = new EODData();

								symbol = (values[0]).Replace("\"", "");
								data.TradingEpochTime = DateTime.ParseExact(values[1], "yyyyMMdd HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
								data.AdjustRate = double.Parse(values[2]);
								data.CeilingPx = double.Parse(values[3]);
								data.FloorPx = double.Parse(values[4]);
								data.RefPx = double.Parse(values[5]);
								data.OpenPx = double.Parse(values[6]);
								data.HighPx = double.Parse(values[7]);
								data.LowPx = double.Parse(values[8]);
								data.ClosePx = double.Parse(values[9]);
								data.Vol = double.Parse(values[10]);
								data.Val = double.Parse(values[11]);
								data.BuyVol = double.Parse(values[12]);
								data.SellVol = double.Parse(values[13]);
								data.ForeignBuyVol = double.Parse(values[14]);
								data.ForeignSellVol = double.Parse(values[15]);
								data.PtVol = double.Parse(values[16]);
								data.PtVal = double.Parse(values[17]);
								data.OpenInterest = double.Parse(values[18]);

								var json = JsonConvert.SerializeObject(data);

								dynamic json2 = JObject.Parse(json);
								json2["Symbol"] = symbol;

								lsInput.Add(json2);

								if (lsInput.Count >= 200)
								{
									dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

									jsonObj["Store"] = "eoddata_update";
									jsonObj["Data"] = JsonConvert.SerializeObject(lsInput);

									string kq = Handlers.DAL.GetDataFromAPI(jsonObj);
									dynamic jsonResult = JObject.Parse(kq);

									if (jsonResult != null && (int)jsonResult.Result != 1)
									{
										Utils.logger.LogError(symbol + ": " + (string)JsonConvert.SerializeObject(jsonObj));
									}

									lsInput.Clear();
								}
							}
						}

						if (lsInput.Count > 0)
						{
							dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

							jsonObj["Store"] = "eoddata_update";
							jsonObj["Data"] = JsonConvert.SerializeObject(lsInput);

							string kq = Handlers.DAL.GetDataFromAPI(jsonObj);
							dynamic jsonResult = JObject.Parse(kq);

							if (jsonResult != null && (int)jsonResult.Result != 1)
							{
								Utils.logger.LogError(symbol + ": " + (string)JsonConvert.SerializeObject(jsonObj));
							}

						}
					}

					File.Delete(file);
				}
			}
			catch (Exception ex)
			{
				Utils.logger.LogError(ex, "{Message}", ex.Message);
			}
		}

		public static void GetM1Data_CSV()
		{
			try
			{
				var allFiles = Directory.GetFiles("D:\\Projects\\CungDauTu\\Data\\1M");
				foreach (var file in allFiles)
				{
					using (var reader = new StreamReader(file))
					{
						List<object> lsInput = new List<object>();
						string symbol = "";

						while (!reader.EndOfStream)
						{
							var line = reader.ReadLine();
							var values = line.Split(',');

							if (!line.Contains("SYMBOL"))
							{
								var data = new M1Data();

								symbol = (values[0]).Replace("\"", "");
								data.TradingDate = DateTime.ParseExact(values[1], "yyyyMMdd HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
								data.TradingEpochTime = (long)Utils.ToEpochTime(data.TradingDate);
								data.OpenPx = double.Parse(values[3]);
								data.HighPx = double.Parse(values[4]);
								data.LowPx = double.Parse(values[5]);
								data.ClosePx = double.Parse(values[6]);
								data.Vol = double.Parse(values[7]);
								data.BuyVol = double.Parse(values[8]);
								data.SellVol = double.Parse(values[9]);

								var json = JsonConvert.SerializeObject(data);
								dynamic json2 = JObject.Parse(json);
								json2["Symbol"] = symbol;

								lsInput.Add(json2);

								if (lsInput.Count >= 200)
								{
									dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

									jsonObj["Store"] = "m1data_update";
									jsonObj["Data"] = JsonConvert.SerializeObject(lsInput);

									string kq = Handlers.DAL.GetDataFromAPI(jsonObj);
									dynamic jsonResult = JObject.Parse(kq);

									if (jsonResult != null && (int)jsonResult.Result != 1)
									{
										Utils.logger.LogError(symbol + ": " + (string)JsonConvert.SerializeObject(jsonObj));
									}

									lsInput.Clear();
								}
							}
						}

						if (lsInput.Count > 0)
						{
							dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

							jsonObj["Store"] = "m1data_update";
							jsonObj["Data"] = JsonConvert.SerializeObject(lsInput);

							string kq = Handlers.DAL.GetDataFromAPI(jsonObj);
							dynamic jsonResult = JObject.Parse(kq);

							if (jsonResult != null && (int)jsonResult.Result != 1)
							{
								Utils.logger.LogError(symbol + ": " + (string)JsonConvert.SerializeObject(jsonObj));
							}

							lsInput.Clear();
						}
					}

					File.Delete(file);
				}
			}
			catch (Exception ex)
			{
				Utils.logger.LogError(ex, "{Message}", ex.Message);
			}
		}

		public static void GetTickData_CSV()
		{
			try
			{
				var allFiles = Directory.GetFiles("D:\\Projects\\CungDauTu\\Data\\1T");
				foreach (var file in allFiles)
				{
					using (var reader = new StreamReader(file))
					{
						List<object> lsInput = new List<object>();
						string symbol = "";

						while (!reader.EndOfStream)
						{
							var line = reader.ReadLine();
							var values = line.Split(',');

							if (!line.Contains("SYMBOL"))
							{
								var data = new TickData();

								symbol = (values[0]).Replace("\"", "");
								data.TradingDate = DateTime.ParseExact(values[1], "yyyyMMdd HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
								data.TradingEpochTime = (long)Utils.ToEpochTime(data.TradingDate);
								data.ClosePx = double.Parse(values[3]);
								data.Vol = double.Parse(values[4]);
								data.Side = values[5].ToString();

								var json = JsonConvert.SerializeObject(data);
								dynamic json2 = JObject.Parse(json);
								json2["Symbol"] = symbol;

								lsInput.Add(json2);

								if (lsInput.Count >= 500)
								{
									dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

									jsonObj["Store"] = "tickdata_update";
									jsonObj["Data"] = JsonConvert.SerializeObject(lsInput);

									string kq = Handlers.DAL.GetDataFromAPI(jsonObj);
									dynamic jsonResult = JObject.Parse(kq);

									if (jsonResult != null && (int)jsonResult.Result != 1)
									{
										Utils.logger.LogError(symbol + ": " + (string)JsonConvert.SerializeObject(jsonObj));
									}

									lsInput.Clear();
								}
							}
						}

						if (lsInput.Count > 0)
						{
							dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

							jsonObj["Store"] = "tickdata_update";
							jsonObj["Data"] = JsonConvert.SerializeObject(lsInput);

							string kq = Handlers.DAL.GetDataFromAPI(jsonObj);
							dynamic jsonResult = JObject.Parse(kq);

							if (jsonResult != null && (int)jsonResult.Result != 1)
							{
								Utils.logger.LogError(symbol + ": " + (string)JsonConvert.SerializeObject(jsonObj));
							}

							lsInput.Clear();
						}
					}

					File.Delete(file);
				}
			}
			catch (Exception ex)
			{
				Utils.logger.LogError(ex, "{Message}", ex.Message);
			}
		}


		public static void SymbolMark(StockData stockData)
		{
			try
			{
				int idxSymMark_1M = Worker.lsSymbolMark_1M.FindIndex(x => x.Code == stockData.Symbol);
				if (idxSymMark_1M >= 0)
				{
					if (Worker.lsSymbolMark_1M[idxSymMark_1M].TotalTradedVol != stockData.TotalTradedVol)
					{
						Worker.lsSymbolMark_1M[idxSymMark_1M].Number = 1;
						Worker.lsSymbolMark_1M[idxSymMark_1M].TotalTradedVol = stockData.TotalTradedVol;
					}
				}
				else
				{
					SymbolMark _symM = new SymbolMark();
					_symM.Code = stockData.Symbol;
					_symM.TotalTradedVol = stockData.TotalTradedVol;
					Worker.lsSymbolMark_1M.Add(_symM);
				}

				int idxSymMark_Tick = Worker.lsSymbolMark_Tick.FindIndex(x => x.Code == stockData.Symbol);
				if (idxSymMark_Tick >= 0)
				{
					if (Worker.lsSymbolMark_Tick[idxSymMark_Tick].TotalTradedVol != stockData.TotalTradedVol)
					{
						Worker.lsSymbolMark_Tick[idxSymMark_Tick].Number = 1;
						Worker.lsSymbolMark_Tick[idxSymMark_Tick].TotalTradedVol = stockData.TotalTradedVol;
					}
				}
				else
				{
					SymbolMark _symM = new SymbolMark();
					_symM.Code = stockData.Symbol;
					_symM.TotalTradedVol = stockData.TotalTradedVol;
					Worker.lsSymbolMark_Tick.Add(_symM);
				}
			}
			catch (Exception ex)
			{
				Utils.logger.LogError(ex, "{Message}", ex.Message);
			}
		}
	}
}
