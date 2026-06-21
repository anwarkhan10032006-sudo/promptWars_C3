import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionId, getUserProfile, getGoals } from '../../lib/db';
import { Navigation } from '../../components/navigation';
import { Target, TrendingDown, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const dynamic = 'force-dynamic';

export default async function GoalsPage() {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  const profile = await getUserProfile(userId);
  if (!profile) {
    redirect('/demo');
  }

  const goals = await getGoals(userId);

  return (
    <Navigation userProfile={profile}>
      <div className="space-y-8 pb-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface border border-border p-6 rounded-2xl shadow-xs">
          <div>
            <h1 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
              Reduction Goals
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Track your trajectory towards your sustainability targets.
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
            <Target className="h-6 w-6" />
          </div>
        </div>

        <div className="space-y-6">
          {goals.map((goal) => {
            const isPct = goal.target_unit === '%';
            const progressRatio = goal.current_progress / goal.target_value;
            const progressPct = Math.min(Math.max(progressRatio * 100, 0), 100);
            
            return (
              <div key={goal.id} className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1 uppercase tracking-tight">
                      {goal.goal_type.replace(/_/g, ' ')}
                    </h3>
                    <div className="flex items-center space-x-4 text-xs text-text-secondary font-medium">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Deadline: {new Date(goal.target_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingDown className="h-3.5 w-3.5" />
                        <span>Started: {new Date(goal.start_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 border",
                    goal.status === 'on_track' ? "bg-success/10 text-success border-success/20" : 
                    goal.status === 'at_risk' ? "bg-warning/10 text-warning border-warning/20" : 
                    "bg-border/50 text-text-muted border-border"
                  )}>
                    {goal.status === 'at_risk' && <AlertTriangle className="h-3.5 w-3.5" />}
                    <span>{goal.status.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="relative pt-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-text-primary">Current Progress</span>
                    <span className="text-sm font-bold text-text-primary">
                      Target: {goal.target_value}{isPct ? '%' : ` ${goal.target_unit}`}
                    </span>
                  </div>
                  
                  {/* Progress Track */}
                  <div className="h-4 bg-surface-elevated border border-border rounded-full overflow-hidden relative">
                    <div 
                      className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-out"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="mt-4 flex justify-between items-center text-xs">
                    <div className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      {goal.current_progress.toFixed(1)}{isPct ? '%' : ` ${goal.target_unit}`} achieved
                    </div>
                    <div className="text-text-secondary font-medium">
                      {progressPct.toFixed(0)}% to target
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {goals.length === 0 && (
            <div className="text-center py-20 bg-surface border border-border border-dashed rounded-3xl">
              <Target className="h-10 w-10 text-text-muted mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-text-primary mb-2">No Active Goals</h3>
              <p className="text-sm text-text-secondary max-w-sm mx-auto">
                Set a footprint reduction target to track your trajectory over time.
              </p>
            </div>
          )}
        </div>
      </div>
    </Navigation>
  );
}
