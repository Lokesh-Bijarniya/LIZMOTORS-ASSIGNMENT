import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import { Link } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth(); // Use the register function from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ email, password });
      // Redirect or show a success message
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return(
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Register
          </button>

          <div className='text-center'>OR</div>

          
          <div className='text-center'>
          <Link to='/login'>Create a new account ? <span className='text-blue-700'>LogIn</span></Link>
         </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
