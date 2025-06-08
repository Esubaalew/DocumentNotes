import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getNotes, createNote, updateNote, deleteNote } from '../services/api';

const NotesDashboard = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      setError('Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpenModal = (note = null) => {
    if (note) {
      setCurrentNote(note);
      setFormData({ title: note.title, content: note.content });
    } else {
      setCurrentNote(null);
      setFormData({ title: '', content: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentNote(null);
    setFormData({ title: '', content: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentNote) {
        await updateNote(currentNote.id, formData);
      } else {
        await createNote(formData);
      }
      handleCloseModal();
      fetchNotes();
    } catch (err) {
      setError('Failed to save note');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(id);
        fetchNotes();
      } catch (err) {
        setError('Failed to delete note');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '2rem' }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1 style={{ fontSize: '1.875rem', fontWeight: '600' }}>My Notes</h1>
        <div className="flex gap-4">
          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            Add Note
          </button>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: 'var(--error-color)', 
          color: 'white', 
          padding: '0.75rem', 
          borderRadius: '0.375rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1rem' 
      }}>
        {notes.map((note) => (
          <div key={note.id} className="card">
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '0.5rem' 
            }}>
              {note.title}
            </h2>
            <p style={{ 
              color: '#64748b', 
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {note.content}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => handleOpenModal(note)} 
                className="btn btn-secondary"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(note.id)} 
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '1rem' 
            }}>
              {currentNote ? 'Edit Note' : 'Add Note'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label 
                  htmlFor="title" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  required
                  placeholder="Enter note title"
                />
              </div>
              <div>
                <label 
                  htmlFor="content" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="input"
                  required
                  placeholder="Enter note content"
                  style={{ 
                    minHeight: '150px', 
                    resize: 'vertical' 
                  }}
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary">
                  {currentNote ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  onClick={handleCloseModal} 
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesDashboard; 