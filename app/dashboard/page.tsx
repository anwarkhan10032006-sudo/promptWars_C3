import React from 'react';
import { redirect } from 'next/navigation';
import { 
  getUserProfile, getActivityLogs, getGoals, getHabits, 
  getPersona, getCarbonTwinProjections, getMissions, getMissionWeeks, getSessionId 
} from '../../lib/db';
import { DashboardClient } from './DashboardClient';
import { Navigation } from '../../components/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  // Fetch profile first to check initialization
  const profile = await getUserProfile(userId);
  if (!profile) {
    // If not onboarded or demo profile not loaded, redirect to selector
    redirect('/demo');
  }

  // Fetch all user metrics in parallel
  const [
    logs,
    goals,
    habits,
    persona,
    projections,
    missions
  ] = await Promise.all([
    getActivityLogs(userId),
    getGoals(userId),
    getHabits(userId),
    getPersona(userId),
    getCarbonTwinProjections(userId),
    getMissions(userId)
  ]);

  // Fetch mission weeks if an active mission exists
  const activeMission = missions.find(m => m.status === 'active');
  const missionWeeks = activeMission 
    ? await getMissionWeeks(userId, activeMission.id) 
    : [];

  return (
    <Navigation userProfile={profile}>
      <DashboardClient 
        profile={profile}
        logs={logs}
        goals={goals}
        habits={habits}
        persona={persona}
        projections={projections}
        activeMission={activeMission}
        missionWeeks={missionWeeks}
      />
    </Navigation>
  );
}
