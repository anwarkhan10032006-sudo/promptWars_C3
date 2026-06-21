import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionId, getUserProfile, getMissions, getMissionWeeks } from '../../lib/db';
import { Navigation } from '../../components/navigation';
import { ListChecks } from 'lucide-react';
import { MissionCard } from '../../components/missions/mission-card';

export const dynamic = 'force-dynamic';

export default async function MissionsPage() {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  const profile = await getUserProfile(userId);
  if (!profile) {
    redirect('/demo');
  }

  const missions = await getMissions(userId);
  const activeMission = missions.find(m => m.status === 'active');
  const missionWeeks = activeMission 
    ? await getMissionWeeks(userId, activeMission.id) 
    : [];

  return (
    <Navigation userProfile={profile}>
      <div className="space-y-8 pb-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface border border-border p-6 rounded-2xl shadow-xs">
          <div>
            <h1 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
              Adaptive Missions
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Your 30-day sequential challenges. Difficulty adapts based on your weekly completion rates.
            </p>
          </div>
          <div className="p-3 bg-accent/10 rounded-xl text-accent">
            <ListChecks className="h-6 w-6" />
          </div>
        </div>

        {activeMission ? (
          <MissionCard mission={activeMission} weeks={missionWeeks} />
        ) : (
          <div className="text-center py-20 bg-surface border border-border border-dashed rounded-3xl">
            <ListChecks className="h-10 w-10 text-text-muted mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-text-primary mb-2">No Active Missions</h3>
            <p className="text-sm text-text-secondary max-w-sm mx-auto">
              Start a new 30-day mission to challenge yourself and lock in long-term carbon reductions.
            </p>
          </div>
        )}
      </div>
    </Navigation>
  );
}
