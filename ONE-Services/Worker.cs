using Newtonsoft.Json;
using System.Xml.Linq;
using ONE_Services.Handlers;
using Newtonsoft.Json.Linq;
using System.Security.Cryptography;
using System.Text;
using Microsoft.VisualBasic;
using Microsoft.Extensions.Primitives;
using ONE_Services.RPSoft.Models;
using ONE_Services.RPSoft;
using System.ComponentModel;
using System.Diagnostics;
using ONE_Services.Models;
using System.Collections.Generic;
using System.Reflection;
using ONE_Services.Common;

namespace ONE_Services
{
	public class Worker : BackgroundService
	{
		private readonly ILogger<Worker> _logger;
		bool FlagRun = true;

		public static List<SymbolMark> lsSymbolMark_1M = new List<SymbolMark>();
		public static List<SymbolMark> lsSymbolMark_Tick = new List<SymbolMark>();

		public static DateTime DateStarted_GetStockInfo;
		public static DateTime DateStarted_GetEODData;
		public static DateTime DateRunBeginDay;
		public static DateTime DateRunEndDay;

		BackgroundWorker bgw_StockInfo = new BackgroundWorker();
		BackgroundWorker bgw_StockData = new BackgroundWorker();
		BackgroundWorker bgw_IndexData = new BackgroundWorker();
		BackgroundWorker bgw_EODData = new BackgroundWorker();
		BackgroundWorker bgw_M1Data = new BackgroundWorker();
		BackgroundWorker bgw_TickData = new BackgroundWorker();
		BackgroundWorker bgw_RunDaily = new BackgroundWorker();

		public Worker(ILogger<Worker> logger)
		{
			_logger = logger;
		}

