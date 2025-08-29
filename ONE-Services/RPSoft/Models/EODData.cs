using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ONE_Services.Handlers;

namespace ONE_Services.RPSoft.Models
{
	public class EODData
	{
		public DateTime TradingEpochTime { get; set; }
		public double AdjustRate { get; set; }
		public double RefPx { get; set; }
		public double OpenPx { get; set; }
		public double HighPx { get; set; }
		public double LowPx { get; set; }
		public double ClosePx { get; set; }
		public double Vol { get; set; }
		public double Val { get; set; }
		public double BuyVol { get; set; }
		public double SellVol { get; set; }
		public double PtVol { get; set; }
		public double PtVal { get; set; }
		public double ForeignBuyVol { get; set; }
		public double ForeignSellVol { get; set; }
		public double OpenInterest { get; set; }
		public double CeilingPx { get; set; }
		public double FloorPx { get; set; }

		public EODData UpdateProperty(string value, enEODData specialValue)
		{
			switch (specialValue)
			{
				case enEODData.TradingEpochTime:
					this.TradingEpochTime = Utils.ToDateTime(double.Parse(value));
					break;
				case enEODData.AdjustRate:
					this.AdjustRate = double.Parse(value);
					break;
				case enEODData.RefPx:
					this.RefPx = double.Parse(value);
					break;
				case enEODData.OpenPx:
					this.OpenPx = double.Parse(value);
					break;
				case enEODData.HighPx:
					this.HighPx = double.Parse(value);
					break;
				case enEODData.LowPx:
					this.LowPx = double.Parse(value);
					break;
				case enEODData.ClosePx:
					this.ClosePx = double.Parse(value);
					break;
				case enEODData.Vol:
					this.Vol = double.Parse(value);
					break;
				case enEODData.Val:
					this.Val = double.Parse(value);
					break;
				case enEODData.BuyVol:
					this.BuyVol = double.Parse(value);
					break;
				case enEODData.SellVol:
					this.SellVol = double.Parse(value);
					break;
				case enEODData.PtVol:
					this.PtVol = double.Parse(value);
					break;
				case enEODData.PtVal:
					this.PtVal = double.Parse(value);
					break;
				case enEODData.ForeignBuyVol:
					this.ForeignBuyVol = double.Parse(value);
					break;
				case enEODData.ForeignSellVol:
					this.ForeignSellVol = double.Parse(value);
					break;
				case enEODData.OpenInterest:
					this.OpenInterest = double.Parse(value);
					break;
			}

			return this;
		}
	}

	public enum enEODData
	{
		TradingEpochTime,
		AdjustRate,
		RefPx,
		OpenPx,
		HighPx,
		LowPx,
		ClosePx,
		Vol,
		Val,
		BuyVol,
		SellVol,
		PtVol,
		PtVal,
		ForeignBuyVol,
		ForeignSellVol,
		OpenInterest
	}
}
