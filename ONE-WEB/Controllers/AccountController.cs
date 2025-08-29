using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ONE_WEB.Models;
using System.Security.Claims;
using ONE_WEB.Handlers;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Resources;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Server.HttpSys;
using Microsoft.AspNetCore.Identity;
using Ganss.XSS;
using Microsoft.AspNetCore.Localization;
using ONE_WEB.Common;
using Microsoft.AspNetCore.Authentication.Google;

namespace ONE_WEB.Controllers
{
    [Authorize]
    public class AccountController : BaseController
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<AccountController> _logger;

        public AccountController(ILogger<AccountController> logger, IWebHostEnvironment webHostEnvironment)
        {
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpGet]
        public ActionResult Register()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public ActionResult Register(RegisterView registrationView)
        {
            bool statusRegistration = false;
            string messageRegistration = string.Empty;

            if (ModelState.IsValid)
            {
                object data = new
                {
                    Store = "users_update",
                    IsNew = true,
                    UserName = registrationView.UserName,
                    PasswordHash = Handlers.Utils.SecurePasswordHasher(registrationView.Password),
                    Email = registrationView.Email,
                    FullName = registrationView.FullName
                };

                var kq = DAL.GetDataFromAPI(data);

                if (kq != "")
                {
                    dynamic resultUpdate = JsonConvert.DeserializeObject<dynamic>(kq);
                    if (resultUpdate != null && (int)resultUpdate.Result == 0)
                    {
                        messageRegistration = (string)resultUpdate.Message;
                    }
                    else
                    {
                        statusRegistration = true;
                    }
                }
                else
                    messageRegistration = "Lỗi tạo tài khoản.";

            }
            else
            {
                messageRegistration = "Lỗi thông tin tạo tài khoản!";
            }

            ViewBag.Message = messageRegistration;
            ViewBag.Status = statusRegistration;

            return View(registrationView);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Login(string? ReturnUrl = null)
        {
            if (HttpContext.User.Identity is ClaimsIdentity identity && identity.IsAuthenticated)
            {
                return await Logout();
            }

            //ViewBag.ReturnUrl = ReturnUrl;
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> Login(LoginView loginView, string? ReturnUrl = null)
        {
            
            if (ModelState.IsValid)
            {
                // Use Input.Email and Input.Password to authenticate the user
                // with your custom authentication logic.
                //
                // For demonstration purposes, the sample validates the user
                // on the email address maria.rodriguez@contoso.com with 
                // any password that passes model validation.

                object data = new
                {
                    Store = "users_login",
                    UserName = loginView.UserName,
                    Password = Handlers.Utils.SecurePasswordHasher(loginView.Password ?? "")
                };

                var kqGetUser = DAL.GetDataFromAPI(data);

                if (kqGetUser == "")
                {
                    ModelState.AddModelError(string.Empty, Resources.MyResources.GetResourceByKey("InvalidLoginInformation", GetCultureProvider()) ?? "");
                    return View(loginView);
                }

                dynamic user = JObject.Parse(kqGetUser);
                
                //var user = await AuthenticateUser(loginView.UserName, fullName);

                string userName = user.UserName;
                string fullName = user.FullName;
				string userId = user.Id;
				string avatar = user.Avatar;

				var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, userName),
                    new Claim(ClaimTypes.Name, fullName ?? ""),
                    new Claim(ClaimTypes.Role, "Administrator"),
                    new Claim("Culture", "vi"),
                    new Claim(ClaimTypes.Sid, userId),
                    new Claim("Avatar", avatar ?? "")
                };

                //foreach (var item in Roles)
                //{
                //    claims.Add(new Claim(ClaimTypes.Role, item));
                //}

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                var authProperties = new AuthenticationProperties
                {
                    //AllowRefresh = <bool>,
                    // Refreshing the authentication session should be allowed.

                    //ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(10),
                    // The time at which the authentication ticket expires. A 
                    // value set here overrides the ExpireTimeSpan option of 
                    // CookieAuthenticationOptions set with AddCookie.

                    //IsPersistent = true,
                    // Whether the authentication session is persisted across 
                    // multiple requests. When used with cookies, controls
                    // whether the cookie's lifetime is absolute (matching the
                    // lifetime of the authentication ticket) or session-based.

                    //IssuedUtc = <DateTimeOffset>,
                    // The time at which the authentication ticket was issued.

                    //RedirectUri = <string>
                    // The full path or absolute URI to be used as an http 
                    // redirect response value.
                };
                
                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    authProperties);

                if (Url.IsLocalUrl(ReturnUrl))
                {
                    return Redirect(ReturnUrl);
                }
                else return RedirectToAction("Index", "Home", null);
            }
            return View(loginView);
        }

		public IActionResult Callback()
		{
			if (User.IsInRole("Client"))
			{
				//redirect to the Clients area
				return LocalRedirect("/Home/Index");
			}
			//here comes other role checks

			return Forbid();
		}

		[AllowAnonymous]
		[HttpGet]
		//[Route("/google-login")]
		public async Task<IActionResult> GoogleLogin(string? ReturnUrl = null)
		{
            try
            {
				if (HttpContext.User.Identity is ClaimsIdentity identity && identity.IsAuthenticated)
				{
					return await Logout();
				}

				return new ChallengeResult(GoogleDefaults.AuthenticationScheme,
					   new AuthenticationProperties
					   {
						   RedirectUri = Url.Action(nameof(GoogleLoginCallback2), new { ReturnUrl })
					   });
			}
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
				return View();
			}
		}

		[AllowAnonymous]
		[HttpGet]
		public async Task<IActionResult> GoogleLoginCallback2(string? ReturnUrl = null)
		{
			var authenticateResult = await HttpContext.AuthenticateAsync("External");

			if (!authenticateResult.Succeeded)
				return BadRequest(); // TODO: Handle this better.

			var claimsIdentity = new ClaimsIdentity("Application");

			var claimsPrincipal = HttpContext.User.Identity as ClaimsIdentity;

            var loginInfo = GoogleLoginViewModel.GetLoginInfo(claimsPrincipal);
            if (loginInfo == null)
            {
                return RedirectToAction("Index");
            }

            object data = new
            {
                Store = "users_login",
                Email = loginInfo.emailaddress,
                GivenName = loginInfo.givenname,
                Identifier = loginInfo.nameidentifier,
                Name = loginInfo.name,
                SurName = loginInfo.surname,
                IsActive = true
            };

            var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, loginInfo.nameidentifier),
                    new Claim(ClaimTypes.Name, loginInfo.name),
                    new Claim(ClaimTypes.Role, "Administrator"),
                    new Claim("Culture", "vi"),
                    new Claim(ClaimTypes.Sid, loginInfo.nameidentifier),
                    new Claim("Avatar", "")
                };

            //var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            if (Url.IsLocalUrl(ReturnUrl))
            {
                return Redirect(ReturnUrl);
            }
            else return RedirectToAction("Index", "Home", null);

            //return View();
        }

		[AllowAnonymous]
		[HttpGet]
		public async Task<IActionResult> GoogleLoginCallback(string? ReturnUrl = null)
		{
			var claimsPrincipal = HttpContext.User.Identity as ClaimsIdentity;

			var loginInfo = GoogleLoginViewModel.GetLoginInfo(claimsPrincipal);
			if (loginInfo == null)
			{
				return RedirectToAction("Index");
			}

			object data = new
			{
				Store = "users_login",
				Email = loginInfo.emailaddress,
				GivenName = loginInfo.givenname,
				Identifier = loginInfo.nameidentifier,
				Name = loginInfo.name,
				SurName = loginInfo.surname,
				IsActive = true
			};

			var claims = new List<Claim>
				{
					new Claim(ClaimTypes.NameIdentifier, loginInfo.nameidentifier),
					new Claim(ClaimTypes.Name, loginInfo.name),
					new Claim(ClaimTypes.Role, "Administrator"),
					new Claim("Culture", "vi"),
					new Claim(ClaimTypes.Sid, loginInfo.nameidentifier),
					new Claim("Avatar", "")
				};

			var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

			var authProperties = new AuthenticationProperties
			{
			};

			await HttpContext.SignInAsync(
				CookieAuthenticationDefaults.AuthenticationScheme,
				new ClaimsPrincipal(claimsIdentity),
				authProperties);

			if (Url.IsLocalUrl(ReturnUrl))
			{
				return Redirect(ReturnUrl);
			}
			else return RedirectToAction("Index", "Home", null);

			//return View();
		}

		//private async Task<ApplicationUser> AuthenticateUser(string user, string password)
		//{
		//    // For demonstration purposes, authenticate a user
		//    // with a static email address. Ignore the password.
		//    // Assume that checking the database takes 500ms

		//    await Task.Delay(500);

		//    if (user == "admin")
		//    {
		//        return new ApplicationUser()
		//        {
		//            UserName = user,
		//            FullName = "Maria Rodriguez"
		//        };
		//    }
		//    else
		//    {
		//        return null;
		//    }
		//}

		//[HttpPost]
		public async Task<IActionResult> Logout()
        {
            #region snippet1
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            #endregion

            return Redirect("/Account/Login");
        }

        [HttpPost]
        public ActionResult ChangeAvatar()
        {
            try
            {
                string fileRelativePath = "";
                var fileExtension = "";
                var fileName = "";

                if (Request.Form.Files.Count > 0)
                {
                    var file = Request.Form.Files[0];
                    if (file != null && file.Length > 0)
                    {
                        int loc = file.FileName.LastIndexOf(".");
                        fileName = Path.GetFileName(file.FileName);
                        fileExtension = Path.GetExtension(file.FileName);
                        if (!AppSetting.ImageValidExtensions.Contains(fileExtension))
                        {
                            dynamic result2 = new System.Dynamic.ExpandoObject();
                            result2.Result = 0;
                            result2.Message = Resources.MyResources.GetResourceByKey("InvalidFileType", GetCultureProvider());

                            return Ok(result2);
                        }

                        string pathRelativeFolder = "/Images/Users/Avatar/";
                        string pathAbsoluteFolder = "";
                        string webRootPath = _webHostEnvironment.WebRootPath;
                        pathAbsoluteFolder = Path.GetFullPath(webRootPath + pathRelativeFolder);
                        string guid = Guid.NewGuid().ToString();
                        fileRelativePath = pathRelativeFolder + guid + fileExtension;
                        if (!Directory.Exists(pathAbsoluteFolder))
                        {
                            Directory.CreateDirectory(pathAbsoluteFolder);
                        }
                        string fullPath = Path.Combine(pathAbsoluteFolder, guid + fileExtension);

                        using (FileStream fs = System.IO.File.Create(fullPath))
                        {
                            file.CopyTo(fs);
                        }

                        if(!String.IsNullOrEmpty(HttpContext?.User.FindFirst("Avatar")?.Value))
                            System.IO.File.Delete(Path.GetFullPath(webRootPath + HttpContext?.User.FindFirst("Avatar")?.Value));

                        if (HttpContext?.User.Identity is ClaimsIdentity identity)
                        {
                            identity.RemoveClaim(identity.FindFirst("Avatar"));
                            identity.AddClaim(new Claim("Avatar", fileRelativePath));
                            HttpContext.SignInAsync(
                                CookieAuthenticationDefaults.AuthenticationScheme,
                                new ClaimsPrincipal(HttpContext.User.Identity));
                        }
                    }

                }

                object data = new
                {
                    Store = "users_changeavatar",
                    Culture = GetCultureProvider(),
                    Id = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value,
                    Avatar = fileRelativePath
                };

                string kq = DAL.GetDataFromAPI(data);

                return Ok(kq);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }

            dynamic result = new System.Dynamic.ExpandoObject();
            result.Result = 0;
            result.Message = Resources.MyResources.GetResourceByKey("Error", GetCultureProvider());

            return Ok(result);
        }

        [HttpPost]
        public ActionResult ChangePassword(string data)
        {
            dynamic? jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(data);
#pragma warning disable CS8602 // Dereference of a possibly null reference.
            jsonObj["Culture"] = GetCultureProvider();
#pragma warning restore CS8602 // Dereference of a possibly null reference.
            jsonObj["Store"] = "users_changepassword";
            jsonObj["UserId"] = HttpContext?.User.FindFirst(ClaimTypes.Sid)?.Value;

            dynamic result = new System.Dynamic.ExpandoObject();
            result.Result = 0;
            result.Message = Resources.MyResources.GetResourceByKey("Error", GetCultureProvider());

            try
            {
                if (String.IsNullOrEmpty((string)jsonObj["OldPassword"]))
                {
                    result.Message = Resources.MyResources.GetResourceByKey("OldPasswordCannotEmpty", GetCultureProvider());
                    return Ok(result);
                }    

                if (String.IsNullOrEmpty((string)jsonObj["NewPassword"]))
                {
                    result.Message = Resources.MyResources.GetResourceByKey("NewPasswordCannotEmpty", GetCultureProvider());
                    return Ok(result);
                }

                if ((string)jsonObj["NewPassword"] != (string)jsonObj["VerifyPassword"])
                {
                    result.Message = Resources.MyResources.GetResourceByKey("VerifyPasswordsNotMatch", GetCultureProvider());
                    return Ok(result);
                }

                jsonObj["OldPassword"] = Handlers.Utils.SecurePasswordHasher((string)jsonObj["OldPassword"]);
                jsonObj["NewPassword"] = Utils.SecurePasswordHasher((string)jsonObj["NewPassword"]);

                string kq = DAL.GetDataFromAPI(jsonObj);

                return Ok(kq);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }

            return Ok(result);
        }
    }
}
