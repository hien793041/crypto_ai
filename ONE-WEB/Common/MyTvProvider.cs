using CsvHelper;
using ONE_WEB.Data;
using ONE_WEB.Handlers;
using ONE_WEB.Models;
using System;
using System.Formats.Asn1;
using System.Globalization;
using Newtonsoft.Json;

namespace ONE_WEB
{
	public class MyTvProvider //: ITradingViewProvider
	{
		private static readonly Dictionary<string, TvBar[]> _bars = new Dictionary<string, TvBar[]>();

		public Task<TvConfiguration> GetConfiguration()
		{
			var config = new TvConfiguration
			{
				SupportedResolutions = new[] { "60", "120", "240", "D", "2D", "3D", "W", "3W", "M", "6M" },
				SupportGroupRequest = false,
				SupportMarks = true,
				SupportSearch = true,
				SupportTimeScaleMarks = false
			};
			return Task.FromResult(config);
		}

		public Task<TvSymbolInfo> GetSymbol(string symbol)
		{
			var symbolSafe = (symbol ?? string.Empty)
				//.Replace("Index", string.Empty, StringComparison.OrdinalIgnoreCase)
				.Replace(":", string.Empty);

			var sym = new TvSymbolInfo()
			{
				Name = symbolSafe,
				//Ticker = symbolSafe,
				//Description = "Bitcoin",
				//Type = "bitcoin",
				ExchangeTraded = "",
				ExchangeListed = "",
				//Timezone = "America/New_York",
				MinMov = 1,
				MinMov2 = 0,
				PriceScale = 100,
				//PointValue = 1,
				//Session = "0930-1630",
				Session = "24x7",
				HasIntraday = true,
				//IntradayMultipliers = new[] { "60" },
				//HasNoVolume = false,
				SupportedResolutions = new[] { "60", "120", "240", "D", "2D", "3D", "W", "3W", "M", "6M" },
				//CurrencyCode = "USD",
				//OriginalCurrencyCode = "USD",
				//VolumePrecision = 2

				VisiblePlotsSet = "ohlcv"

			};
			return Task.FromResult(sym);
		}

		public Task<TvSymbolSearch[]> FindSymbols(string query, string type, string exchange, int? limit)
		{
			var querySafe = query ?? string.Empty;
			var symbols = new[]
			{
				new TvSymbolSearch {Symbol = "AAPL", FullName = "Apple", Description = "Apple Inc", Type = "stock"},
				new TvSymbolSearch {Symbol = "MSFT", FullName = "Microsoft", Description = "Microsoft Inc", Type = "stock"},
				new TvSymbolSearch {Symbol = "BTC", FullName = "Bitcoin", Description = "Only Bitcoin!", Type = "bitcoin"},
			};
			var found = symbols
				.Where(x => x.Symbol.Contains(querySafe, StringComparison.InvariantCultureIgnoreCase) ||
							x.FullName.Contains(querySafe, StringComparison.InvariantCultureIgnoreCase) ||
							x.Description.Contains(querySafe, StringComparison.InvariantCultureIgnoreCase))
				.Take(limit ?? 100)
				.ToArray();
			return Task.FromResult(found);
		}

		public async Task<TvBarResponse> GetHistory(DateTime @from, DateTime to, string symbol, string resolution)
		{
			var key = $"{symbol}__{resolution}";
			//if (_bars.ContainsKey(key))
			//{
			//	var bars = _bars[key];
			//	return FindBars(from, to, bars);
			//}

			RangeBarModel[] loaded = new RangeBarModel[0];

			object data = new
			{
				Store = "stock_trading_getby",
				StockCode = symbol
			};

			if (resolution.Equals("d", StringComparison.InvariantCultureIgnoreCase) ||
				resolution.Equals("1d", StringComparison.InvariantCultureIgnoreCase))
			{
				var kqIndex = DAL.GetDataFromAPI(data);
				loaded = Newtonsoft.Json.JsonConvert.DeserializeObject<RangeBarModel[]>(kqIndex);

				//loaded = LoadBars("D:\\Projects\\ONE\\ONE-WEB\\Data\\bitfinex_btcusd_ohlcv_1d_2017_2020.csv");
				//loaded = LoadBars("Data\\bitflyer_btcusd_ohlcv_1d_2019.csv", "ms");
			}

			//if (resolution.Equals("h", StringComparison.InvariantCultureIgnoreCase) ||
			//	resolution.Equals("1h", StringComparison.InvariantCultureIgnoreCase) ||
			//	resolution.Equals("60", StringComparison.InvariantCultureIgnoreCase))
			//{
			//	loaded = LoadBars("D:\\Projects\\ONE\\ONE-WEB\\Data\\bitstamp_btcusd_ohlcv_1h_2020.csv", "ms");
			//}

			var converted = ConvertBars(loaded);
			_bars[key] = converted;
			return FindBars(from, to, converted);
		}

