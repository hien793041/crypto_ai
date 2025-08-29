using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ONE_Services.Handlers;

namespace ONE_Services.RPSoft.Models
{
	public class IndexData
	{
		public string Symbol { get; set; }
		public DateTime TradingEpochTime { get; set; }
		public double RefIndex { get; set; }
		public double MarketIndex { get; set; }
		public double Vol { get; set; }
		public double Val { get; set; }
		public double SellVol { get; set; }
		public double BuyVol { get; set; }
		public double ForeignBuyVol { get; set; }
		public double ForeignSellVol { get; set; }
		public double PtVol { get; set; }
		public double PtVal { get; set; }
		public int Advances { get; set; }
		public int Nochanges { get; set; }
		public int Declines { get; set; }
		public int Ceiling { get; set; }
		public int Floor { get; set; }
		public int NoTrade { get; set; }
		public string Status { get; set; }

		public IndexData UpdateProperty(string value, enIndexData specialValue)
		{
			switch (specialValue)
			{
				case enIndexData.Symbol:
					this.Symbol = value;
					break;
				case enIndexData.TradingEpochTime:
					this.TradingEpochTime = Utils.ToDateTime(double.Parse(value));
					break;
				case enIndexData.RefIndex:
					this.RefIndex = double.Parse(value);
					break;
				case enIndexData.MarketIndex:
					this.MarketIndex = double.Parse(value);
					break;
				case enIndexData.Vol:
					this.Vol = double.Parse(value);
					break;
				case enIndexData.Val:
					this.Val = double.Parse(value);
					break;
				case enIndexData.SellVol:
					this.SellVol = double.Parse(value);
					break;
				case enIndexData.BuyVol:
					this.BuyVol = double.Parse(value);
					break;
				case enIndexData.ForeignBuyVol:
					this.ForeignBuyVol = double.Parse(value);
					break;
				case enIndexData.ForeignSellVol:
					this.ForeignSellVol = double.Parse(value);
					break;
				case enIndexData.PtVol:
					this.PtVol = double.Parse(value);
					break;
				case enIndexData.PtVal:
					this.PtVal = double.Parse(value);
					break;
				case enIndexData.Advances:
					this.Advances = int.Parse(value);
					break;
				case enIndexData.Nochanges:
					this.Nochanges = int.Parse(value);
					break;
				case enIndexData.Declines:
					this.Declines = int.Parse(value);
					break;
				case enIndexData.Ceiling:
					this.Ceiling = int.Parse(value);
					break;
				case enIndexData.Floor:
					this.Floor = int.Parse(value);
					break;
				case enIndexData.NoTrade:
					this.NoTrade = int.Parse(value);
					break;
				case enIndexData.Status:
					this.Status = value;
					break;
			}

			return this;
		}
	}

	public enum enIndexData
	{
		Symbol,
		TradingEpochTime,
		RefIndex,
		MarketIndex,
		Vol,
		Val,
		SellVol,
		BuyVol,
		ForeignBuyVol,
		ForeignSellVol,
		PtVol,
		PtVal,
		Advances,
		Nochanges,
		Declines,
		Ceiling,
		Floor,
		NoTrade,
		Status
	}
}
