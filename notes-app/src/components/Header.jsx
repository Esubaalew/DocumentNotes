import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary-700">DocumentMind</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">
            Welcome, {user?.username || 'User'}
          </span>
          <button
            onClick={logout}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
