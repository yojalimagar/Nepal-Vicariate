import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../utils/api';
import apiEndpoints from '../constants/apiEndpoints';

export default function Register({ setUser }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${getApiUrl()}${apiEndpoints.REGISTER}`, form, {
        headers: { 'Content-Type': 'application/json' },
      });

      setMessage('✅ Registration successful! Redirecting to login...');
      // Optionally set user or store data if backend returns user info
      setTimeout(() => {
        navigate('/login'); // Redirect to login page after success
      }, 2000); // Delay for user to see success message
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response) {
        // Backend returned an error response (e.g., 400, 500)
        setMessage(err.response.data.message || 'Registration failed. Please try again.');
      } else {
        // Network or other unexpected error
        setMessage('❌ An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow mt-10">
      <h2 className="text-2xl mb-4">Register</h2>
      {message && (
        <p className={`mb-4 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-orange-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}