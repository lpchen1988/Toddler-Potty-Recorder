
import React from 'react';
import { AIAdvice } from '../types';

interface InsightsProps {
  advice: AIAdvice | null;
  loading: boolean;
  eventCount: number;
}

const Insights: React.FC<InsightsProps> = ({ advice, loading, eventCount }) => {
  // We need at least 5 events across multiple days to start seeing a "significant" trend
  if (eventCount < 5 && !loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium">Log {5 - eventCount} more events to unlock statistical trend analysis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm transition-all mb-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Smart Predictions</h3>
          </div>
          {loading && (
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-50 rounded-2xl w-full"></div>
            <div className="h-4 bg-slate-50 rounded w-3/4"></div>
            <div className="h-4 bg-slate-50 rounded w-1/2"></div>
          </div>
        ) : advice ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl">
              <div>
                <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">Recommended Try Time</h4>
                <p className="text-indigo-900 text-2xl font-black">{advice.bestWindow}</p>
              </div>
              <div className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-bold text-center">
                High Confidence Trend
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Pattern Summary</h4>
              <p className="text-slate-700 leading-relaxed font-medium">{advice.summary}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {advice.recommendations.map((rec, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-600 font-medium leading-tight">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-sm italic text-center py-4">Waiting for trend analysis results...</p>
        )}
      </div>
    </div>
  );
};

export default Insights;
