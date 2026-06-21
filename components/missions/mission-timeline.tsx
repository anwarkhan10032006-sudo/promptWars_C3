import React from 'react';
import { MissionWeek } from '../../types';
import { cn } from '../../lib/utils';
import { Check, Play } from 'lucide-react';

interface MissionTimelineProps {
  weeks: MissionWeek[];
  className?: string;
}

export function MissionTimeline({ weeks, className }: MissionTimelineProps) {
  // Sort weeks by number ascending
  const sortedWeeks = [...weeks].sort((a, b) => a.week_number - b.week_number);

  return (
    <div className={cn('bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 relative', className)}>
      
      {/* Horizontal Line background for desktop */}
      <div className="absolute hidden md:block top-1/2 left-[12%] right-[12%] h-0.5 bg-border -translate-y-1/2 z-0" />

      {sortedWeeks.map((week, idx) => {
        const isCompleted = week.status === 'completed';
        const isActive = week.status === 'active';
        const isPending = week.status === 'pending';
        const isMissed = week.status === 'missed';

        return (
          <div key={week.id || idx} className="flex-1 flex flex-row md:flex-col items-center md:text-center space-x-4 md:space-x-0 md:space-y-3 relative z-10">
            
            {/* Step circle node */}
            <div 
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm font-bold text-sm transition-all duration-200',
                isCompleted && 'bg-category-food border-category-food text-white',
                isActive && 'bg-surface border-primary text-primary ring-4 ring-primary/10',
                isPending && 'bg-surface-elevated border-border text-text-muted',
                isMissed && 'bg-danger border-danger text-white'
              )}
            >
              {isCompleted ? (
                <Check className="h-5 w-5" />
              ) : isActive ? (
                <Play className="h-4 w-4 fill-primary" />
              ) : (
                <span>{week.week_number}</span>
              )}
            </div>

            {/* Label and Info */}
            <div className="flex flex-col md:items-center text-left md:text-center">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
                Week {week.week_number}
              </span>
              <span className={cn(
                'text-[10px] font-semibold mt-0.5 uppercase tracking-wider px-1.5 py-0.5 rounded-full inline-block w-fit',
                isCompleted && 'bg-category-food/15 text-category-food',
                isActive && 'bg-primary/15 text-primary',
                isPending && 'bg-border/40 text-text-muted',
                isMissed && 'bg-danger/10 text-danger'
              )}>
                {week.status}
              </span>
              <span className="text-[10px] text-text-muted font-tabular mt-1">
                Savings: {week.expected_reduction_kgco2e} kg
              </span>
            </div>
            
          </div>
        );
      })}
    </div>
  );
}
