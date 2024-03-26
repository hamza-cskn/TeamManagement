using backend.Auth;
using backend.Chat;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        var room = new ChatRoom(createRoomDto.Name, createRoomDto.Participants);
        _repository.Insert(room);
        return Ok(new{roomId=room.Id});
    }
    
    [Authorize]
    [HttpGet]
    public IActionResult GetRooms(Guid? userId)
    {
        if (userId == null)
            return BadRequest(new { message = "userId needed in parameter options to fetch rooms." });
        var header = Request.Headers.Authorization.ToString();
        var badResponse = VerifyUser(header, userId.Value.ToString());
        if (badResponse != null)
            return badResponse;

        var rooms = _repository.LoadByUserId(userId.Value);
        return Ok(new{chatRooms=rooms});
    }

    private IActionResult? VerifyUser(string header, string userId)
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
        
        if (!id.Equals(userId))
            return Unauthorized(new { message = "You cannot fetch chat rooms of others." });
        
        return null;
    }
    
}