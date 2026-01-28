
import React, { useState } from 'react';
import { db } from '../utils/db';
import { User } from '../types';

interface AuthFlowProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'signup' | 'reset';

const AuthFlow: React.FC<AuthFlowProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup fields
  const [signupEmail, setSignupEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [partnerToken, setPartnerToken] = useState('');

  // Reset fields
  const [resetEmail, setResetEmail] = useState('');

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      const user = await db.login(loginEmail, loginPassword);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const user = await db.signup({
        email: signupEmail,
        firstName,
        lastName,
        password: signupPassword,
        partnerToken: partnerToken || undefined
      });
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    // Mock reset logic
    setTimeout(() => {
      setSuccess("A reset link has been sent to your email.");
      setLoading(false);
    }, 1000);
  };

  const switchMode = (newMode: AuthMode) => {
    resetMessages();
    setMode(newMode);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50 py-12">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-100 rotate-3 transition-transform duration-300">
            <span className="text-3xl">💩</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Potty Tracker
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            {mode === 'login' ? 'Welcome back!' : mode === 'signup' ? 'Create your profile' : 'Reset your password'}
          </p>
        </div>

        {/* Form Error/Success */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl animate-in fade-in zoom-in duration-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold rounded-2xl animate-in fade-in zoom-in duration-200">
            {success}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email</label>
              <input 
                required type="email" value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Password</label>
              <input 
                required type="password" value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
                placeholder="••••••••"
              />
            </div>
            <div className="text-right px-2">
              <button 
                type="button" onClick={() => switchMode('reset')}
                className="text-xs font-bold text-blue-500 hover:text-blue-600"
              >
                Forgot Password?
              </button>
            </div>
            <button 
              type="submit" disabled={loading}
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Log In'}
            </button>
            <div className="pt-4 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account? {' '}
                <button type="button" onClick={() => switchMode('signup')} className="font-black text-blue-500 hover:underline">Sign Up</button>
              </p>
            </div>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">First Name</label>
                <input 
                  required type="text" value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 text-sm"
                  placeholder="John"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Last Name</label>
                <input 
                  required type="text" value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email</label>
              <input 
                required type="email" value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                className="w-full px-6 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 text-sm"
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Password</label>
              <input 
                required type="password" value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                className="w-full px-6 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 text-sm"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Confirm Password</label>
              <input 
                required type="password" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-6 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 text-sm"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1 border-t border-slate-50 pt-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-4">Partner Token (Optional)</label>
              <input 
                type="text" value={partnerToken}
                onChange={e => setPartnerToken(e.target.value)}
                className="w-full px-6 py-3.5 bg-indigo-50/50 border-2 border-indigo-100 focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 text-sm"
                placeholder="EX: FAM123"
              />
              <p className="text-[10px] text-slate-400 ml-4 italic">Join an existing family account.</p>
            </div>
            <button 
              type="submit" disabled={loading}
              className="w-full bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
            </button>
            <div className="pt-2 text-center">
              <p className="text-sm text-slate-500">
                Already have an account? {' '}
                <button type="button" onClick={() => switchMode('login')} className="font-black text-blue-500 hover:underline">Log In</button>
              </p>
            </div>
          </form>
        )}

        {/* RESET FORM */}
        {mode === 'reset' && (
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email</label>
              <input 
                required type="email" value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
                placeholder="email@example.com"
              />
            </div>
            <button 
              type="submit" disabled={loading}
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send Reset Link'}
            </button>
            <div className="pt-4 text-center">
              <button type="button" onClick={() => switchMode('login')} className="text-sm font-black text-slate-400 hover:text-slate-600">Back to Login</button>
            </div>
          </form>
        )}

        <p className="mt-8 text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest px-8 leading-relaxed">
          Secured with end-to-end local encryption.
        </p>
      </div>
    </div>
  );
};

export default AuthFlow;
