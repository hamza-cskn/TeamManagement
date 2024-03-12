namespace backend.User;

public enum UserPermission
{
    CreateIssue,
    DeleteIssue,
    CloseIssue,
    AssignMembersToIssue,
    RemoveMembersFromIssue,
    AddCommentToIssue,
    DeleteCommentFromIssue,
    DeleteCommentFromIssueByOtherUser
}
