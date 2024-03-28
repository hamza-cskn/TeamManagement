using backend.Auth;
using backend.Chat;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OneOf;

namespace backend.Controllers;

[ApiController]
[Route("chat")]
public class ChatController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly ChatRoomRepository _repository;
    private readonly AuthService _authService;

    public ChatController(ILogger<AuthController> logger, ChatRoomRepository repository, AuthService authService)
    {
        _logger = logger;
        _repository = repository;
        _authService = authService;
    }
    
    [Authorize]
    [HttpPost]
    public IActionResult CreateRoom(CreateRoomDto createRoomDto)
    {
        var header = Request.Headers.Authorization.ToString();
        var result = GetUserIdOfRequest(header);
        if (result.TryPickT0(out var badResponse, out var id))
            return badResponse;
        
        if (!createRoomDto.Participants.Contains(Guid.Parse(id)))
            return Unauthorized(new { message = "You cannot create a room without yourself." });
        
        var room = new ChatRoom(createRoomDto.Name, createRoomDto.Type, createRoomDto.Participants);
        _repository.Insert(room);
        return Ok(new{room=room});
    }
    
    [Authorize]
    [HttpGet]
    public IActionResult GetRooms()
    {
        var header = Request.Headers.Authorization.ToString();
        var result = GetUserIdOfRequest(header);
        if (result.TryPickT0(out var badResponse, out var id))
            return badResponse;
        
        if (Guid.TryParse(id, out var guid))
            return BadRequest(new { message = $"{id} is not a valid GUID." });

        var rooms = _repository.LoadByUserId(guid);
        return Ok(new{chatRooms=rooms});
    }

    private OneOf<IActionResult, string> GetUserIdOfRequest(string header)
    {
        if (header.Length == 0)
            return BadRequest(new { message = "No token found." });

        var parts = header.Split(" ");
        if (parts.Length != 2)
            return BadRequest(new { message = "Authorization header invalid." });

        if (!parts[0].Equals("Bearer"))
            return BadRequest(new { message = "Authorization header invalid." });
        
        var id = _authService.GetClaimValue(parts[1], "id");
        if (id == null)
            return BadRequest(new { message = "Id could not find in token or token was invalid." });
        return id;
    }
    
}