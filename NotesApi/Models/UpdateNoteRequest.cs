using System.ComponentModel.DataAnnotations;

namespace NotesApi.Models
{
    public class UpdateNoteRequest
    {
        [Required]
        public string? Title { get; set; }

        [Required]
        public string? Content { get; set; }
    }
} 