'use client';

import React, { useState } from 'react';
import { Habit } from '../../types';
import { cn } from '../../lib/utils';
import { Check, Flame, Trophy, CalendarCheck } from 'lucide-react';
import { Button } from '../ui/button';

interface HabitCardProps {
  habit: Habit;
  onComplete?: (habitId: string) => void;
  className?: string;
}

export function HabitCard({ habit, onComplete, className }: HabitCardProps) {
  const [loading, setLoading] = useState(false);

  const categoryColors = {
    transportation: 'text-category-transportation bg-category-transportation/10',
    electricity: 'text-category-electricity bg-category-electricity/10',
    food: 'text-category-food bg-category-food/10',
    shopping: 'text-category-shopping bg-category-shopping/10',
    flights: 'text-category-flights bg-category-flights/10'
  };

  const handleComplete = async () => {
    if (!onComplete) return;
    setLoading(true);
    try {
      await onComplete(habit.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Check if completed today (rough check based on last_completed_at date)
  const isCompletedToday = habit.last_completed_at 
    ? new Date(habit.last_completed_at).toDateString() === new Date().toDateString()
    : false;

  return (
    <div className={cn('bg-surface border border-border p-4 rounded-xl shadow-sm flex items-center justify-between space-x-4', className)}>
      <div className="flex items-center space-x-3">
        {/* Category color dot/icon */}
        <div className={cn('p-2.5 rounded-lg flex-shrink-0', categoryColors[habit.category])}>
          <CalendarCheck className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-text-primary leading-tight">{habit.habit_title}</h4>
          <div className="flex items-center space-x-3 mt-1.5 text-xs text-text-muted">
            <span className="flex items-center text-accent font-semibold font-tabular">
              <Flame className="h-3.5 w-3.5 fill-accent mr-0.5" />
              <span>{habit.streak_count} Day Streak</span>
            </span>
            <span className="font-tabular">
              Saved: {habit.linked_emission_savings_kgco2e} kg
            </span>
          </div>
        </div>
      </div>

      {/* Complete Button */}
      <button
        onClick={handleComplete}
        disabled={isCompletedToday || loading}
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-120 cursor-pointer focus:outline-none',
          isCompletedToday 
            ? 'bg-category-food/10 border-category-food/30 text-category-food'
            : 'bg-surface border-border text-text-muted hover:border-primary hover:text-primary'
        )}
        aria-label={isCompletedToday ? 'Habit completed today' : 'Mark habit complete'}
      >
        {isCompletedToday ? (
          <Check className="h-5 w-5 stroke-[3]" />
        ) : (
          <Check className="h-5 w-5 stroke-[2]" />
        )}
      </button>
    </div>
  );
}
