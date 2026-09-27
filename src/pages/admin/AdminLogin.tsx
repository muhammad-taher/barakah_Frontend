import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // CAPTCHA State
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  const navigate = useNavigate();

  // Generate new math captcha on load
  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaInput('');
    setCaptchaError(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verify CAPTCHA
    if (parseInt(captchaInput) !== num1 + num2) {
      setCaptchaError(true);
      generateCaptcha();
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/auth/login`, {
        username,
        password
      });
      localStorage.setItem('admin_token', res.data.access_token);
      navigate('/secure-hq/dashboard');
    } catch (err) {
      alert('Login failed. Please check credentials.');
      generateCaptcha();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          
          {/* CAPTCHA Field */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Security Verification</label>
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 border border-gray-300 rounded-md font-mono text-lg font-bold select-none text-gray-700">
                {num1} + {num2} =
              </div>
              <input 
                required 
                type="number" 
                value={captchaInput} 
                onChange={e => {
                  setCaptchaInput(e.target.value);
                  setCaptchaError(false);
                }} 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg" 
                placeholder="?"
              />
            </div>
            {captchaError && <p className="text-red-500 text-xs font-semibold mt-2">Incorrect answer. Please try again.</p>}
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
