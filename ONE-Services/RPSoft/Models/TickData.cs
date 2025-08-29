using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ONE_Services.Handlers;

namespace ONE_Services.RPSoft.Models
{
	public class TickData
	{
		public DateTime TradingDate { get; set; }
		public long TradingEpochTime { get; set; }
		public double ClosePx { get; set; }
		public double Vol { get; set; }
		public string Side { get; set; }

		public TickData UpdateProperty(string value, enTickData specialValue)
		{
			switch (specialValue)
			{
				case enTickData.TradingEpochTime:
					this.TradingDate = Utils.ToDateTime(double.Parse(value));
					this.TradingEpochTime = long.Parse(value);
					break;
				case enTickData.ClosePx:
					this.ClosePx = double.Parse(value);
					break;
				case enTickData.Vol:
					this.Vol = double.Parse(value);
					break;
				case enTickData.Side:
					this.Side = value;
					break;
			}

			return this;
		}
	}

	public enum enTickData
	{
		TradingEpochTime,
		Vol,
		ClosePx,
		Side
	}
}
