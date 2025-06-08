using NotesApi.Models;
using System.Collections.Concurrent;

namespace NotesApi.Data
{
    public static class InMemoryDataStore
    {
        
        private static readonly ConcurrentDictionary<int, User> _users = new();
        private static readonly ConcurrentDictionary<int, Note> _notes = new();
        private static int _nextNoteId = 1;

        
        static InMemoryDataStore()
        {
            // Sample Users 
            _users.TryAdd(1, new User { Id = 1, Username = "user1", Password = "password1" });
            _users.TryAdd(2, new User { Id = 2, Username = "user2", Password = "password2" });

            // Sample Notes
            AddNote(new Note { Title = "User 1's First Note", Content = "This is a test note for user1.", UserId = 1 });
            AddNote(new Note { Title = "User 2's Shopping List", Content = "Milk, Bread, Cheese", UserId = 2 });
            AddNote(new Note { Title = "User 1's Work Reminders", Content = "Finish the report.", UserId = 1 });
        }

        
        public static User? GetUserByUsername(string username)
        {
            return _users.Values.FirstOrDefault(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase));
        }

        
        public static List<Note> GetNotesByUserId(int userId)
        {
            return _notes.Values.Where(n => n.UserId == userId).OrderByDescending(n => n.CreatedAt).ToList();
        }

        public static Note AddNote(Note note)
        {
            note.Id = Interlocked.Increment(ref _nextNoteId); // Thread-safe way to get the next ID
            note.CreatedAt = DateTime.UtcNow;
            _notes.TryAdd(note.Id, note);
            return note;
        }

        public static Note? GetNoteById(int id)
        {
            _notes.TryGetValue(id, out var note);
            return note;
        }

        public static void UpdateNote(Note note)
        {
            _notes.AddOrUpdate(note.Id, note, (key, oldValue) => note);
        }

        public static void DeleteNote(int id)
        {
            _notes.TryRemove(id, out _);
        }
    }
}