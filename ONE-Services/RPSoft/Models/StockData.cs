using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ONE_Services.RPSoft.Models
{
	public class StockData
	{
		public string? Symbol { get; set; }
		public double RefPx { get; set; }
		public double FloorPx { get; set; }
		public double CeilingPx { get; set; }
		public double TotalTradedVol { get; set; }
		public double TotalTradedVal { get; set; }
		public double LastMatchedPx { get; set; }
		public double LastMatchedVol { get; set; }
		public double TotalBidVol { get; set; }
		public double BestBidPx1 { get; set; }
		public double BestBidVol1 { get; set; }
		public double BestBidPx2 { get; set; }
		public double BestBidVol2 { get; set; }
		public double BestBidPx3 { get; set; }
		public double BestBidVol3 { get; set; }
		public double BestAskPx1 { get; set; }
		public double BestAskVol1 { get; set; }
		public double BestAskPx2 { get; set; }
		public double BestAskVol2 { get; set; }
		public double BestAskPx3 { get; set; }
		public double BestAskVol3 { get; set; }
		public double TotalAskVol { get; set; }
		public double HighPx { get; set; }
		public double LowPx { get; set; }
		public double OpenPx { get; set; }
		public double ForeignBuyVol { get; set; }
		public double ForeignSellVol { get; set; }
		public double PtMatchedVol { get; set; }
		public double PtMatchedPx { get; set; }
		public double PtVol { get; set; }
		public double PtVal { get; set; }
		public double CurrentRoom { get; set; }
		public double OpenInterest { get; set; }
		public double INav { get; set; }

		public StockData UpdateProperty(string value, enStockData specialValue)
		{
			switch (specialValue)
			{
				case enStockData.Symbol:
					this.Symbol = value;
					break;
				case enStockData.RefPx:
					this.RefPx = double.Parse(value);
					break;
				case enStockData.FloorPx:
					this.FloorPx = double.Parse(value);
					break;
				case enStockData.CeilingPx:
					this.CeilingPx = double.Parse(value);
					break;
				case enStockData.TotalTradedVol:
					this.TotalTradedVol = double.Parse(value);
					break;
				case enStockData.TotalTradedVal:
					this.TotalTradedVal = double.Parse(value);
					break;
				case enStockData.LastMatchedPx:
					this.LastMatchedPx = double.Parse(value);
					break;
				case enStockData.LastMatchedVol:
					this.LastMatchedVol = double.Parse(value);
					break;
				case enStockData.TotalBidVol:
					this.TotalBidVol = double.Parse(value);
					break;
				case enStockData.BestBidPx1:
					this.BestBidPx1 = double.Parse(value);
					break;
				case enStockData.BestBidVol1:
					this.BestBidVol1 = double.Parse(value);
					break;
				case enStockData.BestBidPx2:
					this.BestBidPx2 = double.Parse(value);
					break;
				case enStockData.BestBidVol2:
					this.BestBidVol2 = double.Parse(value);
					break;
				case enStockData.BestBidPx3:
					this.BestBidPx3 = double.Parse(value);
					break;
				case enStockData.BestBidVol3:
					this.BestBidVol3 = double.Parse(value);
					break;
				case enStockData.BestAskPx1:
					this.BestAskPx1 = double.Parse(value);
					break;
				case enStockData.BestAskVol1:
					this.BestAskVol1 = double.Parse(value);
					break;
				case enStockData.BestAskPx2:
					this.BestAskPx2 = double.Parse(value);
					break;
				case enStockData.BestAskVol2:
					this.BestAskVol2 = double.Parse(value);
					break;
				case enStockData.BestAskPx3:
					this.BestAskPx3 = double.Parse(value);
					break;
				case enStockData.BestAskVol3:
					this.BestAskVol3 = double.Parse(value);
					break;
				case enStockData.TotalAskVol:
					this.TotalAskVol = double.Parse(value);
					break;
				case enStockData.HighPx:
					this.HighPx = double.Parse(value);
					break;
				case enStockData.LowPx:
					this.LowPx = double.Parse(value);
					break;
				case enStockData.OpenPx:
					this.OpenPx = double.Parse(value);
					break;
				case enStockData.ForeignBuyVol:
					this.ForeignBuyVol = double.Parse(value);
					break;
				case enStockData.ForeignSellVol:
					this.ForeignSellVol = double.Parse(value);
					break;
				case enStockData.PtMatchedVol:
					this.PtMatchedVol = double.Parse(value);
					break;
				case enStockData.PtMatchedPx:
					this.PtMatchedPx = double.Parse(value);
					break;
				case enStockData.PtVol:
					this.PtVol = double.Parse(value);
					break;
				case enStockData.PtVal:
					this.PtVal = double.Parse(value);
					break;
				case enStockData.CurrentRoom:
					this.CurrentRoom = double.Parse(value);
					break;
				case enStockData.OpenInterest:
					this.OpenInterest = double.Parse(value);
					break;
				case enStockData.INav:
					this.INav = double.Parse(value);
					break;
			}

			return this;
		}
	}

	public enum enStockData
	{
		Symbol,
		RefPx,
		FloorPx,
		CeilingPx,
		TotalTradedVol,
		TotalTradedVal,
		LastMatchedPx,
		LastMatchedVol,
		TotalBidVol,
		BestBidPx1,
		BestBidVol1,
		BestBidPx2,
		BestBidVol2,
		BestBidPx3,
		BestBidVol3,
		BestAskPx1,
		BestAskVol1,
		BestAskPx2,
		BestAskVol2,
		BestAskPx3,
		BestAskVol3,
		TotalAskVol,
		HighPx,
		LowPx,
		OpenPx,
		ForeignBuyVol,
		ForeignSellVol,
		PtMatchedVol,
		PtMatchedPx,
		PtVol,
		PtVal,
		CurrentRoom,
		OpenInterest,
		INav
	}
}
