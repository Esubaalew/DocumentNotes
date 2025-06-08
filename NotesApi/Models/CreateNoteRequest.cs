using System.ComponentModel.DataAnnotations;

namespace NotesApi.Models
{
    public class CreateNoteRequest
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Content { get; set; } = string.Empty;
    }
}