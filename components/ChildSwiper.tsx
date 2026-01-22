
import React from 'react';
import { Child } from '../types';

interface ChildSwiperProps {
  children: Child[];
  activeChildId: string | null;
  onSelect: (childId: string) => void;
}

const ChildSwiper: React.FC<ChildSwiperProps> = ({ children, activeChildId, onSelect }) => {
  if (children.length === 0) return null;

  return (
    <div className="relative mb-6">
      <div className="flex items-center gap-4 overflow-x-auto pb-4 px-2 snap-x custom-scrollbar">
        {children.map(child => (
          <button
            key={child.id}
            onClick={() => onSelect(child.id)}
            className={`
              snap-center shrink-0 px-6 py-3 rounded-2xl font-bold transition-all
              ${activeChildId === child.id 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-100' 
                : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}
            `}
          >
            {child.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChildSwiper;
