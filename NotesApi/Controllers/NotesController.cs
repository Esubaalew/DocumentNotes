using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NotesApi.Models;
using NotesApi.Services;
using System.Security.Claims;

namespace NotesApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class NotesController : ControllerBase
    {
        private readonly INoteService _noteService;

        public NotesController(INoteService noteService)
        {
            _noteService = noteService;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotes()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var notes = await _noteService.GetNotesByUserId(userId.Value);
            return Ok(notes);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNote([FromBody] CreateNoteRequest createNoteRequest)
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
                CreatedAt = DateTime.UtcNow,
                UserId = userId.Value
            };

            var createdNote = await _noteService.CreateNote(note);
            return CreatedAtAction(nameof(GetNotes), new { id = createdNote.Id }, createdNote);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNote(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var note = await _noteService.GetNoteById(id);
            if (note == null || note.UserId != userId)
            {
                return NotFound();
            }

            return Ok(note);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(int id, [FromBody] UpdateNoteRequest updateNoteRequest)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var note = await _noteService.GetNoteById(id);
            if (note == null || note.UserId != userId)
            {
                return NotFound();
            }

            note.Title = updateNoteRequest.Title ?? note.Title;
            note.Content = updateNoteRequest.Content ?? note.Content;
            note.UpdatedAt = DateTime.UtcNow;

            var updatedNote = await _noteService.UpdateNote(note);
            return Ok(updatedNote);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var note = await _noteService.GetNoteById(id);
            if (note == null || note.UserId != userId)
            {
                return NotFound();
            }

            await _noteService.DeleteNote(id);
            return NoContent();
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