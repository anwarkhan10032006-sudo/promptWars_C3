'use client';

import React, { useState } from 'react';
import { MissionWeek, Recommendation } from '../../types';
import { DifficultyBadge } from './difficulty-badge';
import { cn } from '../../lib/utils';
import { CheckSquare2, Square, CalendarRange, CheckCircle2 } from 'lucide-react';

interface MissionWeekCardProps {
  week: MissionWeek;
  primaryRec: Recommendation | undefined;
  secondaryRec: Recommendation | undefined;
  onToggleAction: (weekId: string, isPrimary: boolean, completed: boolean) => void;
  className?: string;
}

export function MissionWeekCard({ week, primaryRec, secondaryRec, onToggleAction, className }: MissionWeekCardProps) {
  // Local check states (initialized based on completed status or week status)
  const isWeekCompleted = week.status === 'completed';
  const [primaryChecked, setPrimaryChecked] = useState(isWeekCompleted);
  const [secondaryChecked, setSecondaryChecked] = useState(isWeekCompleted);

  const handleToggle = (isPrimary: boolean) => {
    if (week.status !== 'active') return; // Can only toggle active week actions

    if (isPrimary) {
      const nextVal = !primaryChecked;
      setPrimaryChecked(nextVal);
      onToggleAction(week.id, true, nextVal);
    } else {
      const nextVal = !secondaryChecked;
      setSecondaryChecked(nextVal);
      onToggleAction(week.id, false, nextVal);
    }
  };

  const statusStyles = {
    pending: 'bg-surface/50 border-border opacity-70',
    active: 'bg-surface border-primary ring-2 ring-primary/10 shadow-md',
    completed: 'bg-category-food/5 border-category-food shadow-sm',
    missed: 'bg-danger/5 border-danger/25 opacity-70'
  };

  return (
    <div className={cn(
      'border p-5 rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden transition-all duration-300',
      statusStyles[week.status],
      className
    )}>
      {/* Background Badge for Completed weeks */}
      {week.status === 'completed' && (
        <div className="absolute -right-4 -bottom-4 opacity-10 text-category-food">
          <CheckCircle2 className="h-24 w-24" />
        </div>
      )}

      <div>
        {/* Header block */}
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Week {week.week_number} Plan</span>
            <h4 className="text-lg font-bold font-display text-text-primary mt-0.5">
              {week.status === 'active' && 'Current Mission Target'}
              {week.status === 'completed' && 'Target Achieved!'}
              {week.status === 'pending' && 'Upcoming Target'}
              {week.status === 'missed' && 'Goal Missed'}
            </h4>
          </div>
          <DifficultyBadge level={week.difficulty} />
        </div>

        {/* Expected Carbon Reduction info */}
        <div className="mt-3 py-2 px-3 bg-surface-elevated border border-border/40 rounded-lg inline-flex items-center space-x-2 text-xs">
          <CalendarRange className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium text-text-secondary">Expected Reduction:</span>
          <span className="font-bold text-text-primary font-tabular">-{week.expected_reduction_kgco2e} kg CO2e</span>
        </div>

        {/* Actions List */}
        <div className="mt-5 space-y-3 relative z-10">
          
          {/* Action 1: Primary */}
          {primaryRec && (
            <div 
              onClick={() => handleToggle(true)}
              className={cn(
                'flex items-start space-x-3 p-3 rounded-xl border border-border/60 transition-all duration-120',
                week.status === 'active' ? 'cursor-pointer hover:bg-surface-elevated' : 'pointer-events-none',
                primaryChecked && 'bg-category-food/10 border-category-food/30 text-text-primary'
              )}
            >
              <div className="mt-0.5 flex-shrink-0 text-primary">
                {primaryChecked ? <CheckSquare2 className="h-5 w-5 text-category-food" /> : <Square className="h-5 w-5 text-text-muted" />}
              </div>
              <div>
                <h5 className={cn('text-sm font-semibold text-text-primary leading-tight', primaryChecked && 'line-through text-text-muted')}>
                  {primaryRec.action_title}
                </h5>
                <p className="text-xs text-text-secondary mt-1 leading-snug">{primaryRec.action_description}</p>
                <div className="mt-2 text-[10px] font-bold text-primary tracking-wide uppercase">Primary action</div>
              </div>
            </div>
          )}

          {/* Action 2: Secondary */}
          {secondaryRec && (
            <div 
              onClick={() => handleToggle(false)}
              className={cn(
                'flex items-start space-x-3 p-3 rounded-xl border border-border/60 transition-all duration-120',
                week.status === 'active' ? 'cursor-pointer hover:bg-surface-elevated' : 'pointer-events-none',
                secondaryChecked && 'bg-category-food/10 border-category-food/30 text-text-primary'
              )}
            >
              <div className="mt-0.5 flex-shrink-0 text-primary">
                {secondaryChecked ? <CheckSquare2 className="h-5 w-5 text-category-food" /> : <Square className="h-5 w-5 text-text-muted" />}
              </div>
              <div>
                <h5 className={cn('text-sm font-semibold text-text-primary leading-tight', secondaryChecked && 'line-through text-text-muted')}>
                  {secondaryRec.action_title}
                </h5>
                <p className="text-xs text-text-secondary mt-1 leading-snug">{secondaryRec.action_description}</p>
                <div className="mt-2 text-[10px] font-bold text-text-muted tracking-wide uppercase">Secondary action</div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Week Progress Footer */}
      {week.status === 'active' && (
        <div className="mt-4 pt-3 border-t border-border/40 text-xs font-semibold text-text-muted flex justify-between items-center">
          <span>Week Completion</span>
          <span className="text-primary font-tabular">
            {Number(primaryChecked) + Number(secondaryChecked)} / 2 Actions Done
          </span>
        </div>
      )}
    </div>
  );
}
