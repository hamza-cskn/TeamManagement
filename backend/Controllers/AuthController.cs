using backend.Auth;
using backend.Repositories;
using backend.User;
using Microsoft.AspNetCore.Authorization;
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

    [Authorize]
    [HttpPost("register")]
    public IActionResult RegisterUser(User.User user)
    {
        //todo mail regex check
        if (_repository.Exists(u => u.Mail == user.Mail))
            return BadRequest(new {message=$"User with '{user.Mail}' mail already exists."});
        
        if (user.Password == null)
            return BadRequest(new {message="Password cannot be null."});
        
        user.Id = Guid.NewGuid();
        _repository.Insert(user);
        return Ok(new {message="User successfully created."});
    }

    [HttpPost("login")]
    public IActionResult LoginUser(LoginDto loginDto)
    {
        //todo mail regex check, should i?
        var user = _repository.LoadByMail(loginDto.Mail);
        if (user == null)
            return BadRequest(new {message=$"User with '{loginDto.Mail}' mail does not exist."});

        if (user.Password != loginDto.Password) //todo hash passwords
            return BadRequest(new {message="Invalid password."});
        
        var token = _authService.GenerateToken(user);
        return Ok(new {message="User successfully logged in.",Token=token});
    } 
}
