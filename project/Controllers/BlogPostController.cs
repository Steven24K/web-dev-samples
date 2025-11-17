using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace project.Controllers;


[Route("api/[controller]")]
[ApiController]
public class BlogPostController : ControllerBase
{

    [HttpGet("[action]")]
    public GetPosts()
    {
        return Ok("Get Posts");
    }

    [HttpPost("[action]")]
    public CreatePost()
    {
        return Ok("Create post");        
    }

    [HttpPut("[action]")]
    public EditPost()
    {
        return Ok("Edit");
    }

    [HttpDelete("[action]")]
    public DeletePost()
    {
        return Ok("Delete");
    }



}
