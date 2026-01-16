import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.adminLogin(credentials);
      if (response && response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please check your username and password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials and ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 font-sans py-12">
      <div className="max-w-[440px] w-full bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-fade-in-up">

        {/* --- HEADER BLOCK (FROM REFERENCE IMAGE) --- */}
        <div className="bg-[#1e40af] pt-10 pb-8 px-8 text-center text-white relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          <div className="relative z-10">
            <div className="w-20 h-20 bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 backdrop-blur-sm">
              <Lock className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight leading-none mb-2">Admin Portal</h1>
            <p className="text-sm font-bold text-blue-100 opacity-70 uppercase tracking-widest">NetTech India Placement</p>
          </div>
        </div>

        {/* --- FORM CONTENT --- */}
        <div className="p-8 sm:p-10">
          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center text-red-500 mb-8 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="font-semibold text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-widest">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  className="block w-full pl-14 pr-4 py-4 bg-[#eff6ff] border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-400"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-widest">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="block w-full pl-14 pr-4 py-4 bg-[#eff6ff] border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center bg-[#1d4ed8] text-white font-black py-5 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-800 active:scale-[0.98] uppercase tracking-[0.2em] text-xs ${isLoading ? 'opacity-70' : ''}`}
            >
              <span className="flex items-center gap-3">
                {isLoading ? 'Authenticating...' : 'Login to Dashboard'}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </span>
            </button>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-700 transition-colors flex items-center justify-center mx-auto gap-2 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Main Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;