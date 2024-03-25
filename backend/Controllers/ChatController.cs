using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("chat")]
public class ChatController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly ChatMessageRepository _repository;
    private readonly ChatRoomRepository _authService;

    public ChatController(ILogger<AuthController> logger, ChatMessageRepository repository, ChatRoomRepository authService)
    {
        _logger = logger;
        _repository = repository;
        _authService = authService;
    }
    
    [Authorize]
    [HttpGet("{id}/messages")]
    public IActionResult GetMessages(Guid id, int? count, DateTime? minDate, DateTime? maxDate)
    {
        if (count == null || count < 0)
            count = Int32.MaxValue;
        var messages = _repository.LoadLast(id, (int) count, null, minDate, maxDate);
        return Ok(new{messages=messages});
    }

}