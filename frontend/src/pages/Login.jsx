import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, KeyRound, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  const handleQuickLogin = async (quickEmail) => {
    setLoading(true);
    setError('');
    setEmail(quickEmail);
    setPassword('password');
    
    const result = await login(quickEmail, 'password');
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background blobs for visual interest */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md z-10">
        {/* Brand Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-purple-600 p-3.5 rounded-2xl text-white shadow-xl shadow-purple-500/20 mb-4 animate-bounce">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome to PulseDesk</h2>
          <p className="text-sm text-slate-400 mt-2">Sign in to your organization support portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/80 backdrop-blur-md">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full bg-slate-950 border border-slate-800/85 hover:border-slate-700/80 focus:border-purple-500 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <KeyRound className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800/85 hover:border-slate-700/80 focus:border-purple-500 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-3 px-4 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Login Helper Section for Judges */}
          <div className="mt-8 pt-6 border-t border-slate-800/60">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center mb-4">Demo Quick Login</h4>
            
            <div className="space-y-4">
              {/* Org A Group */}
              <div>
                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2">Org A: Acme Corp</p>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => handleQuickLogin('admin@orga.test')}
                    className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] rounded-lg text-slate-300 font-semibold cursor-pointer transition-colors"
                  >
                    Admin
                  </button>
                  <button 
                    onClick={() => handleQuickLogin('agent1@orga.test')}
                    className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] rounded-lg text-slate-300 font-semibold cursor-pointer transition-colors"
                  >
                    Agent
                  </button>
                  <button 
                    onClick={() => handleQuickLogin('customer1@orga.test')}
                    className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] rounded-lg text-slate-300 font-semibold cursor-pointer transition-colors"
                  >
                    Customer
                  </button>
                </div>
              </div>

              {/* Org B Group */}
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2">Org B: Globex Corp</p>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => handleQuickLogin('admin@orgb.test')}
                    className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] rounded-lg text-slate-300 font-semibold cursor-pointer transition-colors"
                  >
                    Admin
                  </button>
                  <button 
                    onClick={() => handleQuickLogin('agent1@orgb.test')}
                    className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] rounded-lg text-slate-300 font-semibold cursor-pointer transition-colors"
                  >
                    Agent
                  </button>
                  <button 
                    onClick={() => handleQuickLogin('customer1@orgb.test')}
                    className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] rounded-lg text-slate-300 font-semibold cursor-pointer transition-colors"
                  >
                    Customer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
