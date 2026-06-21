import { describe, it, expect } from 'vitest';
import { signupAction } from '../../app/signup/actions';
import { 
  getUserProfile, 
  getActivityLogs, 
  getPersona, 
  getCarbonTwinProjections, 
  getMissions,
  getMissionWeeks,
  insertGoal,
  getRecommendations,
  updateRecommendationStatus
} from '../../lib/db';
import { quickLogActivity } from '../../app/dashboard/actions';
import { getFallbackCopilotReply } from '../../lib/ai-gateway';

describe('User Sustainability Journey Integration Flow', () => {
  it('runs the end-to-end user state machine transition lifecycle', async () => {
    const session = 'integration-session-temp';
    const userId = `user-${session}`;

    // 1. User Signs Up
    const signupSuccess = await signupAction('Integration Test User', 'integration@verdance.demo');
    expect(signupSuccess).toBe(true);

    const profile = await getUserProfile(userId);
    expect(profile).not.toBeNull();
    expect(profile?.full_name).toBe('Integration Test User');

    // 2. User logs standard emissions activities (driving & meals)
    await quickLogActivity({
      category: 'transportation',
      subcategory: 'Petrol Car',
      quantity: 300, // 300 km driving -> high commuter footprint
      occurred_at: new Date().toISOString()
    });

    await quickLogActivity({
      category: 'food',
      subcategory: 'Meat-Heavy Meal',
      quantity: 10,
      occurred_at: new Date().toISOString()
    });

    const logs = await getActivityLogs(userId);
    expect(logs.length).toBe(2);
    
    // Validate calculations happened on-write
    const transportationLogs = logs.filter(l => l.category === 'transportation');
    expect(transportationLogs[0].computed_emissions_kgco2e).toBe(54); // 300 * 0.18

    // 3. Evaluate Persona Classification
    const persona = await getPersona(userId);
    expect(persona).not.toBeNull();
    // High driving should classify as daily_driver or Hidden Emitter
    expect(['daily_driver', 'hidden_emitter', 'green_starter']).toContain(persona?.persona_key);

    // 4. User Sets a Reduction Goal (e.g. 15% reduction)
    const goal = await insertGoal(userId, {
      user_id: userId,
      goal_type: 'footprint_reduction_pct',
      target_value: 15,
      target_unit: 'pct',
      start_date: new Date().toISOString(),
      target_date: new Date().toISOString(),
      current_progress: 0,
      status: 'on_track'
    });
    expect(goal).toBeDefined();

    // 5. Generate and Accept recommendations based on logs and goals
    const recs = await getRecommendations(userId);
    expect(recs.length).toBeGreaterThan(0);

    const firstRec = recs[0];
    const updatedRec = await updateRecommendationStatus(userId, firstRec.id, 'accepted');
    expect(updatedRec.status).toBe('accepted');

    // 6. Verify Carbon Twin Scenario Projections react to recommendations
    const twinProjections = await getCarbonTwinProjections(userId);
    expect(twinProjections.length).toBe(3);
    const aggressive = twinProjections.find(p => p.scenario === 'aggressive')!;
    expect(aggressive.reduction_pct).toBeGreaterThan(0);
    expect(aggressive.sustainability_score).toBeGreaterThan(0);

    // 7. Mission Planner allocates Weeks
    const missions = await getMissions(userId);
    expect(missions.length).toBeGreaterThan(0);
    const activeMission = missions.find(m => m.status === 'active')!;
    const weeks = await getMissionWeeks(userId, activeMission.id);
    expect(weeks.length).toBe(4);

    // 8. AI Copilot Chat reacts dynamically to the user context
    const context = {
      profile,
      activity_logs: logs,
      goals: [goal],
      habits: [],
      persona,
      carbon_twin_projections: twinProjections,
      active_mission: { mission: activeMission, weeks }
    };

    const reply = getFallbackCopilotReply('Tell me about my emissions', context);
    expect(reply).toContain(' recorded activity logs sum to a footprint of');
    expect(reply).toContain('kg CO2e');
  });
});
