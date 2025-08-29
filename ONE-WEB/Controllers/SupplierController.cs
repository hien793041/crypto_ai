//using System.Text.RegularExpressions;
using ONE_WEB.Handlers;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Mvc;

namespace ONE_WEB.Controllers
{
    public class SupplierController : Controller
    {
        private readonly ILogger<SupplierController> logger;

        public SupplierController(ILogger<SupplierController> logger)
        {
            this.logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult GetSupplierType()
        {
            object data = new
            {
                Store = "suppliertype_getlist",
                Culture = "vi"
            };

            var kq = DAL.GetDataFromAPI(data);
            return Ok(kq);
        }

        [HttpPost]
        public ActionResult GetSupplier()
        {
            object data = new
            {
                Store = "supplier_getlist",
                Culture = "vi"
            };

            var kq = DAL.GetDataFromAPI(data);
            return Ok(kq);
        }
    }
}
