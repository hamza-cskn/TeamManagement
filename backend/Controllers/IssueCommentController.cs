using backend.Issue;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("issue/{issueId}/comments")]
public class IssueCommentController : ControllerBase
{
    private IssueCommentRepository _repository;

    public IssueCommentController(IssueCommentRepository repository)
    {
        _repository = repository;
    }
    
    [Authorize]
    [HttpPost]
    public IActionResult CreateComment(string issueId, IssueComment comment)
    {
        if (!Guid.TryParse(issueId, out Guid issueGuid))
            return BadRequest(new {message="Requested url does not represent a valid GUID: " + issueId});
        
        var issueIdentifier = new Issue.Issue.IssueId(issueGuid);
        comment.Id = new IssueCommentId(Guid.NewGuid());
        _repository.Insert(issueIdentifier, comment);
        return Ok(new{message="Comment successfully created.", comment=comment});
    }
    
    [Authorize]
    [HttpGet]
    public IActionResult GetAll(Issue.Issue.IssueId issueId)
    {
        var comments = _repository.Load(issueId).Comments;
        return Ok(new{comments=comments});
    }
    
    [Authorize]
    [HttpPut("{id}")]
    public IActionResult UpdateComment(string issueId, string id, IssueComment comment)
    {
        if (!Guid.TryParse(id, out Guid guid))
            return BadRequest(new {message="Requested url does not represent a valid GUID: " + id});
        
        if (!Guid.TryParse(issueId, out Guid issueGuid))
            return BadRequest(new {message="Requested url does not represent a valid GUID: " + issueId});
        
        comment.Id = new IssueCommentId(guid);
        var issueIdentifier = new Issue.Issue.IssueId(issueGuid);
        _repository.Update(issueIdentifier, comment);
        return Ok(new{message="Comment successfully updated."});
    }
}