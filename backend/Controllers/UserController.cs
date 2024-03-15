using backend.Repositories;
using backend.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("users")]
public class UserController : ControllerBase
{
    private readonly UserRepository _repository;

    public UserController(UserRepository repository)
    {
        _repository = repository;
    }

    [Authorize]
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(new{users=_repository.LoadAll()});
    }
    
    [Authorize]
    [HttpGet("{id}")]
    public IActionResult Get(string id)
    {
        if (!Guid.TryParse(id, out Guid guid))
            return BadRequest(new {message="Requested url does not represent a valid GUID: " + id});
        
        UserId userId = new(guid);
        return Ok(new{users=_repository.Load(userId)});
    }
}