using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace ONE_WEB.Models
{
    public class LoginView
    {
        [Required(ErrorMessage = "Tên đăng nhập được yêu cầu")]
        public string? UserName { get; set; }

        [Required(ErrorMessage = "Mật khẩu được yêu cầu")]
        public string? Password { get; set; }

        public bool RememberMe { get; set; }
    }

    public class RegisterView
    {
        [Required(ErrorMessage = "Tên đăng nhập được yêu cầu")]
        [Display(Name = "User Name")]
        public string? UserName { get; set; }

        [Required(ErrorMessage = "Họ tên được yêu cầu")]
        public string? FullName { get; set; }

        [Required(ErrorMessage = "Email này được yêu cầu")]
        [DataType(DataType.EmailAddress)]
        [Display(Name = "Email")]
        public string? Email { get; set; }
        //[Required]
        //public Guid ActivationCode { get; set; }

        [Required(ErrorMessage = "Mật khẩu được yêu cầu")]
        [DataType(DataType.Password)]
        public string? Password { get; set; }

        [Required(ErrorMessage = "Nhập lại mật khẩu được yêu cầu")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Lỗi : Nhập lại mật khẩu không khớp với mật khẩu")]
        public string? ConfirmPassword { get; set; }
    }
}
