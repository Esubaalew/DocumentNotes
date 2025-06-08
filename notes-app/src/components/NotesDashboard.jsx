import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { getNotes, createNote, updateNote, deleteNote } from '../services/noteService';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import ActionButton from './ActionButton';
import Skeleton from './Skeleton';

const NotesDashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const { addToast } = useToast();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await getNotes();
      
      console.log('Notes data from API:', data);
      
      // Validate and sanitize the notes data based on C# API response
      const validatedNotes = Array.isArray(data) ? data.map(note => ({
        id: note.id,
        title: note.title || 'Untitled Note',
        content: note.content || '',
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      })) : [];
      
      setNotes(validatedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      addToast(error.message || 'Failed to fetch notes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    try {
      if (!formData.title.trim()) {
        addToast('Title is required', 'warning');
        return;
      }

      await createNote({
        title: formData.title,
        content: formData.content
      });
      addToast('Note created successfully', 'success');
      setFormData({ title: '', content: '' });
      setIsModalOpen(false);
      fetchNotes();
    } catch (error) {
      addToast(error.message || 'Failed to create note', 'error');
    }
  };

  const handleUpdateNote = async () => {
    try {
      if (!formData.title.trim()) {
        addToast('Title is required', 'warning');
        return;
      }

      await updateNote(selectedNote.id, {
        title: formData.title,
        content: formData.content
      });
      addToast('Note updated successfully', 'success');
      setFormData({ title: '', content: '' });
      setSelectedNote(null);
      setIsModalOpen(false);
      fetchNotes();
    } catch (error) {
      addToast(error.message || 'Failed to update note', 'error');
    }
  };

  const handleDeleteNote = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await deleteNote(id);
      addToast('Note deleted successfully', 'success');
      fetchNotes();
    } catch (error) {
      addToast(error.message || 'Failed to delete note', 'error');
    }
  };

  const openCreateModal = () => {
    setSelectedNote(null);
    setFormData({ title: '', content: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (note) => {
    setSelectedNote(note);
    setFormData({ title: note.title, content: note.content });
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Unknown date';
    }
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
        <div className="fixed bottom-8 right-8">
          <ActionButton
            icon={<FaPlus />}
            type="primary"
            onClick={openCreateModal}
            ariaLabel="Create new note"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton type="card" count={6} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No notes yet. Create your first note by clicking the + button.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{note.title}</h3>
                  <div className="text-gray-600 mb-4 h-24 overflow-hidden">
                    {note.content}
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{formatDate(note.updatedAt || note.createdAt)}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(note)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label="Edit note"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Delete note"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedNote ? 'Edit Note' : 'Create New Note'}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary-200"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary-200 min-h-[150px]"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
                onClick={selectedNote ? handleUpdateNote : handleCreateNote}
              >
                {selectedNote ? 'Save Changes' : 'Create Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesDashboard;
