import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import Skeleton from './Skeleton'; // Import Skeleton component

const API_URL = 'http://localhost:5105'; // Backend API URL

function NotesDashboard({ token, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoadingNotes, setIsLoadingNotes] = useState(true); // Added loading state
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchNotes = useCallback(async () => {
    setIsLoadingNotes(true);
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/notes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else if (response.status === 401) {
        addToast('Session expired. Please login again.', 'error');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const errorData = await response.json();
        addToast(errorData.message || 'Failed to fetch notes.', 'error');
        console.error('Failed to fetch notes:', response.statusText);
      }
    } catch (error) {
      addToast('An error occurred while fetching notes.', 'error');
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoadingNotes(false);
    }
  }, [navigate, addToast, token]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      addToast('Title and content cannot be empty.', 'warning');
      return;
    }
    setIsSubmittingNote(true);
    try {
      const response = await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes(prevNotes => [newNote, ...prevNotes]);
        setTitle('');
        setContent('');
        addToast('Note created successfully!', 'success');
      } else if (response.status === 401) {
        addToast('Session expired. Please login again.', 'error');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const errorData = await response.json();
        addToast(errorData.message || 'Failed to create note.', 'error');
        console.error('Failed to create note:', response.statusText);
      }
    } catch (error) {
      addToast('An error occurred while creating the note.', 'error');
      console.error('Error creating note:', error);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    addToast('Logged out successfully.', 'info');
    navigate('/login');
  };

  const handleEditNote = async (id) => {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      // Call the API to update the note
      try {
        const response = await fetch(`${API_URL}/api/notes/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ title: noteToEdit.title, content: noteToEdit.content }),
        });
        if (response.ok) {
          addToast('Note updated successfully!', 'success');
          fetchNotes(); // Refresh the notes list
        } else {
          const errorData = await response.json();
          addToast(errorData.message || 'Failed to update note.', 'error');
        }
      } catch (error) {
        addToast('An error occurred while updating the note.', 'error');
      }
    }
  };

  const handleViewNote = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/notes/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const noteToView = await response.json();
        // You can add logic to open a view modal or navigate to a view page
        console.log('Viewing note:', noteToView);
      } else {
        const errorData = await response.json();
        addToast(errorData.message || 'Failed to fetch note details.', 'error');
      }
    } catch (error) {
      addToast('An error occurred while fetching the note.', 'error');
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await fetch(`${API_URL}/api/notes/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          addToast('Note deleted successfully!', 'success');
          fetchNotes(); // Refresh the notes list
        } else {
          const errorData = await response.json();
          addToast(errorData.message || 'Failed to delete note.', 'error');
        }
      } catch (error) {
        addToast('An error occurred while deleting the note.', 'error');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Your Document Notes</h2>
        <button onClick={handleLogout} className="logout">Sign Out</button>
      </div>
      
      <section className="create-note-form">
        <h3>Create New Note</h3>
        <form onSubmit={handleCreateNote}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmittingNote}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              placeholder="Enter note content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              required
              disabled={isSubmittingNote}
            ></textarea>
          </div>
          
          <button type="submit" disabled={isSubmittingNote}>
            {isSubmittingNote ? 'Creating...' : 'Save Note'}
          </button>
        </form>
        
        {error && <p className="error">{error}</p>}
      </section>

      <section>
        <h3>{notes.length > 0 ? 'Your Notes' : ''}</h3>
        <div className="note-list">
          {isLoadingNotes ? (
            <div className="notes-grid">
              <Skeleton type="note" />
              <Skeleton type="note" />
              <Skeleton type="note" />
            </div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <p>You don't have any notes yet.</p>
              <p>Create your first note using the form above!</p>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <div key={note.id} className="note-item">
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <small>Created: {new Date(note.createdAt).toLocaleString()}</small>
                  <div className="note-actions">
                    <button onClick={() => handleEditNote(note.id)} className="action-button edit">Edit</button>
                    <button onClick={() => handleViewNote(note.id)} className="action-button view">View</button>
                    <button onClick={() => handleDeleteNote(note.id)} className="action-button delete">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default NotesDashboard;