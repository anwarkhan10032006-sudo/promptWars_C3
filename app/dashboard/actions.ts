'use server';

import { revalidatePath } from 'next/cache';
import { 
  insertActivityLog, 
  getSessionId, 
  completeHabit, 
  updateMissionWeekStatus 
} from '../../lib/db';
import { getSessionState, updateSessionState } from '../../lib/mockDb';
import { calculateEmissions } from '../../lib/emissions';
import { getRankedRecommendations } from '../../lib/recommendations';
import { computeTwinScenarioProjections } from '../../lib/carbon-twin';
import { Category, ActivityLog, Recommendation } from '../../types';

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Ignore when running outside Next.js request context (e.g. during testing)
  }
}

export async function quickLogActivity(data: {
  category: Category;
  subcategory: string;
  quantity: number;
  occurred_at: string;
}) {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  const emissions = calculateEmissions(data.category, data.subcategory, data.quantity);

  // 1. Insert Log
  await insertActivityLog(userId, {
    user_id: userId,
    category: data.category,
    subcategory: data.subcategory,
    quantity: data.quantity,
    unit: data.category === 'transportation' ? 'km' : data.category === 'electricity' ? 'kWh' : data.category === 'food' ? 'day' : data.category === 'shopping' ? 'USD' : 'flights',
    occurred_at: new Date(data.occurred_at).toISOString(),
    computed_emissions_kgco2e: emissions,
    source: 'manual'
  });

  // 2. Real-time Trigger Recompute (debounced or inline in mock db for live updates)
  const state = getSessionState(sessionId);
  if (state) {
    const activeRecs = getRankedRecommendations(state.activity_logs, state.goals, state.profile);
    
    // Update active recommendations set in session
    const recommendations: Recommendation[] = activeRecs.slice(0, 5).map(r => ({
      id: `rec-${Math.random().toString(36).substring(2, 9)}`,
      user_id: userId,
      category: r.category,
      action_title: r.action_title,
      action_description: r.action_description,
      predicted_impact_kgco2e_per_month: r.predicted_impact_kgco2e_per_month,
      effort_score: r.effort_score,
      confidence_score: r.confidence_score,
      rationale_text: r.rationale,
      rationale_data_points: { qty: 1 },
      status: 'active' as const,
      generated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }));

    // Recompute Twin Projections
    const totalEmissions = state.activity_logs.reduce((sum: number, l: ActivityLog) => sum + Number(l.computed_emissions_kgco2e), 0);
    const baseline = totalEmissions / 3 || 350; // simple baseline proxy
    
    const projections = computeTwinScenarioProjections({
      userId,
      baselineEmissions: baseline,
      activeRecommendations: recommendations.map(r => ({
        ruleId: r.id,
        category: r.category,
        action_title: r.action_title,
        predicted_impact_kgco2e_per_month: r.predicted_impact_kgco2e_per_month,
        effort_score: r.effort_score
      })),
      habits: state.habits,
      goals: state.goals
    });
    
    // Save state back
    updateSessionState(sessionId, (s) => {
      s.recommendations = recommendations;
      s.carbon_twin_projections = projections;
      s.activity_logs = state.activity_logs;
    });
  }

  // Refresh dashboard page
  safeRevalidatePath('/dashboard');
}

export async function completeHabitAction(habitId: string) {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  await completeHabit(userId, habitId);
  
  // Refresh page
  safeRevalidatePath('/dashboard');
}

export async function toggleMissionActionItem(weekId: string, isPrimary: boolean, completed: boolean) {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  await updateMissionWeekStatus(userId, weekId, completed ? 'completed' : 'active');
  
  // Refresh page
  safeRevalidatePath('/dashboard');
}
