using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ONE_Services.Models
{
	public class SymbolMark
	{
		public int Number { get; set; }
		public string Code { get; set; }
		public double TotalTradedVol { get; set; }

		public SymbolMark()
		{
			Number = 1;
		}
	}
}
