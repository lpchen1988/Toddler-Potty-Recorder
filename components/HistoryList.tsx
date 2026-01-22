
import React, { useMemo } from 'react';
import { PottyEvent } from '../types';
import { formatTime } from '../utils/stats';

interface HistoryListProps {
  events: PottyEvent[];
  onDelete: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ events, onDelete }) => {
  const groupedEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => b.timestamp - a.timestamp);
    const groups: { [key: string]: PottyEvent[] } = {};

    sorted.forEach(event => {
      const dateStr = new Date(event.timestamp).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(event);
    });

    return groups;
  }, [events]);

  if (events.length === 0) return null;

  return (
    <div className="space-y-6 mb-12">
      <h3 className="text-lg font-bold text-slate-800 px-2">History Log</h3>
      {Object.entries(groupedEvents).map(([date, dayEvents]) => (
        <div key={date} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{date}</h4>
          </div>
          <div className="divide-y divide-slate-50">
            {dayEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between px-4 py-3 group">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💩</span>
                  <div className="flex flex-col">
                    <span className="text-slate-700 font-medium">Number 2</span>
                    <span className="text-slate-400 font-mono text-xs">
                      {formatTime(new Date(event.timestamp).getHours() * 60 + new Date(event.timestamp).getMinutes())}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => onDelete(event.id)}
                  className="p-1.5 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