		protected override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			try
			{
				Utils.ConfigureLogger(_logger);

				//RPSoft.DAL.Login();
				//string fromDate = "0";

				//List<List<string>> lsEODData = RPSoft.DAL.GetEODData("VNM", fromDate);

				//for (int i = 0; i < 7000; i++)
				//{
				//	dynamic inputStockUpdate = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

				//	inputStockUpdate["Store"] = "run_end_day";

				//	string kqStockUpdate = Handlers.DAL.GetDataFromAPI(inputStockUpdate);
				//}

				//string ret = "";

				//RPSoft.DAL.Login();

				//RPSoft.DAL.GetEODData_CSV();
				//RPSoft.DAL.GetM1Data_CSV();
				//RPSoft.DAL.GetTickData_CSV();

				//Process_StockInfo();
				//Process_StockData();
				//Process_IndexData();
				//Process_EODData();
				//Process_M1Data();
				//Process_TickData();

				bgw_StockInfo.DoWork += Bgw_StockInfo_DoWork;
				bgw_StockInfo.RunWorkerAsync();

				bgw_StockData.DoWork += Bgw_StockData_DoWork;
				bgw_StockData.RunWorkerAsync();

				bgw_IndexData.DoWork += Bgw_IndexData_DoWork;
				bgw_IndexData.RunWorkerAsync();

				bgw_EODData.DoWork += Bgw_EODData_DoWork;
				bgw_EODData.RunWorkerAsync();

				bgw_M1Data.DoWork += Bgw_M1Data_DoWork;
				bgw_M1Data.RunWorkerAsync();

				bgw_TickData.DoWork += Bgw_TickData_DoWork;
				bgw_TickData.RunWorkerAsync();

				bgw_RunDaily.DoWork += Bgw_RunDaily_DoWork;
				bgw_RunDaily.RunWorkerAsync();

				/////////////////////

				//string _strpublicKey = RPSoft.DAL.GetRSAPublicKey();

				//dynamic _publicKey = JObject.Parse(_strpublicKey);

				//string _strd = _publicKey.SResult.D;

				//dynamic _d = JObject.Parse(_strd);

				//string exponent = _d.Exponent;
				//string modulus = _d.Modulus;

				////RSAParameters rSAParameters = new RSAParameters();
				////rSAParameters.Exponent = Encoding.Unicode.GetBytes(exponent);
				////rSAParameters.Modulus = Encoding.Unicode.GetBytes(modulus);

				////exponent = "AQAB";
				////modulus = "lLrLPJ6c+HkfVgkCTOY7iuGSF1hwzN7tBxaxJzfpgcnFguz0pWWDr9bYis2LL+8JY9xsjMWhkAOSwXN/MuDBUxUDbr0ec6UKtnmUbhgfaYb1VhmDX482mZglkByKaDEC28OYhgyAr10H6xBUkMDB2G9iNgbCQl+4z84TaqY0Du0=";

				////RSACryptoServiceProvider csp = new RSACryptoServiceProvider();
				////RSAParameters priKey = csp.ExportParameters(true);
				////RSAParameters pubKey = csp.ExportParameters(false);

				//RSAParameters pubKey = new RSAParameters
				//{
				//	Modulus = Convert.FromBase64String(modulus),
				//	Exponent = Convert.FromBase64String(exponent)
				//};

				////RSAParameters pairs = JsonConvert.DeserializeObject<RSAParameters>(_strd);

				//string text = "123456;cungdautu;Cungdautu2025";

				//byte[] byteArray2 = Encoding.UTF8.GetBytes(text);
				//string ret2 = Encoding.UTF8.GetString(byteArray2);

				//MemoryStream stream = new MemoryStream(byteArray2);

				//MemoryStream streamEnOutPut = Handlers.RSA.RSAEncrypt(stream, pubKey);
				//string retEn = Convert.ToBase64String(streamEnOutPut.ToArray());

				//exponent = "AQAB";
				//modulus = "lLrLPJ6c+HkfVgkCTOY7iuGSF1hwzN7tBxaxJzfpgcnFguz0pWWDr9bYis2LL+8JY9xsjMWhkAOSwXN/MuDBUxUDbr0ec6UKtnmUbhgfaYb1VhmDX482mZglkByKaDEC28OYhgyAr10H6xBUkMDB2G9iNgbCQl+4z84TaqY0Du0=";

				//RSAParameters priKey = new RSAParameters
				//{
				//	Modulus = Encoding.Unicode.GetBytes(modulus),
				//	Exponent = Encoding.Unicode.GetBytes(exponent)
				//};

				//MemoryStream streamDeOutPut = Handlers.RSA.RSADecrypt(streamEnOutPut, priKey);

				//string ret = Encoding.Unicode.GetString(streamDeOutPut.ToArray());

			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "{Message}", ex.Message);
			}
			//while (!stoppingToken.IsCancellationRequested)
			//{
			//	_logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
			//	await Task.Delay(1000, stoppingToken);
			//}
		}

		private void Bgw_RunDaily_DoWork(object? sender, DoWorkEventArgs e)
		{
			Process_RunDaily();
		}

		private void Bgw_TickData_DoWork(object? sender, DoWorkEventArgs e)
		{
			Process_TickData();
		}

		private void Bgw_M1Data_DoWork(object? sender, DoWorkEventArgs e)
		{
			Process_M1Data();
		}

		private void Bgw_EODData_DoWork(object? sender, DoWorkEventArgs e)
		{
			Process_EODData();
		}

		private void Bgw_IndexData_DoWork(object? sender, DoWorkEventArgs e)
		{
			Process_IndexData();
		}

		private void Bgw_StockData_DoWork(object? sender, DoWorkEventArgs e)
		{
			Process_StockData();
		}

		public override async Task StopAsync(CancellationToken cancellationToken)
		{
			try
			{
				FlagRun = false;
				bgw_StockInfo?.Dispose();
				bgw_StockData?.Dispose();
				bgw_IndexData?.Dispose();
				bgw_EODData?.Dispose();
				bgw_M1Data?.Dispose();
				bgw_TickData?.Dispose();
				bgw_RunDaily?.Dispose();

				_logger.LogInformation("Worker stopped at: {time}", DateTimeOffset.Now);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "{Message}", ex.Message);
			}

		}

		private void Bgw_StockInfo_DoWork(object? sender, DoWorkEventArgs e)
		{
			RPSoft.DAL.Login();

			Process_StockInfo();
		}

		private void Process_RunDaily()
		{
			while (FlagRun)
			{
				try
				{
					if (Utils.CheckTimeTrading())
					{
						dynamic inputStockUpdate = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

						inputStockUpdate["Store"] = "m1data_delete_tohistory";
						string kqStockUpdate = Handlers.DAL.GetDataFromAPI(inputStockUpdate);

						inputStockUpdate["Store"] = "m1data_week_update";
						kqStockUpdate = Handlers.DAL.GetDataFromAPI(inputStockUpdate);

						inputStockUpdate["Store"] = "tickdata_delete_tohistory";
						kqStockUpdate = Handlers.DAL.GetDataFromAPI(inputStockUpdate);

						inputStockUpdate["Store"] = "stockdata_delete_tohistory";
						kqStockUpdate = Handlers.DAL.GetDataFromAPI(inputStockUpdate);
					}

					//if (DateTime.Now.DayOfWeek != DayOfWeek.Saturday && DateTime.Now.DayOfWeek != DayOfWeek.Sunday)
					//{
					//	DateTime dtNow = DateTime.Now;
					//	if ((dtNow - DateRunBeginDay).Days > 0 && (dtNow.Hour * 60 + dtNow.Minute) >= AppSetting.StartTime1)
					//	{
					//		DateRunBeginDay = DateTime.Now;
					//		dynamic inputStockUpdate = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

					//		inputStockUpdate["Store"] = "run_begin_day";

					//		string kqStockUpdate = Handlers.DAL.GetDataFromAPI(inputStockUpdate);
					//	}
					//}

					//if (Utils.CheckTimeTrading())
					//{
					//	dynamic inputStockUpdate = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

					//	inputStockUpdate["Store"] = "stock_trading_realtime_calculation_sma_ema";

					//	string kqStockUpdate = Handlers.DAL.GetDataFromAPI(inputStockUpdate);
					//}


					//if (DateTime.Now.DayOfWeek != DayOfWeek.Saturday && DateTime.Now.DayOfWeek != DayOfWeek.Sunday)
					//{
					//	DateTime dtNow = DateTime.Now;
					//	if ((dtNow - DateRunEndDay).Days > 0 && (dtNow.Hour * 60 + dtNow.Minute) >= AppSetting.EndTime2 + 15)
					//	{
					//		DateRunBeginDay = DateTime.Now;
					//		//for (int i = 0; i < 7000; i++)
					//		{
					//			dynamic inputStockUpdate = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

					//			inputStockUpdate["Store"] = "run_end_day";

					//			string kqStockUpdate = Handlers.DAL.GetDataFromAPI(inputStockUpdate);
					//		}
					//	}
					//}
				}
				catch (Exception ex)
				{
					_logger.LogError(ex, "{Message}", ex.Message);
				}

				Thread.Sleep(1000 * 60 * 5); // 5 minute
			}
		}
		private void Process_StockInfo()
		{
			List<SymbolMark> lsErrorMark = new List<SymbolMark>();

			while (FlagRun)
			{
				try
				{
					if (DateTime.Now.DayOfWeek != DayOfWeek.Saturday && DateTime.Now.DayOfWeek != DayOfWeek.Sunday)
					{
						DateTime dtNow = DateTime.Now;
						int isUpdate = 1;
						if ((dtNow - DateStarted_GetStockInfo).Days > 0 && (dtNow.Hour * 60 + dtNow.Minute) >= AppSetting.EndTime2 + 15)
						{
							DateStarted_GetStockInfo = DateTime.Now;
							isUpdate = -1; // Get All
						}

						dynamic inputStockUpdate = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

						inputStockUpdate["Store"] = "stock_getlisttoupdate";
						inputStockUpdate["IsUpdate"] = isUpdate;

						string kqStockUpdate = Handlers.DAL.GetDataFromAPI(inputStockUpdate);
						dynamic jsonStockUpdate = JsonConvert.DeserializeObject(kqStockUpdate);
						if (jsonStockUpdate != null && jsonStockUpdate?.Count > 0)
						{
							for (int l = 0; l < jsonStockUpdate?.Count; l++)
							{
								string symbol = jsonStockUpdate[l].Code;
								List<List<string>> lsStockInfo = RPSoft.DAL.GetStockInfo(symbol);

								if (lsStockInfo != null)
								{
									var stockInfo = new StockInfo();
									for (int i = 0; i < lsStockInfo.Count; i++)
									{
										for (int k = 0; k < lsStockInfo[i].Count; k++)
										{
											stockInfo.UpdateProperty(lsStockInfo[i][k], (enStockInfo)k);
										}

										var json = JsonConvert.SerializeObject(stockInfo);

										dynamic jsonObj = JObject.Parse(json);
										jsonObj["Store"] = "stock_update";
										jsonObj["Code"] = symbol;

										string kq = Handlers.DAL.GetDataFromAPI(jsonObj);

										dynamic jsonResult = JObject.Parse(kq);
										if (jsonResult != null && (int)jsonResult.Result != 1)
										{
											_logger.LogError(symbol + ": " + (string)JsonConvert.SerializeObject(jsonObj));
										}
									}
								}
								else
								{
									int idxErrorMark = lsErrorMark.FindIndex(x => x.Code == symbol);
									if (idxErrorMark >= 0)
									{
										lsErrorMark[idxErrorMark].Number++;
										if (lsErrorMark[idxErrorMark].Number >= 3)
										{
											_logger.LogWarning("StockInfo - Error GetStockInfo - Symbol: " + symbol);

											dynamic inputEM = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

											inputEM["Store"] = "stock_update_isupdate";
											inputEM["Symbol"] = symbol;

											string kqinputEM = Handlers.DAL.GetDataFromAPI(inputEM);

											lsErrorMark.RemoveAt(idxErrorMark);
										}
									}
									else
									{
										SymbolMark _errM = new SymbolMark();
										_errM.Code = symbol;
										lsErrorMark.Add(_errM);
									}
								}
							}
						}
					}
				}
				catch (Exception ex)
				{
					_logger.LogError(ex, "{Message}", ex.Message);
				}

				Thread.Sleep(1000 * 60 * 2); // 2 minute
			}
		}

		private void Process_StockData()
		{
			string version = "0";

			while (FlagRun)
			{
				try
				{
					if (Utils.CheckTimeTrading())
					{
						List<List<string>> lsStockData = RPSoft.DAL.GetStockData(ref version);

						if (lsStockData != null && lsStockData.Count > 0)
						{
							List<object> lsInput = new List<object>();

							for (int i = 0; i < lsStockData.Count; i++)
							{
								var stockData = new StockData();
								for (int k = 0; k < lsStockData[i].Count; k++)
								{
									stockData.UpdateProperty(lsStockData[i][k], (enStockData)k);
								}

								if(stockData.TotalTradedVol > 0)
								{
									RPSoft.DAL.SymbolMark(stockData);
								}

								lsInput.Add(stockData);

								if (lsInput.Count >= 100)
								{
									dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

									jsonObj["Store"] = "stockdata_update";
									jsonObj["Data"] = JsonConvert.SerializeObject(lsInput);
									jsonObj["Version"] = version;

									string kq = Handlers.DAL.GetDataFromAPI(jsonObj);
									dynamic jsonResult = JObject.Parse(kq);

									if (jsonResult != null && (int)jsonResult.Result != 1)
									{
										_logger.LogError(version + ": " + (string)JsonConvert.SerializeObject(jsonObj));
									}

									lsInput.Clear();
								}

							}

							if (lsInput.Count > 0)
							{
								dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

								jsonObj["Store"] = "stockdata_update";
								jsonObj["Data"] = JsonConvert.SerializeObject(lsInput);
								jsonObj["Version"] = version;

								string kq = Handlers.DAL.GetDataFromAPI(jsonObj);
								dynamic jsonResult = JObject.Parse(kq);

								if (jsonResult != null && (int)jsonResult.Result != 1)
								{
									_logger.LogError(version + ": " + (string)JsonConvert.SerializeObject(jsonObj));
								}
							}
						}
					}
					
				}
				catch (Exception ex)
				{
					_logger.LogError(ex, "{Message}", ex.Message);
				}

				Thread.Sleep(1000 * 2); // 2 second
			}
		}

		private void Process_IndexData()
		{
			string version = "0";

			while (FlagRun)
			{
				try
				{
					if (Utils.CheckTimeTrading())
					{
						List<List<string>> lsIndexData = RPSoft.DAL.GetIndexData(ref version);

						if (lsIndexData != null && lsIndexData.Count > 0)
						{
							List<object> lsInput = new List<object>();
							for (int i = 0; i < lsIndexData.Count; i++)
							{
								var indexData = new IndexData();
								for (int k = 0; k < lsIndexData[i].Count; k++)
								{
									indexData.UpdateProperty(lsIndexData[i][k], (enIndexData)k);
								}

								lsInput.Add(indexData);

								if (lsInput.Count >= 100)
								{
									dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

									jsonObj["Store"] = "indexdata_update";
									jsonObj["Data"] = JsonConvert.SerializeObject(lsInput);
									jsonObj["Version"] = version;

									string kq = Handlers.DAL.GetDataFromAPI(jsonObj);
									dynamic jsonResult = JObject.Parse(kq);

									if (jsonResult != null && (int)jsonResult.Result != 1)
									{
										_logger.LogError(version + ": " + (string)JsonConvert.SerializeObject(jsonObj));
									}

									lsInput.Clear();
								}
							}

							if (lsInput.Count > 0)
							{
								dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

								jsonObj["Store"] = "indexdata_update";
								jsonObj["Data"] = JsonConvert.SerializeObject(lsInput);
								jsonObj["Version"] = version;

								string kq = Handlers.DAL.GetDataFromAPI(jsonObj);
								dynamic jsonResult = JObject.Parse(kq);

								if (jsonResult != null && (int)jsonResult.Result != 1)
								{
									_logger.LogError(version + ": " + (string)JsonConvert.SerializeObject(jsonObj));
								}
							}
						}
					}
					
				}
				catch (Exception ex)
				{
					_logger.LogError(ex, "{Message}", ex.Message);
				}

				Thread.Sleep(1000 * 2); // 2 second
			}
		}

		private void Process_EODData()
		{
			string symbol = "", fromDate = "0";
			dynamic? jsonStockUpdate = null;

			while (FlagRun)
			{
				try
				{
					DateTime dtNow = DateTime.Now;
					int minuteNow = dtNow.Hour * 60 + dtNow.Minute;

					if (DateTime.Now.DayOfWeek != DayOfWeek.Saturday && DateTime.Now.DayOfWeek != DayOfWeek.Sunday)
					{
						//if ((dtNow - DateStarted_GetEODData).Days > 0 && minuteNow >= AppSetting.EndTime2)
						if (Utils.CheckTimeTrading())
						{
							//DateStarted_GetEODData = DateTime.Now;

							//if (jsonStockUpdate == null)
							{
								dynamic? inputStockUpdate = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

								inputStockUpdate["Store"] = "stock_getlisteod";
								string kqStockUpdate = Handlers.DAL.GetDataFromAPI(inputStockUpdate);
								jsonStockUpdate = JsonConvert.DeserializeObject(kqStockUpdate);
							}

							if (jsonStockUpdate != null && jsonStockUpdate?.Count > 0)
							{
								for (int l = 0; l < jsonStockUpdate?.Count; l++)
								{
									symbol = jsonStockUpdate[l].Code;
									string _date = jsonStockUpdate[l].TradingDate;
									fromDate = "0";
									if (!String.IsNullOrEmpty(_date))
									{
										DateTime _tradingdate = DateTime.ParseExact(_date, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
										fromDate = Utils.ToEpochTime(_tradingdate).ToString();
									}


									List<List<string>> lsEODData = RPSoft.DAL.GetEODData(symbol, fromDate);

									if (lsEODData != null && lsEODData.Count > 0)
									{
										List<object> lsInput = new List<object>();
										for (int i = 0; i < lsEODData.Count; i++)
										{
											var eodData = new EODData();
											for (int k = 0; k < lsEODData[i].Count; k++)
											{
												eodData.UpdateProperty(lsEODData[i][k], (enEODData)k);
											}

											jsonStockUpdate[l].TradingDate = eodData.TradingEpochTime.ToString("yyyy-MM-dd");

											var json = JsonConvert.SerializeObject(eodData);

											dynamic json2 = JObject.Parse(json);
											json2["Symbol"] = symbol;

											lsInput.Add(json2);

											if (lsInput.Count >= 100)
											{
												dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

												jsonObj["Store"] = "eoddata_update";
												jsonObj["Data"] = JsonConvert.SerializeObject(lsInput);

												string kq = Handlers.DAL.GetDataFromAPI(jsonObj);
												dynamic jsonResult = JObject.Parse(kq);

												if (jsonResult != null && (int)jsonResult.Result != 1)
												{
													_logger.LogError(fromDate + ": " + (string)JsonConvert.SerializeObject(jsonObj));
												}

												lsInput.Clear();
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
												_logger.LogError(fromDate + ": " + (string)JsonConvert.SerializeObject(jsonObj));
											}

										}
									}
								}
							}
						}
					}
				}
				catch (Exception ex)
				{
					_logger.LogError(ex, "{Message}", ex.Message);
				}

				Thread.Sleep(1000 * 2); // 2 second
			}
		}

		private void Process_M1Data()
		{
			string symbol = "", fromDate = "0";
			dynamic? jsonStockUpdate = null;
			int numberOfStock = 1, numberOfNoData = 0;
			List<string> lsStockNoData = new List<string>();

			while (FlagRun)
			{
				try
				{
					if (Utils.CheckTimeTrading() || numberOfStock != numberOfNoData)
					{
						if (Utils.CheckTimeTrading())
							lsStockNoData.Clear();

						if (jsonStockUpdate == null)
						{
							dynamic? inputStockUpdate = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

							inputStockUpdate["Store"] = "stock_getlistm1";
							string kqStockUpdate = Handlers.DAL.GetDataFromAPI(inputStockUpdate);
							jsonStockUpdate = JsonConvert.DeserializeObject(kqStockUpdate);
						}

						if (jsonStockUpdate != null && jsonStockUpdate?.Count > 0)
						{
							numberOfStock = jsonStockUpdate?.Count;
							numberOfNoData = 0;

							for (int l = 0; l < jsonStockUpdate?.Count; l++)
							{
								symbol = jsonStockUpdate[l].Code;

								string _date = jsonStockUpdate[l].TradingEpochTime;
								fromDate = "0";
								if (!String.IsNullOrEmpty(_date))
								{
									fromDate = _date;
								}

								if (!Utils.CheckTimeTrading())
								{
									if (lsStockNoData.FindIndex(x => x == symbol) >= 0)
									{
										numberOfNoData++;
										continue;
									}

								}

								List<List<string>> m1Data = new List<List<string>>();

								int idxSymMark = lsSymbolMark_1M.FindIndex(x => x.Code == symbol && x.Number == 1);
								if (idxSymMark >= 0)
									m1Data = RPSoft.DAL.GetM1Data(symbol, fromDate);

								if (m1Data != null)
								{
									List<object> lsInput = new List<object>();

									if (m1Data.Count == 0)
									{
										numberOfNoData++;
										if (!Utils.CheckTimeTrading())
											lsStockNoData.Add(symbol);
									}

									for (int i = 0; i < m1Data.Count; i++)
									{
										var _data = new M1Data();
										for (int k = 0; k < m1Data[i].Count; k++)
										{
											_data.UpdateProperty(m1Data[i][k], (enM1Data)k);
										}

										if (i == m1Data.Count - 1 && _data.TradingEpochTime.ToString() == fromDate)
										{
											numberOfNoData++;

											if (idxSymMark >= 0)
												lsSymbolMark_1M[idxSymMark].Number = 0;

											if (!Utils.CheckTimeTrading())
												lsStockNoData.Add(symbol);
											continue;
										}

										jsonStockUpdate[l].TradingEpochTime = _data.TradingEpochTime;

										var json = JsonConvert.SerializeObject(_data);
										dynamic json2 = JObject.Parse(json);
										json2["Symbol"] = symbol;

										lsInput.Add(json2);

										if (lsInput.Count >= 100)
										{
											dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

											jsonObj["Store"] = "m1data_update";
											jsonObj["Data"] = JsonConvert.SerializeObject(lsInput);

											string kq = Handlers.DAL.GetDataFromAPI(jsonObj);
											dynamic jsonResult = JObject.Parse(kq);

											if (jsonResult != null && (int)jsonResult.Result != 1)
											{
												_logger.LogError(fromDate + ": " + (string)JsonConvert.SerializeObject(jsonObj));
											}

											lsInput.Clear();
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
											_logger.LogError(fromDate + ": " + (string)JsonConvert.SerializeObject(jsonObj));
										}

									}
								}
							}
						}
					}
					
				}
				catch (Exception ex)
				{
					_logger.LogError(ex, "{Message}", ex.Message);
				}

				Thread.Sleep(1000 * 2); // 2 second
			}
		}

		private void Process_TickData()
		{
			string symbol = "", fromDate = "0";
			dynamic? jsonStockUpdate = null;
			int numberOfStock = 1, numberOfNoData = 0;
			List<string> lsStockNoData = new List<string>();
			while (FlagRun)
			{
				try
				{
					if (Utils.CheckTimeTrading() || numberOfStock != numberOfNoData)
					{
						if (Utils.CheckTimeTrading())
							lsStockNoData.Clear();

						if (jsonStockUpdate == null)
						{
							dynamic? inputStockUpdate = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

							inputStockUpdate["Store"] = "stock_getlisttick";
							string kqStockUpdate = Handlers.DAL.GetDataFromAPI(inputStockUpdate);
							jsonStockUpdate = JsonConvert.DeserializeObject(kqStockUpdate);
						}

						if (jsonStockUpdate != null && jsonStockUpdate?.Count > 0)
						{
							numberOfStock = jsonStockUpdate?.Count;
							numberOfNoData = 0;

							for (int l = 0; l < jsonStockUpdate?.Count; l++)
							{
								symbol = jsonStockUpdate[l].Code;
								string _date = jsonStockUpdate[l].TradingEpochTime;
								fromDate = "0";
								if (!String.IsNullOrEmpty(_date))
								{
									fromDate = _date;
								}

								if (!Utils.CheckTimeTrading())
								{
									if (lsStockNoData.FindIndex(x => x == symbol) >= 0)
									{
										numberOfNoData++;
										continue;
									}
										
								}

								List<List<string>> tickData = new List<List<string>>();

								int idxSymMark = lsSymbolMark_Tick.FindIndex(x => x.Code == symbol && x.Number == 1);
								if (idxSymMark >= 0)
									tickData = RPSoft.DAL.GetTickData(symbol, fromDate);

								if (tickData != null)
								{
									List<object> lsInput = new List<object>();

									if (tickData.Count == 0)
									{
										numberOfNoData++;
										if (!Utils.CheckTimeTrading())
											lsStockNoData.Add(symbol);
									}

									for (int i = 0; i < tickData.Count; i++)
									{
										var _data = new TickData();
										for (int k = 0; k < tickData[i].Count; k++)
										{
											_data.UpdateProperty(tickData[i][k], (enTickData)k);
										}

										if (i == tickData.Count - 1 && _data.TradingEpochTime.ToString() == fromDate)
										{
											numberOfNoData++;

											if (idxSymMark >= 0)
												lsSymbolMark_Tick[idxSymMark].Number = 0;

											if (!Utils.CheckTimeTrading())
												lsStockNoData.Add(symbol);
											continue;
										}	

										jsonStockUpdate[l].TradingEpochTime = _data.TradingEpochTime;

										var json = JsonConvert.SerializeObject(_data);
										dynamic json2 = JObject.Parse(json);
										json2["Symbol"] = symbol;

										lsInput.Add(json2);

										if (lsInput.Count >= 100)
										{
											dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject("{}");

											jsonObj["Store"] = "tickdata_update";
											jsonObj["Data"] = JsonConvert.SerializeObject(lsInput);

											string kq = Handlers.DAL.GetDataFromAPI(jsonObj);
											dynamic jsonResult = JObject.Parse(kq);

											if (jsonResult != null && (int)jsonResult.Result != 1)
											{
												_logger.LogError(fromDate + ": " + (string)JsonConvert.SerializeObject(jsonObj));
											}

											lsInput.Clear();
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
											_logger.LogError(fromDate + ": " + (string)JsonConvert.SerializeObject(jsonObj));
										}

										lsInput.Clear();
									}
								}
							}
						}
					}
					
				}
				catch (Exception ex)
				{
					_logger.LogError(ex, "{Message}", ex.Message);
				}

				Thread.Sleep(1000 * 2); // 2 second
			}
		}
	}
}