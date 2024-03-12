using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace backend.Auth;

public class AuthService
{

    private readonly JwtOptions _jwtOptions;
    private readonly JwtSecurityTokenHandler _tokenHandler = new();

    public AuthService(JwtOptions jwtOptions)
    {
        _jwtOptions = jwtOptions;
    }

    public string GenerateToken(User.User user)
    {
        return GenerateToken(user, TimeSpan.FromDays(10000)); // todo get from config.
    }
    
    public string GenerateToken(User.User user, TimeSpan expiration)
    {
        var token = new JwtSecurityToken(
            issuer: _jwtOptions.Issuer,
            audience: _jwtOptions.Audience,
            claims: PrepareClaims(user),
            expires: DateTime.Now.Add(expiration),
            signingCredentials: PrepareCredentials(_jwtOptions.SigningKey));

        var rawToken = _tokenHandler.WriteToken(token);
        return rawToken;
    }

    private static SigningCredentials PrepareCredentials(string key)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var symmetricKey = new SymmetricSecurityKey(keyBytes);
        return new SigningCredentials(symmetricKey, SecurityAlgorithms.HmacSha256);
    }

    private IEnumerable<Claim> PrepareClaims(User.User user)
    {
        var claims = new List<Claim>
        {
            new("name", user.Name.Surname),
            new("username", user.Name.Surname),
            new("aud", _jwtOptions.Audience)
        };
    
        var roleClaims = user.Permissions
            .Select(p => new Claim("role", p.ToString()));
        claims.AddRange(roleClaims);
        return claims;
    }
}