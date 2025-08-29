using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualBasic.FileIO;
using ONE_Services.Common;

namespace ONE_Services.Handlers
{
	public static class Utils
	{
		public static Microsoft.Extensions.Logging.ILogger logger = null;

		public static void ConfigureLogger(Microsoft.Extensions.Logging.ILogger _logger)
		{
			logger = _logger;
		}

		public static List<List<string>> ParseCSV(string csv)
		{
			List<List<string>> result = new List<List<string>>();


			// To use the TextFieldParser a reference to the Microsoft.VisualBasic assembly has to be added to the project. 
			using (TextFieldParser parser = new TextFieldParser(new StringReader(csv)))
			{
				parser.CommentTokens = new string[] { "#" };
				parser.SetDelimiters(new string[] { "," });
				parser.HasFieldsEnclosedInQuotes = true;

				// Skip over header line.
				//parser.ReadLine();

				while (!parser.EndOfData)
				{
					var values = new List<string>();

					var readFields = parser.ReadFields();
					if (readFields != null)
						values.AddRange(readFields);
					result.Add(values);
				}
			}

			return result;
		}

		public static DateTime ToDateTime(this double epochTime)
		{
			return new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddSeconds(epochTime);
		}

		public static double ToEpochTime(this DateTime dt)
		{
			var t = dt - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
			return t.TotalSeconds;
		}

		public static bool CheckTimeTrading()
		{
			DateTime dtNow = DateTime.Now;
			int minuteNow = dtNow.Hour * 60 + dtNow.Minute;

			if (DateTime.Now.DayOfWeek != DayOfWeek.Saturday && DateTime.Now.DayOfWeek != DayOfWeek.Sunday
						&& ((minuteNow >= AppSetting.StartTime1 && minuteNow <= AppSetting.EndTime1) || (minuteNow >= AppSetting.StartTime2 && minuteNow <= AppSetting.EndTime2))
						)
				return true;

			return false;
		}
	}
}
