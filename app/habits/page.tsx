import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionId, getUserProfile, getHabits } from '../../lib/db';
import { Navigation } from '../../components/navigation';
import { HabitCard } from '../../components/cards/habit-card';
import { Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HabitsPage() {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  const profile = await getUserProfile(userId);
  if (!profile) {
    redirect('/demo');
  }

  const habits = await getHabits(userId);

  return (
    <Navigation userProfile={profile}>
      <div className="space-y-8 pb-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface border border-border p-6 rounded-2xl shadow-xs">
          <div>
            <h1 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
              Habits Tracker
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Build sustainable routines and maintain your active streaks to lock in long-term emissions reductions.
            </p>
          </div>
        </div>

        {habits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-surface border border-border border-dashed rounded-3xl">
            <div className="p-4 bg-primary/5 text-primary rounded-full mb-4">
              <Layers className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">No active habits</h3>
            <p className="text-sm text-text-secondary max-w-md">
              Start a mission or accept an AI recommendation to build new sustainability habits.
            </p>
          </div>
        )}
      </div>
    </Navigation>
  );
}
