using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace project.Controllers;


[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{

    [HttpGet("[action]")]
    public IsLoggedIn()
    {
        return Ok("Is loggedIn");
    }

    [HttpGet("[action]")]
    public GetUsers()
    {
        return Ok("users");
    }

    [HttpPost("[action]")]
    public Login()
    {
        return Ok("Login");
    }

    [HttpGet("[action]")]
    public Logout()
    {
        return Ok("Logout");
    }

}