		public Task<TvMark[]> GetMarks(DateTime @from, DateTime to, string symbol, string resolution)
		{
			var key = $"{symbol}__{resolution}";
			if (!_bars.ContainsKey(key))
				return Task.FromResult(new TvMark[0]);

			var bars = _bars[key].OrderByDescending(x => x.Timestamp).ToArray();
			var first = bars.Skip(10).FirstOrDefault();
			var last = bars.Skip(2).FirstOrDefault();

			var marks = new[]
			{
				new TvMark {Id = 1, Color = "red", Label = "S", LabelFontColor = "black", MinSize = 15, Text = "Sell", Timestamp = last?.Timestamp ?? DateTime.UtcNow},
				new TvMark {Id = 2, Color = "blue", Label = "B", LabelFontColor = "black", MinSize = 10, Text = "Buy", Timestamp = first?.Timestamp ?? DateTime.UtcNow},
			};

			var foundMarks = marks
				.Where(x => x.Timestamp >= from && x.Timestamp <= to)
				.OrderBy(x => x.Timestamp)
				.ToArray();

			return Task.FromResult(foundMarks);
		}

		private TvBar[] ConvertBars(RangeBarModel[] loaded)
		{
			return loaded
				.Select(ConvertBar)
				.ToArray();
		}

		private TvBar ConvertBar(RangeBarModel arg)
		{
			return new TvBar()
			{
				Timestamp = arg.TimestampDate,
				Close = arg.Close ?? 0,
				Open = arg.Open,
				High = arg.High,
				Low = arg.Low,
				Volume = arg.Volume
			};
		}

		private TvBarResponse FindBars(DateTime @from, DateTime to, TvBar[] bars)
		{
			var foundBars = bars
				.Where(x => x.Timestamp >= RemoveTime(from) && x.Timestamp <= RemoveTime(to))
				.OrderBy(x => x.Timestamp)
				.ToArray();
			var before = bars
				.OrderBy(x => x.Timestamp)
				.LastOrDefault(x => x.Timestamp < RemoveTime(@from));
			return new TvBarResponse()
			{
				Bars = foundBars,
				Status = foundBars.Any() ? TvBarStatus.Ok : TvBarStatus.NoData,
				NextTime = before?.Timestamp
			};
		}

		private DateTime RemoveTime(in DateTime timestamp)
		{
			return timestamp;
			//return new DateTime(timestamp.Year, timestamp.Month, timestamp.Day, 
			//    0, 0, 0, DateTimeKind.Utc);
		}


		private static RangeBarModel[] LoadBars(string file, string timestampType = null)
		{
			using var reader = new StreamReader(file);
			using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
			csv.Configuration.PrepareHeaderForMatch = (header, index) => header.ToLower();
			csv.Configuration.HeaderValidated = null;
			csv.Configuration.MissingFieldFound = null;
			var bars = csv.GetRecords<RangeBarModel>().ToArray();
			FixTimestamp(bars, timestampType);
			var ordered = bars.OrderBy(x => x.TimestampDate).ToArray();
			return ordered;
		}

		private static void FixTimestamp(RangeBarModel[] bars, string timestampType = null)
		{
			if (string.IsNullOrWhiteSpace(timestampType) ||
				timestampType == "unix-sec" ||
				timestampType == "date")
			{
				// default valid timestamp format, do nothing
				return;
			}

			foreach (var bar in bars)
			{
				var t = bar.Timestamp;
				var d = 3;
				var converted = t;

				switch (timestampType)
				{
					case "unix-ms":
					case "ms":
						converted = t / (Math.Pow(10, d));
						break;
				}

				bar.Timestamp = converted;
			}
		}
	}
}
