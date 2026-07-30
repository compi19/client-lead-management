import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'Employee' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Send registration request to the backend
      await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage({ text: 'User registered successfully! ✅', type: 'success' });
      setFormData({ username: '', password: '', role: 'Employee' });
    } catch (error) {
      setMessage({ text: 'Registration failed! Please try again. ❌', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md border border-slate-200">
        {/* Header Section */}
        <div className="bg-[#0f172a] p-8 text-center text-white">
          <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-1">Admin Control</h2>
          <p className="text-slate-400 text-sm font-medium">Register new employees or administrators</p>
        </div>

        <div className="p-8">
          {/* Status Message */}
          {message.text && (
            <div className={`${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'} border p-3 rounded-xl mb-6 text-sm font-bold text-center`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">Username</label>
              <input 
                type="text" 
                value={formData.username}
                placeholder="e.g. admin"
                required
                className="w-full p-4 bg-blue-50/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium"
                onChange={(e) => setFormData({...formData, username: e.target.value.trim()})} 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">Password</label>
              <input 
                type="password" 
                value={formData.password}
                placeholder="••••••••"
                required
                className="w-full p-4 bg-blue-50/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium"
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">Role</label>
              <select 
                className="w-full p-4 bg-blue-50/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-bold appearance-none"
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all transform active:scale-95`}
            >
              {loading ? 'Registering...' : 'Register User'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;