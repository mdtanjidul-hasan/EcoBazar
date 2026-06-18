import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Lock, User as UserIcon, RefreshCw, Star } from 'lucide-react';

interface AuthViewProps {
  navigate: (path: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ navigate }) => {
  const { signIn, signUp, loading } = useStore();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Forms states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'delivery' | 'user'>('user');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password || (activeTab === 'signup' && !name)) {
      setErrorMsg('Please specify all required fields.');
      return;
    }

    try {
      if (activeTab === 'signin') {
        const u = await signIn(email, password);
        console.log('Login successful', u);
        navigate('/');
      } else {
        const u = await signUp(email, name, password, role);
        console.log('Sign up successful', u);
        navigate('/');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setErrorMsg('');
    try {
      await signIn(demoEmail, 'password123');
      navigate('/');
    } catch (err: any) {
      setErrorMsg('Demo authentication failed.');
    }
  };

  return (
    <div className="py-12 max-w-lg mx-auto space-y-8 text-left">
      
      {/* Container Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
        
        {/* Logo indicator */}
        <div className="flex justify-center flex-col items-center gap-1.5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#008D7F] flex items-center justify-center text-white font-bold text-2xl shadow-md">
            EB
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-gray-800">Welcome to EcoBazar</h2>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Premium Traditional Crafts & Gadgets Store</p>
          </div>
        </div>

        {/* Action tabs selectors */}
        <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-gray-50 border border-gray-100/50 rounded-2xl">
          <button
            onClick={() => {
              setActiveTab('signin');
              setErrorMsg('');
            }}
            className={`py-3 text-xs font-bold rounded-xl transition ${
              activeTab === 'signin' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg('');
            }}
            className={`py-3 text-xs font-bold rounded-xl transition ${
              activeTab === 'signup' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl">
            <p className="text-xs text-rose-700 font-bold">{errorMsg}</p>
          </div>
        )}

        {/* Input Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <UserIcon className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50/50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-xs font-semibold focus:outline-none focus:border-[#008D7F] text-gray-800"
                  placeholder="e.g. Zarin Tasnim"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Mail className="w-4.5 h-4.5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50/50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-xs font-semibold focus:outline-none focus:border-[#008D7F] text-gray-800"
                placeholder="e.g. user@ecobazar.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50/50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-xs font-semibold focus:outline-none focus:border-[#008D7F] text-gray-800"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {activeTab === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-xs font-bold focus:outline-none focus:border-[#008D7F] text-gray-650"
              >
                <option value="user">Customer (Shopper)</option>
                <option value="delivery">Delivery Personnel (Logistics)</option>
                <option value="admin">Administrator (Shop Owner)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#008D7F] hover:bg-[#9c1343] text-white font-extrabold text-sm rounded-xl transition shadow flex items-center justify-center gap-2 pt-4 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : activeTab === 'signin' ? (
              'Sign In Account'
            ) : (
              'Register Account'
            )}
          </button>
        </form>

        {/* Demo Fast Triggers */}
        <div className="pt-6 border-t border-gray-100 space-y-3 text-center">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pl-3 border-l-2 border-[#008D7F]">
            One-Click Demo Roles
          </span>
          
          <div className="grid grid-cols-3 gap-2 pt-1.5">
            <button
              onClick={() => handleDemoLogin('admin@ecobazar.com')}
              className="bg-teal-50 hover:bg-teal-100 border border-teal-100 p-2.5 rounded-xl transition font-black text-[10px] text-[#008D7F]"
            >
              Admin Owner
            </button>
            <button
              onClick={() => handleDemoLogin('delivery@ecobazar.com')}
              className="bg-amber-50 hover:bg-amber-100 border border-amber-100 p-2.5 rounded-xl transition font-black text-[10px] text-amber-700"
            >
              Delivery Log
            </button>
            <button
              onClick={() => handleDemoLogin('user@ecobazar.com')}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-100 p-2.5 rounded-xl transition font-black text-[10px] text-blue-700"
            >
              Customer Cap
            </button>
          </div>
          
          <p className="text-[9px] text-gray-400 font-semibold select-none leading-relaxed">
            Clicking any button instantly seeds credentials and redirects to support dashboard interfaces seamlessly.
          </p>
        </div>

      </div>

    </div>
  );
};
