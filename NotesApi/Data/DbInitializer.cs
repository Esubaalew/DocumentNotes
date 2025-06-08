using NotesApi.Models;

namespace NotesApi.Data;

public static class DbInitializer
{
    public static void Initialize(ApplicationDbContext context)
    {
        // Ensure database is created
        context.Database.EnsureCreated();

        // Check if we already have data
        if (context.Users.Any())
        {
            return; // Database has been seeded
        }

        // Add demo users
        var users = new User[]
        {
            new User { Username = "demo", Password = "demo123" },
            new User { Username = "test", Password = "test123" }
        };

        context.Users.AddRange(users);
        context.SaveChanges();

        // Add demo notes
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
            }
        };

        context.Notes.AddRange(notes);
        context.SaveChanges();
    }
} 