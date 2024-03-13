using System.Text;
using backend.Auth;
using backend.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<UserRepository>();
builder.Services.AddSingleton<IssueRepository>();
builder.Services.AddSingleton<AuthService>();
builder.Services.AddSingleton(builder.Configuration);
builder.Services.AddSingleton<IssueCommentRepository>();

var jwtOptions = builder.Configuration.GetSection("JwtOptions").Get<JwtOptions>()!;
builder.Services.AddSingleton(jwtOptions);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opts => PrepareJwtOptions(jwtOptions, opts));
builder.Services.AddAuthorization();

builder.Services.AddSingleton(new MongoClient("mongodb://root:secret@localhost:27017/"));

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "FrontendOrigins",
        policy  =>
            policy.WithOrigins("http://localhost:3000")
                .AllowAnyMethod()
                .AllowAnyHeader() // Allow all headers
        );
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("FrontendOrigins");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

static void PrepareJwtOptions(JwtOptions jwtOptions, JwtBearerOptions opts)
{
    opts.TokenValidationParameters = new TokenValidationParameters
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
