import React, { useState, useEffect } from 'react';
import { db } from '../utils/db';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Load existing accounts for the "Profiles on this Device" display
  const loadSavedAccounts = async () => {
    const accounts = await db.getAllAccounts();
    setSavedAccounts(accounts);
  };

  useEffect(() => {
    loadSavedAccounts();
  }, []);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Check if user exists
      const existingUser = await db.findUserByEmail(cleanEmail);

      if (existingUser) {
        // Known user: Log in immediately
        await db.setSession(existingUser);
        onLogin(existingUser);
      } else if (!isNewUser) {
        // Unknown user: Show name field to register
        setIsNewUser(true);
        setLoading(false);
      } else {
        // Registering new user
        if (!name.trim()) {
          setError("Please enter your name to finish.");
          setLoading(false);
          return;
        }
        // Fix: Changed call signature to match db.signup in utils/db.ts by passing a single object argument
        const newUser = await db.signup({
          email: cleanEmail,
          firstName: name.split(' ')[0] || name,
          lastName: name.split(' ').slice(1).join(' ') || '',
          password: 'local-password' // Simplified component; providing default password for storage compatibility
        });
        onLogin(newUser);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleQuickLogin = async (user: User) => {
    await db.setSession(user);
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50 py-12">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-100 rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-4xl">💩</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Potty Tracker
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-medium">
            Enter email to continue
          </p>
        </div>

        <form onSubmit={handleContinue} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
              Email Address
            </label>
            <input 
              required
              type="email" 
              value={email}
              autoFocus
              onChange={e => {
                setEmail(e.target.value);
                if (isNewUser) setIsNewUser(false); // Reset if they change email
              }}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
              placeholder="name@example.com"
            />
          </div>

          {isNewUser && (
            <div className="space-y-1 animate-in fade-in zoom-in duration-300">
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-4">
                We haven't met! What's your name?
              </label>
              <input 
                required
                type="text" 
                value={name}
                autoFocus
                onChange={e => setName(e.target.value)}
                className="w-full px-6 py-4 bg-blue-50 border-2 border-blue-200 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
                placeholder="Your Name"
              />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-xs font-bold text-center bg-red-50 py-4 px-4 rounded-2xl border border-red-100 animate-in fade-in zoom-in duration-200">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isNewUser ? 'Create Profile' : 'Continue'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest px-8 leading-relaxed">
          Your data is stored locally in this browser for privacy.
        </p>
      </div>

      {savedAccounts.length > 0 && (
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center mb-6">
            Detected Profiles
          </h3>
          <div className="flex flex-col gap-3">
            {savedAccounts.map(account => (
              <button
                key={account.id}
                onClick={() => handleQuickLogin(account)}
                className="flex items-center justify-between bg-white border border-slate-100 hover:border-blue-400 hover:shadow-lg px-6 py-4 rounded-3xl transition-all group active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center text-sm font-black group-hover:bg-blue-500 group-hover:text-white transition-all">
                    {account.name[0].toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{account.name}</p>
                    <p className="text-xs font-medium text-slate-400">{account.email}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;