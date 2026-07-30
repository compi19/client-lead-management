import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Send the login request to the backend API
      const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
      
      // 2. Persist essential auth data (Token, Username, Role) in LocalStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', res.data.username);
      localStorage.setItem('role', res.data.role); // Role is crucial for routing and permissions

      // 3. Redirect the user based on their assigned role
      if (res.data.role === 'Admin') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/employee-dashboard';
      }

    } catch (error) {
      // Catch and display login errors
      const errorMessage = error.response?.data?.message || "Invalid credentials! ❌";
      alert(errorMessage);
      console.error("Login Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-sm">
        {/* Login Card Container */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-200">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">
              Login
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">Enter your details to access the Lead Pro system</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">Username</label>
              <input 
                type="text" 
                placeholder="e.g. melkamu" 
                required
                className="w-full p-4 border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                onChange={(e) => setCredentials({...credentials, username: e.target.value.trim()})} 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                className="w-full p-4 border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-95`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;