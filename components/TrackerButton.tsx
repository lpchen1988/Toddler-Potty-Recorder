
import React, { useState } from 'react';
import { EventType } from '../types';

interface TrackerButtonProps {
  onLog: (type: EventType) => void;
}

const TrackerButton: React.FC<TrackerButtonProps> = ({ onLog }) => {
  const [animatingType, setAnimatingType] = useState<EventType | null>(null);
  const [showMealPicker, setShowMealPicker] = useState(false);

  const handleClick = (type: EventType) => {
    if (type === 'meal') {
      setShowMealPicker(true);
      return;
    }
    setAnimatingType(type);
    onLog(type);
    setTimeout(() => setAnimatingType(null), 500);
  };

  const handleMealSelect = (mealType: EventType) => {
    setAnimatingType('meal');
    onLog(mealType);
    setShowMealPicker(false);
    setTimeout(() => setAnimatingType(null), 500);
  };

  return (
    <div className="flex flex-col gap-6 w-full relative">
      {/* Floating Meal Picker (No Dark Backdrop) */}
      {showMealPicker && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Transparent Overlay (Invisible but catches clicks) */}
          <div 
            className="absolute inset-0 bg-transparent"
            onClick={() => setShowMealPicker(false)}
          />
          
          {/* Floating Card */}
          <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-8 animate-in fade-in zoom-in duration-300 border border-slate-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🍎</span>
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Which Meal?</h2>
              <p className="text-sm text-slate-500 mt-1">Select the meal you are logging</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { type: 'breakfast', label: 'Breakfast', emoji: '🍳', color: 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100' },
                { type: 'lunch', label: 'Lunch', emoji: '🥪', color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' },
                { type: 'dinner', label: 'Dinner', emoji: '🍝', color: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' },
                { type: 'snack', label: 'Snack', emoji: '🍌', color: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100' },
              ].map((m) => (
                <button
                  key={m.type}
                  onClick={() => handleMealSelect(m.type as EventType)}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-3xl border-2 transition-all active:scale-95 ${m.color}`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="font-bold text-sm uppercase tracking-tight">{m.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowMealPicker(false)}
              className="w-full mt-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Triggers Section */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
        <div className="flex justify-around items-start gap-2 w-full mb-6">
          {/* Wakeup Trigger */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <button
              onClick={() => handleClick('wakeup')}
              disabled={!!animatingType}
              className={`
                relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
                ${animatingType === 'wakeup' ? 'scale-90 bg-amber-500' : 'bg-amber-400 hover:bg-amber-500 active:scale-95'}
                shadow-[0_4px_15px_-3px_rgba(251,191,36,0.3)]
              `}
            >
              <span className="text-2xl">☀️</span>
              {animatingType === 'wakeup' && (
                <div className="absolute inset-0 rounded-2xl animate-ping bg-amber-300 opacity-30"></div>
              )}
            </button>
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight leading-tight block">Wakeup</span>
            </div>
          </div>

          {/* Meal Trigger */}
          <div className="flex flex-col items-center gap-3 flex-1 border-x border-slate-50">
            <button
              onClick={() => handleClick('meal')}
              disabled={!!animatingType}
              className={`
                relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
                ${animatingType === 'meal' ? 'scale-90 bg-emerald-600' : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95'}
                shadow-[0_4px_15px_-3px_rgba(16,185,129,0.3)]
              `}
            >
              <span className="text-2xl">🍎</span>
            </button>
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight leading-tight block">Meal</span>
            </div>
          </div>

          {/* Nap Trigger */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <button
              onClick={() => handleClick('nap')}
              disabled={!!animatingType}
              className={`
                relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
                ${animatingType === 'nap' ? 'scale-90 bg-indigo-600' : 'bg-indigo-500 hover:bg-indigo-600 active:scale-95'}
                shadow-[0_4px_15px_-3px_rgba(99,102,241,0.3)]
              `}
            >
              <span className="text-2xl">😴</span>
              {animatingType === 'nap' && (
                <div className="absolute inset-0 rounded-2xl animate-ping bg-indigo-400 opacity-25"></div>
              )}
            </button>
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight leading-tight block">Nap</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-800">Log a Potty Trigger</h3>
          <p className="text-sm text-slate-500 mt-1">Tap events that usually lead to a potty visit</p>
        </div>
      </div>

      {/* Primary Hero Section: Potty Event */}
      <div className="w-full flex flex-col items-center justify-center p-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <button
          onClick={() => handleClick('potty')}
          disabled={!!animatingType}
          className={`
            relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300
            ${animatingType === 'potty' ? 'scale-90 bg-blue-600' : 'bg-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95'}
            shadow-[0_10px_40px_-10px_rgba(59,130,246,0.5)]
          `}
        >
          <span className="text-4xl">💩</span>
          {animatingType === 'potty' && (
            <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-25"></div>
          )}
        </button>
        <div className="mt-6 text-center">
          <h3 className="text-lg font-bold text-slate-800">Log a Potty Event</h3>
          <p className="text-sm text-slate-500 mt-1">Tap whenever your child goes #2</p>
        </div>
      </div>
    </div>
  );
};

export default TrackerButton;
