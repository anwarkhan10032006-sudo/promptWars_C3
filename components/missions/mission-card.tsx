import React from 'react';
import { Mission, MissionWeek } from '../../types';
import { CheckCircle2, Circle, Trophy, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MissionCardProps {
  mission: Mission;
  weeks: MissionWeek[];
}

export function MissionCard({ mission, weeks }: MissionCardProps) {
  const currentWeek = weeks.find(w => w.status === 'active') || weeks[0];
  const progressPct = Math.round(((mission.current_streak || 0) / 30) * 100);

  return (
    <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-border bg-accent/5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
            Active Mission
          </span>
          <span className="text-sm font-medium text-text-secondary">
            {mission.current_streak} / 30 Days
          </span>
        </div>
        <h2 className="text-xl font-bold text-text-primary">{mission.title}</h2>
        <p className="text-sm text-text-secondary mt-1">{mission.description}</p>
        
        <div className="mt-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="font-medium text-text-primary">Overall Progress</span>
            <span className="text-accent font-bold">{progressPct}%</span>
          </div>
          <div className="h-2 w-full bg-border/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.max(5, progressPct)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6 bg-surface">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">
          Week {currentWeek?.week_number || 1} Actions
        </h3>
        <div className="space-y-3">
          {(currentWeek?.action_items || []).map((item, i) => (
            <div 
              key={i} 
              className={cn(
                "flex items-center p-4 rounded-xl border transition-colors",
                item.completed ? "bg-primary/5 border-primary/20" : "bg-bg border-border hover:border-text-muted"
              )}
            >
              <div className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center mr-4 shrink-0 transition-colors",
                item.completed ? "bg-primary text-white" : "border-2 border-text-muted"
              )}>
                {item.completed && <CheckCircle2 className="h-4 w-4" />}
              </div>
              <span className={cn(
                "text-sm font-medium transition-colors",
                item.completed ? "text-text-primary line-through opacity-70" : "text-text-primary"
              )}>
                {item.task_description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
