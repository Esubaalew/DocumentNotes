using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NotesApi.Data;
using NotesApi.Models;
using NotesApi.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace NotesApi.Tests;

public class AuthServiceTests
{
    private ApplicationDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "AuthServiceTestDb")
            .Options;
        var context = new ApplicationDbContext(options);
        context.Users.AddRange(new List<User>
        {
            new User { Username = "demo", Password = "demo123" },
            new User { Username = "test", Password = "test123" }
        });
        context.SaveChanges();
        return context;
    }

    private IConfiguration GetConfig()
    {
        var inMemorySettings = new Dictionary<string, string> {
            { "Jwt:Key", "test-key-test-key-test-key-test-key-1234" },
            { "Jwt:Issuer", "test-issuer" },
            { "Jwt:Audience", "test-audience" }
        };
        return new ConfigurationBuilder().AddInMemoryCollection(inMemorySettings).Build();
    }

    [Fact]
    public async Task ValidateUser_ReturnsToken_ForValidCredentials()
    {
        var context = GetDbContext();
        var config = GetConfig();
        var service = new AuthService(context, config);

        var (success, token) = await service.ValidateUser("demo", "demo123");

        Assert.True(success);
        Assert.False(string.IsNullOrEmpty(token));
    }

    [Fact]
    public async Task ValidateUser_Fails_ForInvalidCredentials()
    {
        var context = GetDbContext();
        var config = GetConfig();
        var service = new AuthService(context, config);

        var (success, token) = await service.ValidateUser("demo", "wrongpass");

        Assert.False(success);
        Assert.True(string.IsNullOrEmpty(token));
    }
} 