import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the backend signin route
      const response = await axios.post('http://localhost:5000/api/auth/signin', {
        email,
        password,
      });

      // Handle the response from the backend (e.g., store the JWT in localStorage)
      localStorage.setItem('token', response.data.token);
      console.log('Logged in successfully');
      navigate('/');

    } catch (err) {
      // Handle errors
      console.error(err.response.data.msg);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-[#00df9a] mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold mb-2 text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block font-bold mb-2 text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#00df9a] text-black px-4 py-2 rounded-lg hover:bg-[#00df9a]/90 transition-colors duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;