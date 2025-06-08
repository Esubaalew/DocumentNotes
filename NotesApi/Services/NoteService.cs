using Microsoft.EntityFrameworkCore;
using NotesApi.Data;
using NotesApi.Models;

namespace NotesApi.Services;

public interface INoteService
{
    Task<IEnumerable<Note>> GetNotesByUserId(int userId);
    Task<Note?> GetNoteById(int id);
    Task<Note> CreateNote(Note note);
    Task<Note> UpdateNote(Note note);
    Task DeleteNote(int id);
}

public class NoteService : INoteService
{
    private readonly ApplicationDbContext _context;

    public NoteService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Note>> GetNotesByUserId(int userId)
    {
        return await _context.Notes
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<Note?> GetNoteById(int id)
    {
        return await _context.Notes.FindAsync(id);
    }

    public async Task<Note> CreateNote(Note note)
    {
        note.CreatedAt = DateTime.UtcNow;
        _context.Notes.Add(note);
        await _context.SaveChangesAsync();
        return note;
    }

    public async Task<Note> UpdateNote(Note note)
    {
        var existingNote = await _context.Notes.FindAsync(note.Id);
        if (existingNote == null)
            throw new KeyNotFoundException($"Note with ID {note.Id} not found");

        existingNote.Title = note.Title;
        existingNote.Content = note.Content;
        existingNote.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return existingNote;
    }

    public async Task DeleteNote(int id)
    {
        var note = await _context.Notes.FindAsync(id);
        if (note == null)
            throw new KeyNotFoundException($"Note with ID {id} not found");

        _context.Notes.Remove(note);
        await _context.SaveChangesAsync();
    }
} 