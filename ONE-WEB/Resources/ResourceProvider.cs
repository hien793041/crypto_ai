//using System.Text.Json;
using System.Text.Json.Nodes;
using Entity;
using ONE_WEB.Handlers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ONE_WEB.Resources
{

    public class ResourceProvider : BaseResourceProvider
    {
        protected override IList<ResourceEntry> ReadResources()
        {
            var resources = new List<ResourceEntry>();

            object data = new
            {
                Store = "resources_getlist"
            };

            string? strResponse = DAL.GetDataFromAPI(data);

            if (String.IsNullOrEmpty(strResponse))
                return resources;

            dynamic result = JValue.Parse(strResponse);
            foreach (dynamic item in result)
            {
                resources.Add(new ResourceEntry
                {
                    Name = item.Name.ToString(),
                    Value = item.Value.ToString(),
                    Culture = item.Culture.ToString()
                });
            }

            return resources;

        }

        protected override ResourceEntry ReadResource(string name, string culture)
        {
            ResourceEntry? resource = null;

            object data = new
            {
                Store = "resources_getresourcebyname",
                Name = name,
                Culture = culture
            };

            var strResponse = DAL.GetDataFromAPI(data);

            dynamic result = JValue.Parse(strResponse);

            //ResourceEntry result = JsonConvert.DeserializeObject<ResourceEntry>(strResponse);

            resource = new ResourceEntry
            {
                Name = result.Name.ToString(),
                Value = result.Value.ToString(),
                Culture = result.Culture.ToString()
            };

            return resource;
        }

    }
}
