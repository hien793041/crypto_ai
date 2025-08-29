using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using ONE_Services.Handlers;

namespace ONE_Services.RPSoft.Models
{
	public class StockInfo
	{
		public string Exchange { get; set; }
		public string Type { get; set; }
		public string Name { get; set; }
		public string NameEn { get; set; }
		public DateTime ListedEpochDate { get; set; }
		public string ListedVol { get; set; }
		public string UnderlyingSymbol { get; set; }
		public DateTime LastTradingEpochDate { get; set; }
		public DateTime MaturityEpochDate { get; set; }
		public string CwType { get; set; }
		public string CwStyle { get; set; }
		public string ExerciseRatio { get; set; }
		public string ExercisePrice { get; set; }
		public string IssuerName { get; set; }

		public StockInfo UpdateProperty(string value, enStockInfo specialValue)
		{
			switch (specialValue)
			{
				case enStockInfo.Exchange:
					this.Exchange = value;
					break;
				case enStockInfo.Type:
					this.Type = value;
					break;
				case enStockInfo.Name:
					this.Name = value;
					break;
				case enStockInfo.NameEn:
					this.NameEn = value;
					break;
				case enStockInfo.ListedEpochDate:
					this.ListedEpochDate = Utils.ToDateTime(double.Parse(value));
					break;
				case enStockInfo.ListedVol:
					this.ListedVol = value;
					break;
				case enStockInfo.UnderlyingSymbol:
					if (!String.IsNullOrEmpty(value))
						this.UnderlyingSymbol = value;
					break;
				case enStockInfo.LastTradingEpochDate:
					if (value != "0")
						this.LastTradingEpochDate = Utils.ToDateTime(double.Parse(value));
					break;
				case enStockInfo.MaturityEpochDate:
					if (value != "0")
						this.MaturityEpochDate = Utils.ToDateTime(double.Parse(value));
					break;
				case enStockInfo.CwType:
					this.CwType = value;
					break;
				case enStockInfo.CwStyle:
					this.CwStyle = value;
					break;
				case enStockInfo.ExerciseRatio:
					if (!String.IsNullOrEmpty(value))
						this.ExerciseRatio = value;
					break;
				case enStockInfo.ExercisePrice:
					if (!String.IsNullOrEmpty(value))
						this.ExercisePrice = value;
					break;
				case enStockInfo.IssuerName:
					if (!String.IsNullOrEmpty(value))
						this.IssuerName = value;
					break;
			}

			return this;
		}
	}

	public enum enStockInfo
	{
		Exchange,
		Type,
		Name,
		NameEn,
		ListedEpochDate,
		ListedVol,
		UnderlyingSymbol,
		LastTradingEpochDate,
		MaturityEpochDate,
		CwType,
		CwStyle,
		ExerciseRatio,
		ExercisePrice,
		IssuerName
	}
}
