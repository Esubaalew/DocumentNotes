using NotesApi.Models;

namespace NotesApi.Data;

public static class DbInitializer
{
    public static void Initialize(ApplicationDbContext context)
    {
        context.Database.EnsureCreated();

        if (context.Users.Any())
        {
            return;
        }

        var users = new User[]
        {
            new User { Username = "demo", Password = "demo123" },
            new User { Username = "test", Password = "test123" },
            new User { Username = "abebe", Password = "abebe123" }
        };

        context.Users.AddRange(users);
        context.SaveChanges();

        var notes = new Note[]
        {
            new Note
            {
                Title = "Welcome Note",
                Content = "Welcome to your notes application! This is a demo note.",
                CreatedAt = DateTime.UtcNow,
                UserId = users[0].Id
            },
            new Note
            {
                Title = "Shopping List",
                Content = "1. Milk\n2. Bread\n3. Eggs",
                CreatedAt = DateTime.UtcNow,
                UserId = users[0].Id
            },
            new Note
            {
                Title = "Meeting Notes",
                Content = "Important points from today's meeting:\n- Project timeline\n- Team assignments\n- Next steps",
                CreatedAt = DateTime.UtcNow,
                UserId = users[1].Id
            },
            // C# related notes for abebe
            new Note
            {
                Title = "C# Best Practices",
                Content = "Key C# Best Practices:\n1. Use async/await for I/O operations\n2. Implement IDisposable pattern correctly\n3. Use string interpolation over concatenation\n4. Follow SOLID principles\n5. Use nullable reference types",
                CreatedAt = DateTime.UtcNow,
                UserId = users[2].Id
            },
            new Note
            {
                Title = "C# Design Patterns",
                Content = "Common C# Design Patterns:\n1. Singleton - Ensure a class has only one instance\n2. Factory - Create objects without specifying exact class\n3. Repository - Abstract data access\n4. Observer - Subscribe to events\n5. Strategy - Define family of algorithms",
                CreatedAt = DateTime.UtcNow,
                UserId = users[2].Id
            },
            new Note
            {
                Title = "C# Performance Tips",
                Content = "Performance Optimization Tips:\n1. Use StringBuilder for string concatenation\n2. Implement proper caching strategies\n3. Use value types when appropriate\n4. Profile your code before optimizing\n5. Consider memory allocation patterns",
                CreatedAt = DateTime.UtcNow,
                UserId = users[2].Id
            }
        };

        context.Notes.AddRange(notes);
        context.SaveChanges();
    }
} 