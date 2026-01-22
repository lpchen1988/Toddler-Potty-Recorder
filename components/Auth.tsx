
import React, { useState } from 'react';
import { db } from '../utils/db';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const users = db.getUsers();

    if (mode === 'login') {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials');
      }
    } else if (mode === 'signup') {
      if (users.find(u => u.email === email)) {
        setError('User already exists');
        return;
      }

      let familyId = Math.random().toString(36).substr(2, 9);
      if (inviteToken) {
        const validatedFamilyId = db.validateToken(inviteToken);
        if (validatedFamilyId) {
          familyId = validatedFamilyId;
        } else {
          setError('Invalid or expired invitation token');
          return;
        }
      }

      const newUser: User = { 
        id: Math.random().toString(36).substr(2, 9), 
        email, 
        password, 
        name,
        familyId
      };
      db.saveUser(newUser);
      onLogin(newUser);
    } else if (mode === 'forgot') {
      const user = users.find(u => u.email === email);
      if (user) {
        setSuccess(`A reset link has been sent to ${email}`);
      } else {
        setError('No account found with that email address');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <span className="text-3xl">💩</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h1>
          <p className="text-slate-500 mt-2">
            {mode === 'forgot' 
              ? 'Enter your email to receive a recovery link' 
              : "Track and predict your child's potty habits"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Your Name</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                {mode === 'login' && (
                  <button 
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                    className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input 
                required
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          )}

          {mode === 'signup' && (
            <div className="pt-4 mt-4 border-t border-slate-100">
              <label className="block text-sm font-semibold text-indigo-600 mb-1">Partner Token (Optional)</label>
              <input 
                type="text" 
                value={inviteToken}
                onChange={e => setInviteToken(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono tracking-wider"
                placeholder="TOKEN123"
              />
              <p className="text-[10px] text-slate-400 mt-1 ml-1">If you were invited by a partner, enter their token here to share data.</p>
            </div>
          )}

          {error && <p className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg">{error}</p>}
          {success && <p className="text-green-600 text-sm font-medium text-center bg-green-50 py-2 rounded-lg">{success}</p>}

          <button 
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-600 active:scale-[0.98] transition-all"
          >
            {mode === 'login' && 'Log In'}
            {mode === 'signup' && (inviteToken ? 'Join Family' : 'Sign Up')}
            {mode === 'forgot' && 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          {mode === 'forgot' ? (
            <button 
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className="text-sm font-semibold text-slate-500 hover:text-slate-700 flex items-center justify-center gap-2 mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </button>
          ) : (
            <button 
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}
              className="text-sm font-semibold text-blue-500 hover:text-blue-600"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
