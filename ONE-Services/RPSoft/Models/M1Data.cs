using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ONE_Services.Handlers;

namespace ONE_Services.RPSoft.Models
{
	public class M1Data
	{
		public DateTime TradingDate { get; set; }
		public long TradingEpochTime { get; set; }
		public double OpenPx { get; set; }
		public double HighPx { get; set; }
		public double LowPx { get; set; }
		public double ClosePx { get; set; }
		public double Vol { get; set; }
		public double BuyVol { get; set; }
		public double SellVol { get; set; }

		public M1Data UpdateProperty(string value, enM1Data specialValue)
		{
			switch (specialValue)
			{
				case enM1Data.TradingEpochTime:
					this.TradingDate = Utils.ToDateTime(double.Parse(value));
					this.TradingEpochTime = long.Parse(value);
					break;
				case enM1Data.OpenPx:
					this.OpenPx = double.Parse(value);
					break;
				case enM1Data.HighPx:
					this.HighPx = double.Parse(value);
					break;
				case enM1Data.LowPx:
					this.LowPx = double.Parse(value);
					break;
				case enM1Data.ClosePx:
					this.ClosePx = double.Parse(value);
					break;
				case enM1Data.Vol:
					this.Vol = double.Parse(value);
					break;
				case enM1Data.BuyVol:
					this.BuyVol = double.Parse(value);
					break;
				case enM1Data.SellVol:
					this.SellVol = double.Parse(value);
					break;
			}

			return this;
		}
	}

	public enum enM1Data
	{
		TradingEpochTime,
		OpenPx,
		HighPx,
		LowPx,
		ClosePx,
		Vol,
		BuyVol,
		SellVol
	}
}
