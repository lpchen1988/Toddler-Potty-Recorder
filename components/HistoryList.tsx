
import React, { useMemo, useState } from 'react';
import { PottyEvent } from '../types';
import { formatTime } from '../utils/stats';

interface HistoryListProps {
  events: PottyEvent[];
  onDelete: (id: string) => void;
  onEdit: (id: string, newTimestamp: number) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ events, onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTime, setTempTime] = useState("");

  const groupedEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => b.timestamp - a.timestamp);
    const groups: { [key: string]: PottyEvent[] } = {};

    sorted.forEach(event => {
      const dateStr = new Date(event.timestamp).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(event);
    });

    return groups;
  }, [events]);

  const startEditing = (event: PottyEvent) => {
    const d = new Date(event.timestamp);
    const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    setTempTime(timeStr);
    setEditingId(event.id);
  };

  const saveEdit = (id: string) => {
    const [hours, minutes] = tempTime.split(':').map(Number);
    const event = events.find(e => e.id === id);
    if (event) {
      const newDate = new Date(event.timestamp);
      newDate.setHours(hours, minutes, 0, 0);
      onEdit(id, newDate.getTime());
    }
    setEditingId(null);
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-white rounded-3xl border border-dashed border-slate-200">
        <p className="text-slate-400 text-sm font-medium">No events recorded yet. Logs will appear here once you tap the button above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-12">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Activity History</h3>
        <span className="text-[10px] font-black text-slate-300 uppercase">{events.length} TOTAL</span>
      </div>
      
      {(Object.entries(groupedEvents) as [string, PottyEvent[]][]).map(([date, dayEvents]) => (
        <div key={date} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-50">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{date}</h4>
          </div>
          <div className="divide-y divide-slate-50">
            {dayEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between px-6 py-4 group hover:bg-slate-50/30 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-2xl select-none">💩</span>
                  {editingId === event.id ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="time" 
                        value={tempTime}
                        onChange={(e) => setTempTime(e.target.value)}
                        className="text-sm border-2 border-blue-100 rounded-xl px-3 py-1.5 focus:border-blue-500 outline-none font-bold text-slate-700"
                      />
                      <button 
                        onClick={() => saveEdit(event.id)}
                        className="bg-blue-500 text-white p-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="bg-slate-100 text-slate-500 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-black text-lg leading-tight">
                        {formatTime(new Date(event.timestamp).getHours() * 60 + new Date(event.timestamp).getMinutes())}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Successful Visit</span>
                    </div>
                  )}
                </div>
                
                {editingId !== event.id && (
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => startEditing(event)}
                      className="p-2 text-slate-200 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                      title="Edit time"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => onDelete(event.id)}
                      className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete entry"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
