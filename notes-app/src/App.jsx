import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import NotesDashboard from './components/NotesDashboard';
import { ToastProvider } from './context/ToastContext';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // On initial load, check if a token and user data exist in local storage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken) {
      setToken(storedToken);
    }
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }, []);

  const handleLoginSuccess = (newToken, userData) => {
    if (!newToken) {
      return;
    }
    
    // Store the token and user data
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <ToastProvider>
      <div>
        <header className="app-header">
          <h1>
            <img src="/document-notes-icon.svg" alt="DocumentMind Logo" className="app-logo" />
            DocumentMind
          </h1>
          {user && (
            <div className="user-profile">
              <span className="username">Welcome, {user.username}</span>
            </div>
          )}
        </header>
        
        <main className="app-container">
          {token ? (
            <NotesDashboard token={token} user={user} onLogout={handleLogout} />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )}
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;