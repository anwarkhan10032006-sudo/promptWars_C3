import React from 'react';
import Link from 'next/link';
import { cn } from '../../lib/utils';
import { MissionWeek, Recommendation, Habit } from '../../types';
import { HabitCard } from '../cards/habit-card';

interface DashboardMissionsProps {
  currentWeek?: MissionWeek;
  activeRecommendations: Recommendation[];
  habits: Habit[];
  onToggleMissionActionItem: (weekId: string, isPrimary: boolean, completed: boolean) => void;
  onCompleteHabit: (habitId: string) => void;
}

export const DashboardMissions = React.memo(({
  currentWeek,
  activeRecommendations,
  habits,
  onToggleMissionActionItem,
  onCompleteHabit
}: DashboardMissionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      
      {/* Active Mission Week strip */}
      <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-text-primary font-display text-base">Active 30-Day Mission</h3>
          <Link href="/missions" className="text-xs font-semibold text-primary hover:underline">
            Go to Mission Planner
          </Link>
        </div>

        {currentWeek ? (
          <div className="space-y-3">
            <div className="text-xs text-text-secondary">
              You are currently on <span className="font-bold text-text-primary">Week {currentWeek.week_number}</span>. Complete these actions to hit your weekly targets:
            </div>
            
            {/* Mission checkboxes */}
            <div className="space-y-2">
              {[
                { id: currentWeek.primary_recommendation_id, title: activeRecommendations[0]?.action_title || 'Bicycle/Walk Short Trips', isPrimary: true },
                { id: currentWeek.secondary_recommendation_id, title: activeRecommendations[1]?.action_title || 'Adopt Meatless Mondays', isPrimary: false }
              ].map((item) => {
                const isDone = currentWeek.status === 'completed'; // or local check
                return (
                  <label key={item.id} className="flex items-start space-x-3 p-3 bg-surface-elevated border border-border/40 rounded-xl cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={isDone}
                      onChange={() => onToggleMissionActionItem(currentWeek.id, item.isPrimary, !isDone)}
                      className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                    />
                    <span className={cn('text-xs font-semibold text-text-primary', isDone && 'line-through text-text-muted')}>
                      {item.title}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-text-muted">
            No active mission week found. Join a mission to start weekly targets!
          </div>
        )}
      </div>

      {/* Streak habits list */}
      <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-semibold text-text-primary font-display text-base">Smart Habits & Streaks</h3>
        <div className="space-y-3">
          {habits.slice(0, 3).map((habit) => (
            <HabitCard 
              key={habit.id} 
              habit={habit}
              onComplete={onCompleteHabit}
            />
          ))}
          {habits.length === 0 && (
            <div className="text-center py-6 text-xs text-text-muted">
              No active habits being tracked yet. Accept suggestions to populate your habits lists.
            </div>
          )}
        </div>
      </div>

    </div>
  );
});

DashboardMissions.displayName = 'DashboardMissions';
