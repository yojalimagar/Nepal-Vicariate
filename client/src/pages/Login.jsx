import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getApiUrl } from '../utils/api'; // Ensure this uses environment variables
import apiEndpoints  from '../constants/apiEndpoints'; // New: Centralized API endpoints

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New: Loading state
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setIsLoading(true); // Start loading

    try {
      const res = await fetch(`${getApiUrl()}${apiEndpoints.LOGIN}`, { // Use getApiUrl and constant
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Login successful!'); // More descriptive success message

        localStorage.clear(); // Good for clearing old state
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);

        // Consolidated navigation logic
        if (data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (data.user.role === 'editor') {
          navigate('/editor/dashboard');
        } else {
          navigate('/dashboard'); // Default navigation for other roles
        }
      } else {
        setMessage(data.message || 'Login failed. Please check your credentials.'); // More specific error message
      }
    } catch (err) {
      console.error('Login error:', err); // Log the actual error for debugging
      setMessage('❌ An unexpected error occurred. Please try again later.'); // Generic user-friendly error
    } finally {
      setIsLoading(false); // End loading
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow mt-10">
      <h2 className="text-2xl mb-4">Login</h2>
      {message && <p className={`mb-4 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
      <form onSubmit={handleSubmit}>
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
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? 'Logging In...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{' '}
        <Link to="/register" className="text-orange-500 hover:underline">
          Register
        </Link>
      </p>
      <p className="mt-2 text-center text-sm">
        <Link to="/forgot-password" className="text-orange-500 hover:underline">
          Forgot Password?
        </Link>
      </p>
    </div>
  );
}