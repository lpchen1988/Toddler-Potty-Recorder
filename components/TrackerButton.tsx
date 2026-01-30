import React, { useState } from 'react';
import { EventType } from '../types';

interface TrackerButtonProps {
  onLog: (type: EventType) => void;
}

const TrackerButton: React.FC<TrackerButtonProps> = ({ onLog }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    onLog('potty');
    // Brief animation feedback duration
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="flex flex-col gap-6 w-full relative">
      {/* Primary Hero Section: Potty Event */}
      <div className="w-full flex flex-col items-center justify-center py-16 px-8 bg-white rounded-[3rem] shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <button
          onClick={handleClick}
          disabled={isAnimating}
          className={`
            relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300
            ${isAnimating ? 'scale-90 bg-blue-600' : 'bg-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95'}
            shadow-[0_20px_60px_-15px_rgba(59,130,246,0.4)]
          `}
        >
          <span className="text-6xl select-none">💩</span>
          {isAnimating && (
            <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-25"></div>
          )}
        </button>
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Log a Potty Event</h2>
          <p className="text-slate-500 mt-3 font-medium max-w-[240px] mx-auto leading-relaxed">
            Tap the button every time your child goes #2.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackerButton;