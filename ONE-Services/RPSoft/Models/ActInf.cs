using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace ONE_Services.RPSoft.Models
{
	public class ActInf
	{
		[DataMember]
		public string A { get; set; }
		[DataMember]
		public string P { get; set; }
		[DataMember]
		public string S { get; set; }
	}
}
