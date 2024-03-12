using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("")]
public class HomeController : Controller
{
    private readonly ILogger<AuthController> _logger;

    public HomeController(ILogger<AuthController> logger)
    {
        _logger = logger;
    }

    [Authorize]
    [HttpGet]
    public IActionResult Home()
    {
        return Ok("Welcome to the backend!");
    }
}
