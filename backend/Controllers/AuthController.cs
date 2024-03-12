using backend.Auth;
using backend.Repositories;
using backend.User;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly UserRepository _repository;
    private readonly AuthService _authService;

    public AuthController(ILogger<AuthController> logger, UserRepository repository, AuthService authService)
    {
        _logger = logger;
        _repository = repository;
        _authService = authService;
    }

    [HttpPost("register")]
    public IActionResult RegisterUser(User.User user)
    {
        if (_repository.Exists(u => u.Mail == user.Mail)) {
            return BadRequest(new {message=$"User with '{user.Mail}' mail already exists."});
        }

        user.Id = new UserId(Guid.NewGuid());
        
        _repository.Insert(user);
        var token = _authService.GenerateToken(user);
        return Ok(new {message="User successfully created.", Token=token});
    }

    [HttpPost("login")]
    public IActionResult LoginUser(User.User user)
    {
        if (!_repository.Exists(u => u.Mail == user.Mail)) {
            return BadRequest(new {message=$"User with '{user.Mail}' mail does not exist."});
        }
        var token = _authService.GenerateToken(user);
        return Ok(new {message="User successfully logged in.",Token=token});
    } 
}
