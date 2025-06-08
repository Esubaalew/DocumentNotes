using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NotesApi.Data;
using NotesApi.Models;
using System.Security.Claims;

namespace NotesApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class NotesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetNotes()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var notes = InMemoryDataStore.GetNotesByUserId(userId.Value);
            return Ok(notes);
        }

        [HttpPost]
        public IActionResult CreateNote([FromBody] CreateNoteRequest createNoteRequest)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var note = new Note
            {
                Title = createNoteRequest.Title,
                Content = createNoteRequest.Content,
                UserId = userId.Value
            };

            var createdNote = InMemoryDataStore.AddNote(note);
            return CreatedAtAction(nameof(GetNotes), new { id = createdNote.Id }, createdNote);
        }

        private int? GetCurrentUserId()
        {
            // First try the custom UserId claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            
            // If not found, try the NameIdentifier claim
            if (userIdClaim == null)
            {
                userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            }
            
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }
            
            return null;
        }
    }
}