
import React, { useState } from 'react';

interface TrackerButtonProps {
  onLog: () => void;
}

const TrackerButton: React.FC<TrackerButtonProps> = ({ onLog }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onLog();
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 mb-8">
      <button
        onClick={handleClick}
        disabled={isAnimating}
        className={`
          relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300
          ${isAnimating ? 'scale-90 bg-blue-600' : 'bg-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95'}
          shadow-[0_10px_40px_-10px_rgba(59,130,246,0.5)]
        `}
      >
        <span className="text-4xl">💩</span>
        {isAnimating && (
          <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-25"></div>
        )}
      </button>
      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-slate-800">Log a Potty Event</h3>
        <p className="text-sm text-slate-500 mt-1">Tap the button every time your child goes #2</p>
      </div>
    </div>
  );
};

export default TrackerButton;
