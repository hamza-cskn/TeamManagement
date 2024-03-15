using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("issue")]
public class IssueController : ControllerBase
{

    private readonly IssueRepository _repository;
    private readonly IssueCommentRepository _commentRepository;

    public IssueController(IssueRepository repository, IssueCommentRepository commentRepository)
    {
        _repository = repository;
        _commentRepository = commentRepository;
    }

    [Authorize]
    [HttpPost]
    public IActionResult CreateIssue(Issue.Issue issue)
    {
        issue.Id = new Issue.Issue.IssueId(Guid.NewGuid());
        _repository.Insert(issue);
        return Ok(new{message="Issue successfully created.", issue=issue});
    }
    
    [Authorize]
    [HttpGet]
    public IActionResult GetAll() //todo should i get limit parameter?
    {
        return Ok(new{issues=_repository.LoadAll()});
    }
    
    [Authorize]
    [HttpGet("{id}")]
    public IActionResult Get(string id)
    {
        if (!Guid.TryParse(id, out Guid guid))
            return BadRequest(new {message="Requested url does not represent a valid GUID: " + id});
        
        Issue.Issue.IssueId issueId = new(guid);
        if (!_repository.Exists(issueId))
            return BadRequest(new {message="Issue with id " + id + " does not exist."});
        
        var issue = _repository.Load(issueId);
        return Ok(new{issue=issue});
    }
    
    [Authorize]
    [HttpPatch]
    public IActionResult UpdateIssue(Issue.Issue issue)
    {
        _repository.Update(issue);
        return Ok(new{message="Issue successfully updated."});
    }
    
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult DeleteIssue(string id)
    {
        if (!Guid.TryParse(id, out Guid guid))
            return BadRequest(new { message = "Requested url does not represent a valid GUID: " + id });
        
        Issue.Issue.IssueId issueId = new(guid);
        if (!_repository.Exists(issueId))
            return BadRequest(new {message="Issue with id " + id + " does not exist."});
        
        _repository.Delete(issueId);
        _commentRepository.Delete(issueId);
        return Ok(new{message="Issue successfully deleted."});
    }
}