using System.Text;
using backend.Auth;
using backend.Chat;
using backend.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

LoadDotEnv(".env");
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

var uri = Environment.GetEnvironmentVariable("MONGO_URI");
builder.Services.AddSingleton(new MongoClient(uri));

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "FrontendOrigins",
        policy  =>
            policy.WithOrigins("http://localhost:3000")
                .AllowAnyMethod()
                .AllowAnyHeader() // Allow all headers
                .AllowCredentials()
        );
});

builder.Services.AddSignalR();

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
app.MapHub<ChatHub>("/chathub");

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


static void LoadDotEnv(string filePath)
{
    if (!File.Exists(filePath))
        return;

    foreach (var line in File.ReadAllLines(filePath))
    {
        var parts = line.Split('=', StringSplitOptions.RemoveEmptyEntries);

        if (parts.Length != 2)
            continue;
        
        if (Environment.GetEnvironmentVariable(parts[0]) == null)
            Environment.SetEnvironmentVariable(parts[0], parts[1]);
    }
}

