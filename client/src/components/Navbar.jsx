import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className='flex justify-between items-center p-4 border'>
      <div className="p-1">
        <h1 className='text-4xl font-semibold text-purple-800'>TRAINING</h1>
      </div>
      <div className='flex items-center gap-3'>
        <NotificationsNoneIcon className='cursor-pointer'/>
        {user ? (
          <>
            <img src="https://cdn.pixabay.com/photo/2017/02/25/22/04/user-icon-2098873_1280.png" alt="profile" className="h-10 w-10 border p-1 rounded-full" />
            <span className='text-2xl font-light'>{user.username}</span>
            <button 
              onClick={handleLogout} 
              className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="text-blue-500">Login</Link>
        )}
      </div>
    </div>
  );
}
