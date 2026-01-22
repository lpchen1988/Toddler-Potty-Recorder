
import React, { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  CartesianGrid,
  Cell
} from 'recharts';
import { PottyEvent, ChartDataPoint } from '../types';
import { calculateLineOfBestFit, formatTime, formatDate } from '../utils/stats';

interface ChartContainerProps {
  events: PottyEvent[];
  chartWidthMultiplier: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-100 rounded-lg shadow-xl text-xs">
        <p className="font-bold text-slate-800">{formatDate(data.timestamp)}</p>
        <p className="text-slate-600 mt-1">Time: {formatTime(data.timeOfDay)}</p>
      </div>
    );
  }
  return null;
};

const ChartContainer: React.FC<ChartContainerProps> = ({ events, chartWidthMultiplier }) => {
  const chartData: ChartDataPoint[] = useMemo(() => {
    return events.map(e => {
      const date = new Date(e.timestamp);
      return {
        date: formatDate(e.timestamp),
        timestamp: e.timestamp,
        timeOfDay: date.getHours() * 60 + date.getMinutes(),
        fullDate: e.timestamp
      };
    }).sort((a, b) => a.timestamp - b.timestamp);
  }, [events]);

  const bestFitLine = useMemo(() => {
    return calculateLineOfBestFit(chartData);
  }, [chartData]);

  // Handle empty state
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
        <h3 className="text-lg font-semibold text-slate-800">Habit History</h3>
        <div className="flex gap-2 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Event
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-0.5 bg-red-400"></span> Best Fit
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar">
        <div style={{ width: containerWidth, minWidth: '100%', height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['auto', 'auto']}
                tickFormatter={formatDate}
                stroke="#94a3b8"
                fontSize={12}
                tick={{ fill: '#94a3b8' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                dataKey="timeOfDay"
                type="number"
                domain={[0, 1440]}
                tickFormatter={formatTime}
                ticks={[0, 360, 720, 1080, 1440]}
                stroke="#94a3b8"
                fontSize={12}
                tick={{ fill: '#94a3b8' }}
                axisLine={{ stroke: '#e2e8f0' }}
                name="Time"
              />
              <ZAxis range={[100, 200]} />
              <Tooltip content={<CustomTooltip />} />
              
              <Scatter data={chartData} fill="#3b82f6" fillOpacity={0.6}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} stroke="#2563eb" strokeWidth={2} />
                ))}
              </Scatter>

              {bestFitLine.length > 1 && (
                <Line
                  data={bestFitLine}
                  type="monotone"
                  dataKey="y"
                  stroke="#f87171"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={false}
                  isAnimationActive={false}
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-400 text-center italic">
        Tip: Scroll horizontally to see older history. Use the zoom slider to expand the timeline.
      </p>
    </div>
  );
};

export default ChartContainer;
