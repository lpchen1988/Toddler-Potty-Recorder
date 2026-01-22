
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onAddChild: () => void;
  onAddPartner: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onAddChild, onAddPartner }) => {
  return (
    <header className="bg-white border-b border-slate-200 py-4 px-4 mb-6 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100">
            <span className="text-lg">💩</span>
          </div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight hidden sm:block">Potty Tracker</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onAddPartner}
            className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
            title="Add Partner"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          </button>

          <button 
            onClick={onAddChild}
            className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
            title="Add Child"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 hover:bg-slate-100 transition-colors ml-2"
          >
            <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-600">{user.name[0].toUpperCase()}</span>
            </div>
            <span className="text-xs font-bold text-slate-700 hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
