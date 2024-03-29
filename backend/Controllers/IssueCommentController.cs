using backend.Issue;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

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
    public IActionResult CreateComment(string issueId, Comment comment)
    {
        if (!Guid.TryParse(issueId, out Guid issueGuid))
            return BadRequest(new {message="Requested url does not represent a valid GUID: " + issueId});
        
        comment.Id = Guid.NewGuid();
        _repository.Insert(issueGuid, comment);
        return Ok(new{message="Comment successfully created.", comment=comment});
    }
    
    [Authorize]
    [HttpGet]
    public IActionResult GetAll(string issueId)
    {
        if (!Guid.TryParse(issueId, out Guid issueGuid))
            return BadRequest(new {message="Requested url does not represent a valid GUID: " + issueId});
        
        var issueComments = _repository.Load(issueGuid);

        List<Comment> comments = issueComments == null ? new List<Comment>() : issueComments.Comments;
        Console.WriteLine(comments.ToJson());
        var result = comments.Select<Comment, Object>(c =>
        {
            var id = c.Id;
            var content = c.Content;
            var writer = c.Writer;
            return new { id, content, writer };
        });
        return Ok(new{comments=result});
    }
    
    [Authorize]
    [HttpPut("{id}")]
    public IActionResult UpdateComment(string issueId, string id, Comment comment)
    {
        if (!Guid.TryParse(id, out Guid guid))
            return BadRequest(new {message="Requested url does not represent a valid GUID: " + id});
        
        if (!Guid.TryParse(issueId, out Guid issueGuid))
            return BadRequest(new {message="Requested url does not represent a valid GUID: " + issueId});

        comment.Id = guid;
        bool success = _repository.Update(issueGuid, comment);
        if (!success)
            return BadRequest(new {message="An error occurred while updating the comment."});
        return Ok(new{message="Comment successfully updated."});
    }
}