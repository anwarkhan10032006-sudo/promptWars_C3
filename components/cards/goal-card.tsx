import React from 'react';
import { Goal } from '../../types';
import { cn } from '../../lib/utils';
import { Target, Calendar, CheckCircle } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  className?: string;
}

export function GoalCard({ goal, className }: GoalCardProps) {
  const isAchieved = goal.status === 'achieved';
  
  // Calculate completion percentage
  const pct = Math.min(100, Math.max(0, (Number(goal.current_progress) / Number(goal.target_value)) * 100));

  const statusStyles = {
    on_track: 'bg-category-food/10 text-category-food border-category-food/25',
    at_risk: 'bg-accent/10 text-accent border-accent/25',
    achieved: 'bg-primary/10 text-primary border-primary/25 font-bold',
    missed: 'bg-slate-100 text-slate-500 border-slate-200'
  };

  const statusLabels = {
    on_track: 'On Track',
    at_risk: 'At Risk',
    achieved: 'Achieved!',
    missed: 'Missed'
  };

  return (
    <div className={cn('bg-surface border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4', className)}>
      <div>
        {/* Header Block */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Smart Target</span>
              <h4 className="text-sm font-bold text-text-primary mt-0.5">
                Reduce Footprint by {goal.target_value}{goal.target_unit}
              </h4>
            </div>
          </div>
          
          <span className={cn('px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border tracking-wider', statusStyles[goal.status])}>
            {statusLabels[goal.status]}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-text-secondary">
            <span>Reduction Progress</span>
            <span className="font-tabular text-primary">{goal.current_progress.toFixed(1)}% / {goal.target_value}%</span>
          </div>
          <div className="w-full h-2.5 bg-border rounded-full overflow-hidden">
            <div 
              className={cn('h-full rounded-full transition-all duration-300', 
                goal.status === 'at_risk' ? 'bg-accent' : 'bg-primary'
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Target Date Footer */}
      <div className="pt-3.5 border-t border-border flex items-center space-x-2 text-xs text-text-muted">
        <Calendar className="h-4 w-4 text-text-muted" />
        <span>Target Date: {new Date(goal.target_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </div>
  );
}
