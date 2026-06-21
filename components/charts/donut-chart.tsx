'use client';

import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { cn } from '../../lib/utils';

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DataItem[];
  title?: string;
  className?: string;
}

export function DonutChart({ data, title, className }: DonutChartProps) {
  const [showTable, setShowTable] = useState(false);
  
  const total = data.reduce((sum, item) => sum + item.value, 0);

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
        <div className="h-[240px] w-full flex items-center justify-center">
          {total === 0 ? (
            <p className="text-text-muted text-sm">No recorded emissions data to display.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={240}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(val: any) => [`${Number(val || 0).toFixed(1)} kg CO2e`, 'Emissions']}
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      ) : (
        /* Accessible Table Fallback */
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-surface-elevated">
              <tr>
                <th scope="col" className="px-4 py-2 text-left font-medium text-text-secondary">Category</th>
                <th scope="col" className="px-4 py-2 text-right font-medium text-text-secondary">Emissions (kg CO2e)</th>
                <th scope="col" className="px-4 py-2 text-right font-medium text-text-secondary">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-surface-elevated/40">
                  <td className="px-4 py-2 flex items-center space-x-2 text-text-primary">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </td>
                  <td className="px-4 py-2 text-right font-tabular text-text-secondary">{item.value.toFixed(1)}</td>
                  <td className="px-4 py-2 text-right font-tabular text-text-secondary">
                    {total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'}%
                  </td>
                </tr>
              ))}
              <tr className="bg-surface-elevated font-semibold">
                <td className="px-4 py-2 text-text-primary">Total</td>
                <td className="px-4 py-2 text-right font-tabular text-text-primary">{total.toFixed(1)}</td>
                <td className="px-4 py-2 text-right font-tabular text-text-primary">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
