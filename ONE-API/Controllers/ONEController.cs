using System.Data;
using System.IO.Compression;
using System.Text.Json;
using Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
using Npgsql;
using NpgsqlTypes;
using NTS.Logging.File;

namespace ONE_API.Controllers
{
    [CustomAuthorization]
    [ApiController]
    [Route("[Controller]")]
    public class ONEController : ControllerBase
    {

        private IConfiguration Configuration;

        ILogger<ONEController> logger;

        public ONEController(IConfiguration _configuration, ILogger<ONEController> logger)
        {
            Configuration = _configuration;
            this.logger = logger;
        }

        [HttpGet("api/Test")]
        public IActionResult Test()
        {

            int.Parse("a");
            logger.LogInformation("Test");

            return Ok("Ok");
        }

        [HttpPost("api/GetDataFromPostgreSQL")]
        public IActionResult GetDataFromPostgreSQL([FromBody()] object msg)
        {
            
            string? store;

            var input = JsonSerializer.Serialize(msg);

			//logger.LogInformation(input);

			JObject obj = JObject.Parse(input);
            store = (string?)obj["Store"];

            string? result;

            NpgsqlConnection conn = new(this.Configuration.GetConnectionString("ONEConnection"));

            conn.Open();

            NpgsqlCommand command = new NpgsqlCommand(store, conn);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("input", NpgsqlDbType.Json, input);
            result = command.ExecuteScalar() as string;
            
            command.Dispose();
            conn.Close();

            return Ok($"{result}");
        }

        //[HttpPost("api/GetSupplierType")]
        //public IActionResult GetSupplierType([FromBody()] InputApi msg)
        //{
        //    if (msg.Key != this.Configuration.GetSection("AppSettings")["Key"])
        //        return NotFound();

        //    var input = JsonSerializer.Serialize(msg);

        //    string? result;

        //    NpgsqlConnection conn = new(this.Configuration.GetConnectionString("HISConnection"));

        //    conn.Open();

        //    NpgsqlCommand command = new NpgsqlCommand("s2_suppliertype_getlist", conn);
        //    command.CommandType = CommandType.StoredProcedure;
        //    command.Parameters.AddWithValue("input", NpgsqlDbType.Json, input);
        //    result = command.ExecuteScalar() as string;

        //    command.Dispose();
        //    conn.Close();

        //    return Ok($"{result}");
        //}

        [HttpGet("api/dbversion")]
        public IActionResult GetVersion()
        {
            //int CustomerId = 123;
            //int OrderId = 456;

            //using (logger.BeginScope("THIS IS A SCOPE"))
            //{
            //    logger.LogInformation("Test");
            //    logger.LogCritical("Customer {CustomerId} order {OrderId} is completed.", CustomerId, OrderId);
            //    logger.LogWarning("Just a warning");

            //}

            using NpgsqlConnection conn = new(this.Configuration.GetConnectionString("HISConnection"));

            conn.Open();

            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT version();";

            string? result = cmd.ExecuteScalar() as string;

            conn.Close();
            return Ok($"Version: {result}");
        }
    }
}
