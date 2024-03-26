using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
        if (user.Id == null)
            throw new Exception("unknown user id.");
        var claims = new List<Claim>
        {
            new("name", user.Name.Name),
            new("username", user.Name.Surname),
            new("id", user.Id.ToString()),
            new("aud", _jwtOptions.Audience)
        };
    
        var roleClaims = user.Permissions
            .Select(p => new Claim("role", p.ToString()));
        claims.AddRange(roleClaims);
        return claims;
    }
    
    public ClaimsPrincipal? ValidateToken(string token)
    {
        var tokenValidationParameters = GetJwtParameters(_jwtOptions);
        
        try
        {
            return _tokenHandler.ValidateToken(token, tokenValidationParameters, out _);
        }
        catch
        {
            return null;
        }
    }
    
    public static TokenValidationParameters GetJwtParameters(JwtOptions jwtOptions)
    {
        return new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey))
        };
    }
    
    public string? GetClaimValue(string token, string type) {
        var claims = ValidateToken(token);
        if (claims == null)
            return null;
        
        var claim = claims.Claims.FirstOrDefault(claim => claim.Type == type);
        if (claim == null)
            return null;

        return claim.Value;
    }
}