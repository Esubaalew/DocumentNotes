import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On initial load, check if a token and user data exist in local storage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
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
    
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Attempting login for user:', username);
      const response = await fetch('http://localhost:5105/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          console.error('Login error data:', errorData);
          errorMessage = errorData || errorMessage;
        } catch (e) {
          // If not json, use text
          errorMessage = await response.text() || errorMessage;
          console.error('Login error text:', errorMessage);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Login successful, received token');
      
      // The backend only returns a token, no user data
      localStorage.setItem('token', data.token);
      
      // Store username as user data
      const userData = { username };
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('Setting token and user in state');
      setToken(data.token);
      setUser(userData);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
