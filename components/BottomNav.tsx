
import React from 'react';

interface BottomNavProps {
  activeTab: 'log' | 'stats';
  onTabChange: (tab: 'log' | 'stats') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        <button
          onClick={() => onTabChange('log')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            activeTab === 'log' ? 'text-blue-500' : 'text-slate-400'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-[10px] font-bold uppercase mt-1">Log</span>
        </button>
        <button
          onClick={() => onTabChange('stats')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            activeTab === 'stats' ? 'text-blue-500' : 'text-slate-400'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-[10px] font-bold uppercase mt-1">Stats</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
