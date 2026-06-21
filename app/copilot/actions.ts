'use server';

import { getSessionId, getUserProfile, getActivityLogs, getGoals, getHabits, getPersona, getCarbonTwinProjections, getMissions } from '../../lib/db';
import { AiGateway } from '../../lib/ai-gateway';

export async function askCopilot(query: string) {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  // Gather user context for RAG
  const [
    profile,
    logs,
    goals,
    habits,
    persona,
    projections,
    missions
  ] = await Promise.all([
    getUserProfile(userId),
    getActivityLogs(userId),
    getGoals(userId),
    getHabits(userId),
    getPersona(userId),
    getCarbonTwinProjections(userId),
    getMissions(userId)
  ]);

  const activeMission = missions.find(m => m.status === 'active');
  const missionWeeks = activeMission 
    ? await require('../../lib/db').getMissionWeeks(userId, activeMission.id)
    : [];

  const context = {
    profile,
    activity_logs: logs.slice(0, 20), // Send recent logs
    goals,
    habits: habits.map(h => ({ habit_title: h.habit_title, streak: h.streak_count, savings: h.linked_emission_savings_kgco2e })),
    persona,
    carbon_twin_projections: projections,
    active_mission: activeMission ? { mission: activeMission, weeks: missionWeeks } : null
  };

  // Enforce Demo Mode Rate Limiting / Guardrails
  if (profile?.is_demo || userId.startsWith('user-')) {
    // Demo Mode AI Call check: verify length or throw artificial delay to restrict abuse
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const reply = await AiGateway.generateCopilotResponse(query, context);
  return reply;
}
