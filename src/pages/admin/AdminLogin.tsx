import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/v1/auth/login', {
        username,
        password
      });
      localStorage.setItem('admin_token', res.data.access_token);
      navigate('/admin/dashboard');
    } catch (err) {
      alert('Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="mt-1 w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full p-2 border rounded-md" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
