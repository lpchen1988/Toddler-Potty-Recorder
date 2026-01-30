
import React, { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import { PottyEvent } from '../types';
import { formatTime } from '../utils/stats';

interface ChartContainerProps {
  events: PottyEvent[];
  chartWidthMultiplier: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-100 rounded-lg shadow-xl text-xs">
        <p className="font-bold text-slate-800">{formatTime(data.timeOfDay)}</p>
        <p className="text-blue-600 mt-1 font-black">Occurrences: {data.count}</p>
      </div>
    );
  }
  return null;
};

const ChartContainer: React.FC<ChartContainerProps> = ({ events, chartWidthMultiplier }) => {
  const chartData = useMemo(() => {
    // 1. Group events by their minute of the day (0 - 1439)
    const frequencyMap: Record<number, number> = {};
    
    events.forEach(e => {
      const date = new Date(e.timestamp);
      const minutes = date.getHours() * 60 + date.getMinutes();
      frequencyMap[minutes] = (frequencyMap[minutes] || 0) + 1;
    });

    // 2. Convert to array for Recharts
    return Object.entries(frequencyMap).map(([minutes, count]) => ({
      timeOfDay: parseInt(minutes),
      count: count
    })).sort((a, b) => a.timeOfDay - b.timeOfDay);
  }, [events]);

  // Determine ticks based on zoom level
  const ticks = useMemo(() => {
    const baseTicks = [0, 180, 360, 540, 720, 900, 1080, 1260, 1440]; // Every 3 hours
    if (chartWidthMultiplier > 2.5) {
      // Add more granular ticks if zoomed in (every hour)
      const hourly = [];
      for(let i=0; i<=1440; i+=60) hourly.push(i);
      return hourly;
    }
    return baseTicks;
  }, [chartWidthMultiplier]);

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center justify-center h-64">
        <p className="text-slate-400 italic">No events logged yet. Start tracking to see patterns!</p>
      </div>
    );
  }

  const containerWidth = `${100 * chartWidthMultiplier}%`;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Daily Frequency Map</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cumulative events by time of day</p>
        </div>
        <div className="flex gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
          {events.length} TOTAL LOGS
        </div>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar">
        <div style={{ width: containerWidth, minWidth: '100%', height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 40, bottom: 60, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f1f5f9" />
              <XAxis
                dataKey="timeOfDay"
                type="number"
                domain={[0, 1440]}
                tickFormatter={formatTime}
                ticks={ticks}
                stroke="#94a3b8"
                fontSize={10}
                fontWeight="700"
                tick={{ fill: '#94a3b8', angle: -45, textAnchor: 'end', dy: 10 }}
                axisLine={{ stroke: '#f1f5f9' }}
                name="Time"
              />
              <YAxis
                dataKey="count"
                type="number"
                domain={[0, 'auto']}
                allowDecimals={false}
                stroke="#94a3b8"
                fontSize={10}
                fontWeight="700"
                tick={{ fill: '#94a3b8' }}
                axisLine={{ stroke: '#f1f5f9' }}
                label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
              />
              <ZAxis range={[60, 61]} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              
              <Scatter data={chartData} fill="#3b82f6" isAnimationActive={true}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.count > 2 ? "#6366f1" : "#3b82f6"} 
                    stroke="#fff" 
                    strokeWidth={2}
                    className="drop-shadow-sm"
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest px-4">
        <span>Midnight</span>
        <span>Noon</span>
        <span>Midnight</span>
      </div>
    </div>
  );
};

export default ChartContainer;
