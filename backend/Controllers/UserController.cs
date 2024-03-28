using backend.Repositories;
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
    { var result = _repository.LoadAll();
        var cleanList = result.ConvertAll(user =>
        {
            user.Password =  null;
            return user;
        });
        return Ok(new{users=cleanList});
    }
    
    [Authorize]
    [HttpGet("{id}")]
    public IActionResult Get(string id)
    {
        if (!Guid.TryParse(id, out Guid guid))
            return BadRequest(new {message="Requested url does not represent a valid GUID: " + id});

        var result = _repository.Load(guid);
        result.Password = null;
        return Ok(new{users=result});
    }
}