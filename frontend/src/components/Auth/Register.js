import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



// Registration Component
const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleRegister = async () => {
      if (!username || !password || !email) {
        setError('All fields are required.');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const response = await axios.post('http://85.208.87.192:5001/register', {
          username,
          password,
          email,
        });
        alert(response.data.message);
        navigate('/login');
      } catch (error) {
        setError(error.response?.data?.message || 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full ${loading ? 'bg-blue-300' : 'bg-blue-500'} text-white p-2 rounded hover:bg-blue-600`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </div>
    );
  };

  export default Register;