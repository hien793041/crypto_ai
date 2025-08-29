using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace ONE_Services.RPSoft.Models
{
	public class SResult
	{
		[DataMember]
		public RslCode C { get; set; }
		[DataMember]
		public string D { get; set; }
	}
}
