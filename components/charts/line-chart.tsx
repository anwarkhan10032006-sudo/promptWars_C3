'use client';

import React, { useState } from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../lib/utils';

interface LineChartItem {
  date: string;
  actual?: number;
  forecast?: number;
  lowerBound?: number;
  upperBound?: number;
}

interface LineChartProps {
  data: LineChartItem[];
  title?: string;
  className?: string;
}

export function LineChart({ data, title, className }: LineChartProps) {
  const [showTable, setShowTable] = useState(false);

  return (
    <div className={cn('bg-surface border border-border p-6 rounded-xl flex flex-col space-y-4 shadow-sm', className)}>
      <div className="flex justify-between items-center">
        {title && <h3 className="font-semibold text-text-primary font-display text-lg">{title}</h3>}
        <button
          onClick={() => setShowTable(!showTable)}
          className="text-xs font-medium text-primary hover:underline focus:outline-none cursor-pointer"
        >
          {showTable ? 'Show Chart' : 'Show Data Table'}
        </button>
      </div>

      {!showTable ? (
        <div className="h-[240px] w-full">
          {data.length === 0 ? (
            <p className="text-text-muted text-sm text-center pt-24">No forecast data to display.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={240}>
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                  formatter={(value: any, name: any) => {
                    if (name === 'actual') return [`${value} kg`, 'Actual Emissions'];
                    if (name === 'forecast') return [`${value} kg`, 'Forecasted Emissions'];
                    if (name === 'band') return [`[${value[0]}, ${value[1]}] kg`, 'Confidence Interval'];
                    return [value, name];
                  }}
                />
                
                {/* Confidence Band Area */}
                <Area 
                  type="monotone" 
                  dataKey={(d) => [d.lowerBound, d.upperBound]} 
                  name="band"
                  stroke="none" 
                  fill="url(#colorBand)" 
                />

                {/* Forecast Line (Dashed) */}
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  name="forecast"
                  stroke="var(--color-primary)" 
                  strokeDasharray="5 5" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: 'var(--color-primary)' }}
                />

                {/* Actual Line (Solid) */}
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="actual"
                  stroke="var(--color-category-food)" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: 'var(--color-category-food)' }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      ) : (
        /* Accessible Table Fallback */
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-surface-elevated">
              <tr>
                <th scope="col" className="px-4 py-2 text-left font-medium text-text-secondary">Date/Month</th>
                <th scope="col" className="px-4 py-2 text-right font-medium text-text-secondary">Actual (kg CO2e)</th>
                <th scope="col" className="px-4 py-2 text-right font-medium text-text-secondary">Forecast (kg CO2e)</th>
                <th scope="col" className="px-4 py-2 text-right font-medium text-text-secondary">Confidence Band</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-surface-elevated/40">
                  <td className="px-4 py-2 text-text-primary">{item.date}</td>
                  <td className="px-4 py-2 text-right font-tabular text-text-secondary">
                    {item.actual !== undefined ? item.actual.toFixed(1) : '-'}
                  </td>
                  <td className="px-4 py-2 text-right font-tabular text-text-secondary">
                    {item.forecast !== undefined ? item.forecast.toFixed(1) : '-'}
                  </td>
                  <td className="px-4 py-2 text-right font-tabular text-text-secondary">
                    {item.lowerBound !== undefined && item.upperBound !== undefined
                      ? `[${item.lowerBound.toFixed(0)} - ${item.upperBound.toFixed(0)}]`
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
