'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface TimelineScrubberProps {
  value: 3 | 6 | 12;
  onChange: (val: 3 | 6 | 12) => void;
  className?: string;
}

export function TimelineScrubber({ value, onChange, className }: TimelineScrubberProps) {
  const steps = [3, 6, 12];
  
  const valueToIndex = (val: number) => {
    if (val === 3) return 0;
    if (val === 6) return 1;
    return 2;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = Number(e.target.value);
    onChange(steps[idx] as 3 | 6 | 12);
  };

  return (
    <div className={cn('flex flex-col space-y-3 w-full max-w-md mx-auto', className)}>
      <div className="flex justify-between items-center text-xs font-semibold text-text-muted uppercase tracking-wider">
        <span>Timeline Projection</span>
        <span className="text-primary font-bold">{value} Months</span>
      </div>

      <div className="relative flex items-center h-8">
        {/* Track track styling */}
        <div className="absolute left-0 right-0 h-1.5 bg-border rounded-lg" />
        
        {/* Active Fill */}
        <div 
          className="absolute left-0 h-1.5 bg-primary rounded-lg transition-all duration-200" 
          style={{ width: `${(valueToIndex(value) / 2) * 100}%` }}
        />

        {/* Range Slider */}
        <input
          type="range"
          min={0}
          max={2}
          step={1}
          value={valueToIndex(value)}
          onChange={handleSliderChange}
          className="absolute w-full h-8 bg-transparent appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-10"
        />

        {/* Visual Tick Nodes */}
        <div className="absolute left-0 right-0 flex justify-between px-1 pointer-events-none">
          {steps.map((step) => (
            <div 
              key={step} 
              className={cn(
                'w-3.5 h-3.5 rounded-full border-2 border-surface shadow-sm transition-colors duration-250',
                value === step ? 'bg-primary' : 'bg-border'
              )}
            />
          ))}
        </div>
      </div>

      {/* Tick Labels */}
      <div className="flex justify-between text-xs font-semibold text-text-secondary px-1">
        <span>3 Months</span>
        <span>6 Months</span>
        <span>12 Months</span>
      </div>
    </div>
  );
}
