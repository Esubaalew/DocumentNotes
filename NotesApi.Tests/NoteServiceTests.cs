using Microsoft.EntityFrameworkCore;
using NotesApi.Data;
using NotesApi.Models;
using NotesApi.Services;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace NotesApi.Tests;

public class NoteServiceTests
{
    private ApplicationDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "NoteServiceTestDb")
            .Options;
        var context = new ApplicationDbContext(options);
        context.Users.Add(new User { Username = "demo", Password = "demo123" });
        context.SaveChanges();
        return context;
    }

    [Fact]
    public async Task GetNotesByUserId_ReturnsOnlyUserNotes()
    {
        var context = GetDbContext();
        var service = new NoteService(context);
        var user = context.Users.First();
        var note1 = new Note { Title = "Note 1", Content = "Content 1", CreatedAt = DateTime.UtcNow, UserId = user.Id };
        var note2 = new Note { Title = "Note 2", Content = "Content 2", CreatedAt = DateTime.UtcNow, UserId = user.Id };
        context.Notes.AddRange(note1, note2);
        context.SaveChanges();

        var notes = await service.GetNotesByUserId(user.Id);

        Assert.Equal(2, notes.Count);
        Assert.All(notes, n => Assert.Equal(user.Id, n.UserId));
    }

    [Fact]
    public async Task GetNoteById_ReturnsCorrectNote()
    {
        var context = GetDbContext();
        var service = new NoteService(context);
        var user = context.Users.First();
        var note = new Note { Title = "Test Note", Content = "Test Content", CreatedAt = DateTime.UtcNow, UserId = user.Id };
        context.Notes.Add(note);
        context.SaveChanges();

        var retrievedNote = await service.GetNoteById(note.Id);

        Assert.NotNull(retrievedNote);
        Assert.Equal(note.Title, retrievedNote.Title);
        Assert.Equal(note.Content, retrievedNote.Content);
    }

    [Fact]
    public async Task CreateNote_AddsNoteToDatabase()
    {
        var context = GetDbContext();
        var service = new NoteService(context);
        var user = context.Users.First();
        var note = new Note { Title = "New Note", Content = "New Content", CreatedAt = DateTime.UtcNow, UserId = user.Id };

        var createdNote = await service.CreateNote(note);

        Assert.NotNull(createdNote);
        Assert.Equal(note.Title, createdNote.Title);
        Assert.Equal(note.Content, createdNote.Content);
        Assert.Equal(user.Id, createdNote.UserId);
    }

    [Fact]
    public async Task UpdateNote_ModifiesExistingNote()
    {
        var context = GetDbContext();
        var service = new NoteService(context);
        var user = context.Users.First();
        var note = new Note { Title = "Original Title", Content = "Original Content", CreatedAt = DateTime.UtcNow, UserId = user.Id };
        context.Notes.Add(note);
        context.SaveChanges();

        note.Title = "Updated Title";
        note.Content = "Updated Content";
        note.UpdatedAt = DateTime.UtcNow;

        var updatedNote = await service.UpdateNote(note);

        Assert.NotNull(updatedNote);
        Assert.Equal("Updated Title", updatedNote.Title);
        Assert.Equal("Updated Content", updatedNote.Content);
        Assert.NotNull(updatedNote.UpdatedAt);
    }

    [Fact]
    public async Task DeleteNote_RemovesNoteFromDatabase()
    {
        var context = GetDbContext();
        var service = new NoteService(context);
        var user = context.Users.First();
        var note = new Note { Title = "Note to Delete", Content = "Content to Delete", CreatedAt = DateTime.UtcNow, UserId = user.Id };
        context.Notes.Add(note);
        context.SaveChanges();

        await service.DeleteNote(note.Id);

        var deletedNote = await service.GetNoteById(note.Id);
        Assert.Null(deletedNote);
    }
} 